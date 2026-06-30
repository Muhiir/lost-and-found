const mongoose = require('mongoose');
const Item = require('./models/Item');
const Post = require('./models/Post');

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/campusconnect')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Item.deleteMany({});
    await Post.deleteMany({});

    // Sample Items Data
    const sampleItems = [
      {
        type: 'lost',
        title: 'Black iPhone 13 Pro',
        description: 'Lost in the library last Tuesday. Has a cracked screen protector but phone is fine.',
        location: 'Central Library, 2nd Floor',
        category: 'Electronics',
        image: '/images/lost_iphone.jpg',
      },
      {
        type: 'found',
        title: 'Red Backpack with CSC Textbooks',
        description: 'Found near the engineering block. Contains computer science textbooks and notebooks.',
        location: 'Engineering Building Parking',
        category: 'Bag',
      },
      {
        type: 'lost',
        title: 'Blue ID Card - Ahmed Hassan',
        description: 'Lost my student ID card. Very urgent, need it for exam registration.',
        location: 'Cafeteria',
        category: 'ID',
      },
      {
        type: 'found',
        title: 'Gold Watch',
        description: 'Expensive gold watch found in the gym. No marks or damage.',
        location: 'Sports Complex Gym',
        category: 'Other',
      },
      {
        type: 'lost',
        title: 'Navy Blue Jacket',
        description: 'Lost my winter jacket with initials "JM" on the inside pocket.',
        location: 'Auditorium A',
        category: 'Clothing',
      },
      {
        type: 'found',
        title: 'Set of Keys with Green Keychain',
        description: 'Found keys in the computer lab. Has a distinctive green frog keychain.',
        location: 'Computer Lab, Room 301',
        category: 'Other',
      },
      {
        type: 'lost',
        title: 'Calculus and Physics Textbooks',
        description: 'Lost two important textbooks needed for finals. Both have my name written inside.',
        location: 'Student Center',
        category: 'Books',
      },
      {
        type: 'found',
        title: 'AirPods Pro in Case',
        description: 'Found a pair of AirPods Pro with charging case in perfect condition.',
        location: 'Library Entrance',
        category: 'Electronics',
      },
    ];

    // Sample Posts Data
    const samplePosts = [
      {
        user: 'Sarah A.',
        content: 'Anyone going for the departmental seminar today? It\'s at 2PM in Auditorium A. Really important! 📚',
        likes: 12,
      },
      {
        user: 'John Doe',
        content: 'Found a great quiet study spot in the new library wing! Highly recommend for exam prep 📚',
        likes: 18,
      },
      {
        user: 'Aisha Bello',
        content: 'Who has the past questions for CSC 301? Please help a brother out 😭',
        likes: 9,
      },
      {
        user: 'Michael Chen',
        content: 'Guys, the cafeteria is having a 30% discount today on all meals! Hurry before stock runs out 🍕',
        likes: 34,
      },
      {
        user: 'Emma Wilson',
        content: 'Just finished my thesis! Finally free 🎉 Celebrating with friends at the common room',
        likes: 45,
      },
      {
        user: 'David Okafor',
        content: 'Need study partners for Data Structures exam next week. Anyone interested?',
        likes: 7,
      },
      {
        user: 'Lisa Park',
        content: 'Sports day next Friday! Sign ups for volleyball, basketball, and football teams are open. Join us! ⚽',
        likes: 28,
      },
      {
        user: 'Ahmed Hassan',
        content: 'The Wi-Fi in Block C is acting up. IT team is aware and working on it. Sorry for the inconvenience!',
        likes: 5,
      },
      {
        user: 'Zainab Ibrahim',
        content: 'Campus orientation for new students starts tomorrow at 9 AM in the main hall. Don\'t be late! 🎓',
        likes: 22,
      },
      {
        user: 'Tom Bradley',
        content: 'Anyone want to form a study group for Chemistry? I\'m especially struggling with organic chemistry.',
        likes: 11,
      },
    ];

    // Insert Items
    console.log('📦 Seeding items...');
    const createdItems = await Item.insertMany(sampleItems);
    console.log(`✅ ${createdItems.length} items created successfully`);

    // Insert Posts
    console.log('📝 Seeding posts...');
    const createdPosts = await Post.insertMany(samplePosts);
    console.log(`✅ ${createdPosts.length} posts created successfully`);

    console.log('🎉 Database populated successfully!');
    process.exit(0);
  } catch (err) {
    console.log('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
