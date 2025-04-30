# Mother's Day Tribute Website

A modern, responsive website dedicated to celebrating motherhood through inspiring stories, health advice, and cultural perspectives. This project showcases a collection of articles about mothers and the journey of motherhood, featuring beautiful UI elements and an interactive 3D experience.

## Live Demo

Experience the website live: [Mother's Day Tribute](https://mothers-day-to-my-mom.vercel.app/)

## Project Description

The Mother's Day Tribute website is a digital celebration of mothers and motherhood. It features thoughtfully curated articles across various categories including personal stories, health advice, cultural perspectives, and inspirational content. The site aims to honor mothers through compelling narratives and a user-friendly interface.

## Key Features Implemented

### 1. Interactive 3D Gallery Experience
- **Three.js-powered visualization** that creates a dynamic, immersive 3D gallery
- **Floating memory orbs** that display motherhood images in a spherical arrangement
- **Performance-optimized rendering** with fallback modes for different device capabilities
- **Dynamic loading** to prevent issues with server-side rendering
- **Responsive 3D environment** that adapts to different screen sizes

### 2. Advanced Search Functionality
- **Real-time search recommendations** that appear as you type
- **Contextual search results** providing article previews
- **Cross-category search** that finds relevant content across all article types
- **Integrated search history** that remembers your previous searches
- **Smart result prioritization** based on relevance to search terms
- **Enhanced user experience** compared to traditional search methods

### 3. Intelligent Theme Switching
- **System preference detection** that automatically matches your device's theme settings
- **Seamless dark/light mode transition** for comfortable reading in any environment
- **Persistent theme settings** that remember your preferences
- **Accessible color schemes** designed for readability
- **Optimized contrast ratios** for both dark and light modes

### 4. Dynamic Content Carousel
- **Auto-advancing featured articles** with a timed transition (5-second intervals)
- **Interactive navigation controls** for manual browsing
- **Responsive image handling** that maintains aspect ratios across devices
- **Smooth animations** for transitions between slides
- **Pause on hover functionality** for better user control

### 5. Performance Optimizations
- **Lazy loading implementation** for images and components
- **Code splitting** to reduce initial load times
- **On-demand loading** of the 3D experience
- **Optimized asset delivery** for faster page rendering
- **Deferred loading of non-critical resources**
- **Efficient state management** to minimize re-renders

### 6. Smart Category Filtering
- **Instant filtering** of articles by category without page reload
- **Filter state preservation** when navigating between pages
- **Visual feedback** when filters are applied
- **Combined filtering options** for refined content discovery
- **Clear filter option** to reset to all articles view
- **Count indicators** showing number of articles in each category

### Additional Features
- **Responsive Design**: Fully responsive layout that works beautifully on all devices
- **Article Categories**: Content organized into distinct categories (Stories, Health, Inspiration, Culture)
- **Article Detail Pages**: Full-page layouts for reading complete articles
- **Modern UI Components**: Built with shadcn/ui components for a polished user experience
- **Performance Optimized**: Fast loading times and optimized assets

## Technical Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives with shadcn/ui
- **3D Visualization**: Three.js with dynamic loading
- **State Management**: React Hooks and Context
- **Deployment**: Vercel

## Setup Instructions

Follow these steps to set up the project locally:

### Prerequisites

- Node.js 18+ installed
- pnpm or npm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mothers-day-tribute.git
   cd mothers-day-tribute
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

To create an optimized production build:

```bash
pnpm build
# or
npm run build
```

To start the production server:

```bash
pnpm start
# or
npm start
```

## Content Structure

The website content is organized into:

- **Home Page**: Featured articles carousel and category navigation
- **Article Pages**: Individual article content with related recommendations
- **About Page**: Information about the project's purpose
- **3D Experience**: Interactive visualization of motherhood memories
- **Category Pages**: Filtered views of articles by topic

## Acknowledgments

- All articles are fictional and created for demonstration purposes
- Images sourced ethically for the theme of motherhood and family
- Special thanks to all mothers who inspire us every day 
