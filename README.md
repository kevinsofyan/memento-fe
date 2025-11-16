# Memento 📖

A beautiful, modern journaling application built with Next.js 15 and the latest React technologies. Memento helps you capture your thoughts, preserve your memories, and organize your life through elegant digital journaling.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Features

### 📚 Books & Entries

- **Organize with Books**: Create multiple journal books for different topics
- **Rich Entries**: Write detailed journal entries with titles, content, moods, and tags
- **Customization**: Personalize books with emojis and custom colors
- **Favorites**: Mark important entries for quick access

### 🎨 Beautiful Design

- **Modern UI**: Clean, distraction-free interface perfect for writing
- **Dark/Light Mode**: Seamless theme switching with smooth transitions
- **Animations**: Delightful Framer Motion animations throughout
- **Responsive**: Works beautifully on all screen sizes

### 🚀 Performance

- **Fast**: Built on Next.js 15 with App Router for optimal performance
- **Smart Caching**: TanStack Query for efficient data management
- **Optimistic Updates**: Instant UI feedback on all actions
- **Type-Safe**: Full TypeScript coverage for reliability

## 🛠️ Tech Stack

### Core Framework

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### UI & Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component primitives
- **[Framer Motion 12](https://www.framer.com/motion/)** - Production-ready animation library
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### State Management

- **[Zustand 5](https://github.com/pmndrs/zustand)** - Lightweight, fast state management
- **[TanStack Query 5](https://tanstack.com/query)** - Powerful server state management

### Forms & Validation

- **[React Hook Form 7](https://react-hook-form.com/)** - Performant form handling
- **[Zod 4](https://zod.dev/)** - TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Form validation integration

## 📁 Project Structure

```
memento-fe/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── journal/            # Journal-specific components
│   │   └── layouts/            # Layout components
│   ├── stores/                 # Zustand state stores
│   ├── api/                    # TanStack Query hooks
│   ├── types/                  # TypeScript type definitions
│   ├── lib/                    # Utilities and configurations
│   └── hooks/                  # Custom React hooks
├── public/                     # Static assets
├── DESIGN_SYSTEM.md            # Complete design system documentation
├── ARCHITECTURE.md             # Architecture documentation
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/memento-fe.git
cd memento-fe
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating Your First Book

1. Click the **"New Book"** button in the sidebar or on the Books page
2. Fill in the book details:
   - Title (required)
   - Description (optional)
   - Choose a color theme
   - Add an emoji (optional)
3. Click **"Create Book"**

### Writing an Entry

1. Navigate to a book
2. Click **"New Entry"**
3. Write your entry:
   - Add a title
   - Write your thoughts in the content area
   - Select your mood (optional)
   - Add tags for organization (optional)
4. Click **"Create Entry"**

### Managing Your Journal

- **Search**: Use the search bar to find specific entries or books
- **Filter**: Filter entries by favorites or view all
- **Toggle Views**: Switch between grid and list views
- **Favorites**: Click the heart icon to favorite important entries
- **Theme**: Toggle between light and dark mode in the sidebar

## 🎨 Design System

Memento features a comprehensive design system built on modern color science and UX principles.

### Key Features

- **OKLCH Colors**: Perceptually uniform color space for better color harmony
- **Theme Support**: Fully functional light and dark themes
- **Accessibility**: WCAG AA compliant color contrasts
- **Consistent Spacing**: 4px/8px grid system
- **Modern Typography**: Geist Sans and Geist Mono fonts

For complete design system documentation, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

## 🏗️ Architecture

Memento follows modern React and Next.js best practices:

### State Management Strategy

- **Zustand**: UI state and client-side caching
- **TanStack Query**: Server state, caching, and synchronization
- **React Hook Form**: Form state management

### Data Flow

```
User Action → Form (React Hook Form) → Validation (Zod)
→ API Mutation (TanStack Query) → Server
→ Cache Update → UI Re-render
```

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🎯 Key Design Decisions

### Why Next.js 15?

- App Router for improved performance
- Server Components for optimal loading
- Built-in optimizations and best practices
- Excellent TypeScript support

### Why Zustand + TanStack Query?

- **Separation of Concerns**: UI state vs. Server state
- **Minimal Boilerplate**: Less code, more productivity
- **Type Safety**: Full TypeScript integration
- **DevTools**: Excellent debugging experience

### Why Tailwind CSS 4?

- **Utility-First**: Rapid UI development
- **Design Tokens**: Consistent design system
- **Performance**: Optimal CSS bundle size
- **Modern Features**: CSS-first configuration

### Why Framer Motion?

- **Production-Ready**: Battle-tested animation library
- **Declarative**: Easy to use and maintain
- **Performant**: GPU-accelerated animations
- **Flexible**: Works with any React component

## 📚 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Customizing the Design System

Colors and design tokens can be customized in:

- `src/lib/design-system/colors.ts` - Color definitions
- `src/app/globals.css` - Global styles and CSS variables

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Follow the existing code style
2. Use TypeScript for all new code
3. Follow the component patterns in the codebase
4. Update documentation for significant changes
5. Test thoroughly before submitting

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component architecture
- [Vercel](https://vercel.com/) for Next.js
- The React and TypeScript communities

## 📞 Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Review the architecture guide

---

Built with ❤️ using Next.js, React, and modern web technologies.
