# 🎥 Real-Time Video Call Platform

A minimal, sleek video calling platform built with React and TypeScript, enabling seamless peer-to-peer video communication with an intuitive user interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Development](#development)
- [Roadmap](#roadmap)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## 🌟 Overview

This project is a **live streaming and collaborative platform** MVP that focuses on real-time video communication. Built as part of a technical assessment, it demonstrates the implementation of WebRTC technology for peer-to-peer video calls with a modern, responsive interface using **React with TypeScript** for type safety and better developer experience.

### Current Status: MVP Phase 1 ✅

- ✅ Real-time video calling (up to 4 participants)
- ✅ Room-based sessions with unique codes
- ✅ Audio/Video controls (mute, camera toggle)
- ✅ Responsive video grid layout
- ✅ Type-safe codebase with TypeScript
- ⏳ Chat feature (planned)
- ⏳ Collaborative whiteboard (planned)
- ⏳ Screen sharing (planned)

## ✨ Features

### Implemented

- **🎬 Video Calling**: Peer-to-peer video communication using WebRTC
- **🏠 Room Management**: Create or join rooms with unique codes
- **👥 Multi-participant Support**: Support for up to 4 simultaneous users
- **🎛️ Media Controls**: Toggle audio/video, end call functionality
- **📱 Responsive Design**: Optimized for desktop and tablet devices
- **🌙 Dark Theme**: Sleek, modern UI with glassmorphism effects
- **⚡ Real-time Signaling**: Socket.IO-powered WebRTC signaling
- **🔒 Type Safety**: Full TypeScript implementation across the codebase

### Coming Soon

- 💬 Real-time chat messaging
- 🎨 Collaborative whiteboard
- 🖥️ Screen sharing
- 💾 Session recording
- 📊 Participant management panel

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with Hooks and Context API
- **TypeScript 5.x** - Type-safe JavaScript superset
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling framework
- **Lucide React** - Clean, modern icon library
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Socket.IO** - WebSocket library for signaling
- **CORS** - Cross-origin resource sharing

### Communication
- **WebRTC** - Peer-to-peer video/audio streaming
- **STUN/TURN Servers** - NAT traversal and relay

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Modern browser** with WebRTC support (Chrome, Firefox, Edge, Safari)

### Installation & Setup

Follow these steps to get the project running locally:

#### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd video-call-platform
```

#### 2️⃣ Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

✅ Backend should now be running on `http://localhost:3000`

#### 3️⃣ Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (if needed):

```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

#### 4️⃣ Test the Application

1. Open your browser and go to `http://localhost:5173`
2. Enter a username and create a new room
3. Copy the room code
4. Open another browser tab (or incognito window)
5. Join the room using the copied code
6. Start video calling! 🎉

### Quick Start (One-line commands)

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

## 📁 Project Structure

```
video-call-platform/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express server setup
│   │   ├── socket.js          # Socket.IO signaling logic
│   │   └── routes/            # API routes (if any)
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.tsx    # Room join/create UI
│   │   │   ├── VideoRoom.tsx      # Main video call interface
│   │   │   └── VideoControls.tsx  # Media control buttons
│   │   ├── context/
│   │   │   └── SocketContext.tsx  # Socket.IO context provider
│   │   ├── hooks/
│   │   │   └── useWebRTC.ts       # Custom WebRTC logic hook
│   │   ├── types/
│   │   │   └── index.ts           # TypeScript type definitions
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # Entry point
│   │   └── vite-env.d.ts          # Vite type declarations
│   ├── package.json
│   ├── tsconfig.json              # TypeScript configuration
│   ├── tailwind.config.js
│   └── .env
│
└── README.md
```

### Key Files

- **`*.tsx`** - React components written in TypeScript
- **`*.ts`** - TypeScript utility files and hooks
- **`tsconfig.json`** - TypeScript compiler configuration
- **`vite.config.ts`** - Vite build configuration

## 🔧 How It Works

### WebRTC Signaling Flow

```
1. User A joins room → Socket connection established
2. User B joins same room → Server notifies User A
3. Offer/Answer Exchange → WebRTC negotiation via Socket.IO
4. ICE Candidates → NAT traversal information shared
5. Peer Connection → Direct P2P media stream established
6. Video/Audio Streaming → Real-time communication begins
```

### Room Management

- Rooms are identified by unique codes (6-character alphanumeric)
- In-memory storage for active sessions (no database in MVP)
- Automatic cleanup when all participants leave
- Maximum 4 participants per room

### Type Safety

TypeScript provides compile-time type checking for:
- Socket event payloads
- WebRTC connection states
- Component props and state
- API responses
- Custom hooks return types

## 💻 Development

### Available Scripts

#### Backend

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run lint     # Run ESLint
```

#### Frontend

```bash
npm run dev      # Start Vite dev server (with HMR)
npm run build    # Build for production (includes TypeScript check)
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run type-check # TypeScript type checking
```

### Code Style

- **ESLint** configured for TypeScript and React
- **Prettier** for consistent code formatting
- **TypeScript strict mode** enabled
- Follow React best practices and hooks guidelines
- Use functional components with TypeScript interfaces

### TypeScript Configuration

The project uses strict TypeScript settings:
- Strict null checks
- No implicit any
- No unused locals/parameters
- ES modules with React JSX transform

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Basic video calling
- [x] Room creation/joining
- [x] Media controls
- [x] TypeScript implementation

### Phase 2: Enhanced Communication (Next)
- [ ] Real-time chat panel
- [ ] Message persistence
- [ ] User presence indicators
- [ ] Typing indicators

### Phase 3: Collaboration Tools
- [ ] Interactive whiteboard
- [ ] Screen sharing
- [ ] File sharing
- [ ] Drawing tools synchronization

### Phase 4: Advanced Features
- [ ] Session recording
- [ ] Participant management
- [ ] Authentication system
- [ ] MongoDB integration
- [ ] User profiles

## 🙏 Acknowledgments

This project was developed with assistance from **[Lovable.dev](https://lovable.dev)**, an AI-powered development platform that accelerated the initial setup and component scaffolding. Lovable helped generate the foundational code structure, UI components, and WebRTC implementation with TypeScript support, allowing for rapid prototyping and iteration.

### Why TypeScript?

TypeScript was chosen for this project to provide:
- Better IDE support and autocomplete
- Early error detection during development
- Self-documenting code through type definitions
- Easier refactoring and maintenance
- Enhanced collaboration with clear type contracts

### Tools & Resources
- [WebRTC Documentation](https://webrtc.org/)
- [Socket.IO Documentation](https://socket.io/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Guide](https://vitejs.dev/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@diya0ii](https://github.com/diya0ii)
- LinkedIn: [diyavermatech](https://linkedin.com/in/diyavermatech)


---

## 🐛 Known Issues & Limitations

- Maximum 4 participants per room (P2P limitation)
- No TURN server configured (may not work behind restrictive NATs)
- Session data not persisted (in-memory only)
- No mobile support in current MVP

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note:** This is an MVP (Minimum Viable Product) developed for demonstration purposes. For production use, additional features like authentication, database persistence, TURN server configuration, and security enhancements would be recommended.

---

⭐ **If you find this project useful, please consider giving it a star!**

---

*Built with ❤️ using React, TypeScript, and WebRTC*
