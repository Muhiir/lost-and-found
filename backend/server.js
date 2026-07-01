const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const { MemoryStore } = require('express-session');
const bcrypt = require('bcryptjs');
const { normalizeEmail, buildEmailQuery } = require('./utils/auth');

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const isProductionLike = isProduction || process.env.RENDER === 'true' || process.env.VERCEL === '1' || process.env.SESSION_SECURE === 'true';
const useSecureCookies = isProductionLike;
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/campusconnect';
const SESSION_SECRET = process.env.SESSION_SECRET || 'campusconnect-secret-2026';
const PORT = process.env.PORT || 4000;

if (isProductionLike && !process.env.DB_URL) {
  console.error('❌ Missing DB_URL environment variable. Set DB_URL in Render environment settings.');
  process.exit(1);
}

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:5173',
  'https://lost-and-found-kappa-ochre.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }

    if (/^https:\/\/(.+\.)?(vercel\.app|netlify\.app|onrender\.com|herokuapp\.com|github\.dev)$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS policy violation'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

if (isProductionLike) {
  app.set('trust proxy', 1);
}

// Basic middleware first
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session setup second
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: isProductionLike,
  store: new MemoryStore(),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: useSecureCookies ? 'none' : 'lax',
    secure: useSecureCookies,
    httpOnly: true,
    path: '/'
  }
}));

let databaseReady = false;
const memoryUsersById = new Map();
const memoryUsersByEmail = new Map();
const memoryUsersByStudentId = new Map();

const ensureUserPayload = (user) => {
  if (!user) return null;
  const payload = user.toObject ? user.toObject() : { ...user };
  const { passwordHash, ...safeUser } = payload;
  return {
    ...safeUser,
    id: safeUser._id?.toString?.() || safeUser.id,
    _id: safeUser._id?.toString?.() || safeUser.id
  };
};

const authStore = {
  async createUser({ fullName, email, studentID, passwordHash }) {
    if (databaseReady) {
      return User.create({ fullName, email, studentID, passwordHash });
    }

    const user = {
      _id: new mongoose.Types.ObjectId().toString(),
      fullName,
      email,
      studentID,
      passwordHash,
      createdAt: new Date()
    };

    memoryUsersById.set(user._id, user);
    memoryUsersByEmail.set(normalizeEmail(email), user);
    memoryUsersByStudentId.set(String(studentID).trim(), user);
    return user;
  },

  async findExistingUser(email, studentID) {
    if (databaseReady) {
      return User.findOne({ $or: [buildEmailQuery(email), { studentID: String(studentID).trim() }] });
    }

    return memoryUsersByEmail.get(normalizeEmail(email)) || memoryUsersByStudentId.get(String(studentID).trim()) || null;
  },

  async findUserByEmail(email) {
    if (databaseReady) {
      return User.findOne(buildEmailQuery(email));
    }

    return memoryUsersByEmail.get(normalizeEmail(email)) || null;
  },

  async findUserById(id) {
    if (databaseReady) {
      return User.findById(id).select('-passwordHash');
    }

    return memoryUsersById.get(String(id)) || null;
  },

  async updateProfile(id, profileData) {
    if (databaseReady) {
      return User.findByIdAndUpdate(id, { $set: profileData }, { new: true, runValidators: true }).select('-passwordHash');
    }

    const existingUser = memoryUsersById.get(String(id));
    if (!existingUser) return null;

    const updatedUser = {
      ...existingUser,
      ...profileData,
      updatedAt: new Date()
    };

    memoryUsersById.set(String(id), updatedUser);
    memoryUsersByEmail.set(normalizeEmail(updatedUser.email), updatedUser);
    memoryUsersByStudentId.set(String(updatedUser.studentID).trim(), updatedUser);
    return updatedUser;
  },

  async listUsers() {
    if (databaseReady) {
      return User.find({}).select('_id fullName email studentID');
    }

    return Array.from(memoryUsersById.values()).map((user) => ({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      studentID: user.studentID
    }));
  }
};

// MongoDB connection (can be early)
mongoose.connect(DB_URL)
  .then(() => {
    databaseReady = true;
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((err) => {
    databaseReady = false;
    console.log('⚠️ MongoDB Connection Error: continuing with in-memory auth fallback.', err.message);
  });

// Import models
const Item = require('./models/Item');
const Post = require('./models/Post');
const User = require('./models/User');
const Message = require('./models/Message');
const { validateMessagePayload } = require('./utils/messages');
const { canDeletePost } = require('./utils/posts');
const { sanitizeProfilePayload } = require('./utils/profile');

// Auth helpers
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

// Auth routes
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, studentID, password } = req.body;

    if (!fullName || !email || !studentID || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    const trimmedStudentID = String(studentID).trim();

    const existingUser = await authStore.findExistingUser(normalizedEmail, trimmedStudentID);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await authStore.createUser({ fullName: fullName.trim(), email: normalizedEmail, studentID: trimmedStudentID, passwordHash });

    req.session.userId = user._id?.toString?.() || user.id;
    req.session.user = { id: user._id?.toString?.() || user.id, fullName: user.fullName, email: user.email };

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session save failed', error: err.message });
      }
      res.status(201).json({ message: 'Registered successfully', user: req.session.user });
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await authStore.findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user._id?.toString?.() || user.id;
    req.session.user = { id: user._id?.toString?.() || user.id, fullName: user.fullName, email: user.email };

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session save failed', error: err.message });
      }
      res.json({ message: 'Logged in successfully', user: req.session.user });
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid', {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction
    });
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await authStore.findUserById(req.session.userId);
    res.json({ user: ensureUserPayload(user) });
  } catch (err) {
    res.status(500).json({ message: 'Could not load user', error: err.message });
  }
});

app.put('/me/profile', isAuthenticated, async (req, res) => {
  try {
    const profileData = sanitizeProfilePayload(req.body);
    const user = await authStore.updateProfile(req.session.userId, profileData);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.session.user = { id: user._id?.toString?.() || user.id, fullName: user.fullName, email: user.email };
    res.json({ user: ensureUserPayload(user) });
  } catch (err) {
    res.status(400).json({ message: 'Profile update failed', error: err.message });
  }
});

app.get('/me/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await authStore.findUserById(req.session.userId);
    res.json({ user: ensureUserPayload(user) });
  } catch (err) {
    res.status(500).json({ message: 'Could not load profile', error: err.message });
  }
});

// Routes
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ _id: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      postedBy: req.body.postedBy || req.session?.userId || null,
      postedByEmail: req.body.postedByEmail || req.session?.user?.email || null,
      postedByName: req.body.postedByName || req.session?.user?.fullName || null,
    });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    console.error('❌ Item Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/posts', isAuthenticated, async (req, res) => {
  try {
    const newPost = new Post({
      ...req.body,
      user: req.session.user?.fullName || 'You',
      userId: req.session.userId,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('❌ Post Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/posts/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!canDeletePost(post, req.session.userId)) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await authStore.listUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/messages', isAuthenticated, async (req, res) => {
  try {
    const { recipient, content } = validateMessagePayload(req.body);

    const recipientUser = await User.findOne({ $or: [{ _id: recipient }, { email: recipient }, { studentID: recipient }] });
    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = await Message.create({
      sender: req.session.userId,
      recipient: recipientUser._id,
      content,
    });

    await message.populate('sender', 'fullName email');
    await message.populate('recipient', 'fullName email');

    res.status(201).json({ message });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/messages', isAuthenticated, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.session.userId }, { recipient: req.session.userId }]
    })
      .populate('sender', 'fullName email')
      .populate('recipient', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Campus Connect backend is running.',
    status: 'ok',
    api: [
      '/register',
      '/login',
      '/logout',
      '/me',
      '/items',
      '/posts',
      '/messages'
    ]
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('❌ Invalid JSON payload received:', err.message);
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  next(err);
});

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️ Port ${PORT} is already in use. Please stop the other server and try again.`);
      process.exit(1);
    } else {
      console.error('❌ Server startup failed:', err);
      process.exit(1);
    }
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };