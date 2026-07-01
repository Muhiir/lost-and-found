# Campus Connect - Project Documentation

**Project Title:** Campus Connect  
**Type:** Full-Stack Web Application  
**Purpose:** Student platform for Lost & Found and campus social interaction

---

## 1. Project Overview
Campus Connect is a web application designed to help students on campus by providing a simple platform to:
- report and find lost items,
- share campus updates and social posts,
- manage their student profile,
- and access secure authentication.

The project was built to solve the problem of disconnected student communication and the difficulty of reporting or finding lost belongings on campus.

---

## 2. Features Implemented
The application includes the following features:
- Lost & Found board with item posting
- Image upload support for item posts
- Campus social feed for student posts
- User registration and login
- Session-based authentication
- Profile management
- A modern and responsive user interface

---

## 3. Technology Stack
- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Express Sessions and connect-mongo
- **Styling:** Custom CSS with modern green and white UI design

---

## 4. Approach and Methodology
The development process followed an iterative and practical approach, similar to Agile methodology.

### Development approach used:
- started with the core frontend structure,
- then added backend APIs,
- connected the app to MongoDB for persistence,
- implemented authentication and protected routes,
- and refined the UI and features through testing and feedback.

This approach helped us build the project step by step and improve it gradually.

---

## 5. Bugs Encountered and Fixes
During development, several issues were encountered and resolved:

- **MongoDB command not found**  
  Fixed by adding MongoDB to the system PATH and restarting the terminal/VS Code.

- **Missing script error in package.json**  
  Fixed by adding or correcting the required scripts such as dev and start.

- **Module not found errors**  
  Fixed by correcting import paths and ensuring the correct package versions were installed.

- **Failed to fetch / backend connection issues**  
  Fixed by confirming that the backend server and database were running correctly.

- **Deployment upload issues**  
  Resolved by using GitHub import and proper project configuration for deployment platforms.

---

## 6. Problems the Software Solved
Campus Connect helps solve several real-life student problems:
- reduces the difficulty of finding lost items on campus,
- improves communication between students,
- provides a central place for campus updates,
- and offers a simple and secure way to manage student accounts and profiles.

---

## 7. Deployment
The project was planned for deployment using modern hosting platforms:
- **Frontend:** Vercel
- **Backend:** Render or Railway

---

## 8. Conclusion
Campus Connect is a full-stack student platform that combines lost and found functionality with social interaction and profile management. The project was built using an iterative development approach and successfully addressed several real campus communication and organization needs.
