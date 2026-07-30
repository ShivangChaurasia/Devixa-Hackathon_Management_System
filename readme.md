<div align="center">
  <br />
  <h1>🚀 Devixa</h1>
  <p>
    <strong>The Next-Generation Operating System for Hackathons</strong>
  </p>
  <p>
    Built to eliminate friction, automate logistics, and empower builders.
  </p>
  <p>
    🌐 <strong>Live Demo:</strong> <a href="https://devixahacks.vercel.app">https://devixahacks.vercel.app</a>
  </p>
</div>

<br />

## 🌟 Overview

Devixa is a high-end, end-to-end SaaS platform engineered to revolutionize hackathon management and discovery. We recognized that incredible ideas often die in fragmented Discord servers and disjointed Google Sheets. Devixa acts as a unified command center connecting a global ecosystem of organizers, judges, and developers through a seamless, hardware-accelerated interface.

## ✨ Key Features

### 🎯 For Organizers: Mission Control
- **Automated Triage:** Smart routing processes applications instantly based on custom criteria.
- **Real-time Analytics:** Monitor registration metrics, submissions, and platform engagement as they happen.
- **Zero-Downtime Infrastructure:** Built to handle high-volume traffic spikes during registration and submission deadlines.

### ⚖️ For Judges: Zero-Distraction Evaluation
- **Live Kinetic Scoring:** Focus purely on the code and presentation with an immersive, distraction-free scoring UI. Drag to adjust parameters in real time.
- **One-Click Handshakes:** Instant conflict resolution and synchronization of judge feedback.

### 💻 For Participants: Builder-Centric Environment
- **Global Team Matching:** Find the perfect teammates instantly through algorithmic matching based on complementary skills and tech stacks.
- **Portfolio Sync:** Automatically synchronize hackathon victories, badges, and project repositories to your GitHub, LinkedIn, and native Devixa Profile.
- **Gated Profile Search:** Discover top talent across the platform with dynamic, dual-state privacy features for public and authenticated views.

## 🛠️ Tech Stack & Architecture

Devixa is built with modern, cutting-edge technologies to ensure a scalable and premium user experience:

- **Frontend:** React 19, Vite 8, Tailwind CSS v4, Framer Motion 12
- **Backend:** Node.js, Express
- **AI Integration:** Context-aware Chatbots and automated analysis agents.

### 🏗️ Architectural Highlights

- **Obsidian Kinetic Glass Design:** A premium UI utilizing deep `#09090B` backgrounds, glassmorphism, 1px gradient highlights, and volumetric depth.
- **Kinetic Node Matrix:** A custom HTML5 Canvas physics engine utilizing `requestAnimationFrame` and Euclidean proximity calculations for high-performance interactive backgrounds without frame drops.
- **Dual-State Authentication Gateway:** Dynamic UI rendering that serves a blurred, "Gated Profile Teaser" for unauthenticated guests, while unlocking high-contrast data for authenticated users securely.

## 🚀 Getting Started

Follow these instructions to set up Devixa locally for development and testing.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Devixa/Devixa-Hackathon_Management_System.git
   cd Devixa-Hackathon_Management_System
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   # Configure your .env file here based on .env.example
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the Platform**
   Open your browser and navigate to `http://localhost:5173` to view the application.

## 📂 Project Structure

```text
Devixa-Hackathon_Management_System/
├── backend/                  # Express.js REST API & AI Microservices
└── frontend/                 # React 19 Client Application
    ├── src/
    │   ├── components/       # Reusable UI components (GlobalUserSearch, GlassCard)
    │   ├── pages/            # Feature-based routing pages
    │   │   ├── public/       # Public-facing marketing & discovery (About, Features)
    │   │   └── ...           # Authenticated dashboard views
    │   ├── services/         # API client and external integrations
    │   └── App.jsx           # Root application router
```

## 🔮 Future Roadmap

- **Web3 Integration:** Cryptographic security and smart contract-based intellectual property locking.
- **Advanced Matchmaking:** LLM-driven team synergy predictions.
- **Global Leaderboards:** Persistent ELO-style ranking system for hackers across multiple events.

## 📄 License

This project is licensed under the MIT License. 

> *You build the future. We handle the rest.*
