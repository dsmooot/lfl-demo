# Left Field Labs Demo - Interactive 3D Card Grid

A modern React application showcasing an interactive 3D card grid with smooth animations, drag-and-drop functionality, and responsive design.

## Project Overview

This demo application implements a 3D card grid where users can interact with 10 cards through clicking, dragging, and hovering. Each card features a unique image background on the front and colored background on the back, with smooth animations powered by GSAP and 3D rendering via React-Three-Fiber.

## Tech Stack & Architecture Decisions

### Frontend Framework

-   **React 19** with **TypeScript** - Latest React features with type safety
-   **Vite** - Fast development server and optimized production builds

### 3D & Animation Libraries

-   **React-Three-Fiber** - React renderer for Three.js, enabling declarative 3D scenes
-   **Drei** - Helper components for R3F, used for HTML overlays and environment setup
-   **GSAP** with **@gsap/react** - Professional animation library with React integration
-   **@use-gesture/react** - Advanced gesture handling for drag interactions

### Styling & UI

-   **Tailwind CSS v4.0** - Utility-first CSS framework with latest features
-   **Custom CSS Variables** - For dynamic theming and responsive design
-   **HTML-in-3D** - Using Drei's Html component for text overlay on 3D cards

## Setup & Installation

### Prerequisites

-   **Node.js** (v18 or higher)
-   **Yarn** package manager

### Installation Steps

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd lfl-demo
    ```

2. **Install dependencies**

    ```bash
    yarn install
    ```

3. **Start development server**

    ```bash
    yarn dev
    ```

4. **Open in browser**
    ```
    http://localhost:5173
    ```

### Production Build

```bash
yarn build
```

The optimized production build will be generated in the `dist/` directory.

## 📁 Project Structure

```
lfl-demo/
├── src/
│   ├── components/
│   │   ├── Card.tsx           # Individual 3D card with interactions
│   │   └── CardGrid.tsx       # Main scene, camera, and grid management
│   ├── assets/
│   │   └── cardData.ts        # Card content and image URLs
│   ├── App.tsx                # Root application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles and Tailwind imports
├── public/                    # Static assets
├── vite.config.ts            # Vite configuration with Tailwind plugin
└── package.json              # Dependencies and scripts
```

### 3D Scene Architecture

-   **Orthographic Camera**: Chosen over perspective for consistent card sizing and professional grid appearance
-   **HTML Overlays**: Using Drei's Html component to render text and images within 3D space while maintaining DOM interaction
-   **Responsive Camera**: Dynamic zoom adjustment based on viewport size for optimal viewing across devices

### Animation Strategy

-   **GSAP Timelines**: Centralized animation control with staggered reveals for professional loading sequences
-   **useGSAP Hook**: React-optimized GSAP integration with automatic cleanup and scoped animations
-   **Hardware Acceleration**: Leveraging CSS3D transforms for smooth 60fps animations

### State Management

-   **React Hooks**: Simple useState for card positions and flip states
-   **Ref Forwarding**: Proper React patterns for accessing 3D mesh references
-   **Event Driven**: Clean separation between user interactions and state updates

### Responsive Design

-   **Breakpoint System**: Mobile-first approach with tablet and desktop optimizations
-   **Dynamic Grid**: Automatic layout switching based on screen size
-   **Touch Optimization**: Enhanced touch targets and gesture recognition for mobile devices

## 🔧 Development Scripts

```bash
# Development server with hot reload
yarn dev

# Production build with optimization
yarn build

# Build and preview production bundle
yarn build && yarn preview

# Type checking
yarn tsc

# Linting (if configured)
yarn lint
```
