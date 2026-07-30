# Devixa

Devixa is a high-end SaaS platform engineered for hackathon management and discovery. Built to eliminate the friction of logistics, the platform serves as an advanced command center connecting a global ecosystem of builders, judges, and organizers.

## Core Architecture and Aesthetics

The application implements the Obsidian Kinetic Glass design system, ensuring a premium, immersive user experience.
* Background Base: Deep dark #09090B to reduce eye strain and increase focal contrast.
* Components: Reliance on glassmorphism using semi-transparent overlays and CSS backdrop-blur utilities.
* Highlights: Precision 1px gradient borders and directional shadows to create volumetric depth.

## Key Technical Features

### Kinetic Node Matrix
A custom HTML5 Canvas physics engine powers the interactive backgrounds. It utilizes requestAnimationFrame and Euclidean proximity calculations to dynamically map an active fiber-optic node network to the user's cursor, ensuring high-performance rendering without frame drops.

### Dual-State Authentication Gateway
The platform utilizes a unified, state-aware architectural pattern for data presentation. Unauthenticated guests are served a Gated Profile Teaser featuring a strong CSS blur filter and conversion calls-to-action, while authenticated sessions automatically unlock high-contrast, fully interactive data sets.

### Hardware-Accelerated UI
Complex motion design is handled natively via Framer Motion. The interface leverages liquid typography reveals, whileInView staggered node illuminations, and CSS-driven infinite marquee animations to provide a fluid, application-like feel across all routes.

## Local Setup and Installation

Prerequisites include Node.js and a package manager (npm or yarn).

1. Clone the repository:
git clone https://github.com/Devixa/Devixa-Hackathon_Management_System.git

2. Navigate into the frontend directory:
cd Devixa-Hackathon_Management_System/frontend

3. Install the required dependencies:
npm install

4. Start the Vite 8 development server:
npm run dev

## Project Structure

The frontend architecture follows a modular, feature-based routing paradigm:

* src/pages/public/ShowcaseHome.jsx: The root entry point featuring the primary kinetic spotlight illusion.
* src/pages/public/About.jsx: A cinematic, story-driven manifesto with SVG liquid background logic.
* src/pages/public/Features.jsx: A highly technical capability showcase governed by the Kinetic Node Matrix.
* src/components/ui/GlobalUserSearch.jsx: An abstracted, dual-state modal handling both gated search and authenticated profile displays.
* src/components/layout/PublicLayout.jsx: The global wrapper enforcing the overarching design system across all public interfaces.
