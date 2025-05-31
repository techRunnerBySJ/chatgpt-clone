# ChaiBot - ChatGPT Clone

A modern web app inspired by ChatGPT, built with React, Vite, Firebase Authentication, and Tailwind CSS. Users can sign up, log in, and chat in a beautiful, responsive interface.

## Features

- **Landing Page:** Modern, minimal design with a glowing effect and easy navigation to Sign In and Sign Up.
- **Authentication:** Secure sign up and login using Firebase Authentication.
- **Chat Window:** Responsive chat interface with sidebar, glowing accents, and support for text and image messages.
- **Protected Routes:** Only authenticated users can access the chat window.
- **Modern UI:** Built with Tailwind CSS for a sleek, dark-themed look.

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd chatgpt-clone
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
- Enable Email/Password authentication.
- Copy your Firebase config and replace it in `src/firebaseConfig.js`.

### 4. Run the app
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the app.

## Usage
- **Landing Page:** Choose Sign In or Sign Up to get started.
- **Sign Up:** Create a new account with your email and password.
- **Sign In:** Log in with your credentials.
- **Chat:** Start chatting! You can send text and images.
- **Logout:** Use the profile menu in the chat window to log out.

## Tech Stack
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Tailwind CSS](https://tailwindcss.com/)

---

Feel free to customize and extend this project!
