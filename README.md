# 🚀 Laila Mohamed Fikry - Portfolio

A modern, interactive developer portfolio showcasing my journey in software engineering, projects, and technical skills. Built with React, TypeScript, and modern web technologies.

## ✨ Features

- **Responsive Design** - Optimized for all devices and screen sizes
- **Interactive UI** - Smooth animations and modern glassmorphism effects
- **Project Showcase** - Interactive flip cards with GitHub integration
- **Contact Form** - Functional email integration with backend API
- **Custom Cursor** - Unique purple gradient cursor with animations
- **Theme Consistency** - Cohesive design with purple-pink gradient theme
- **Performance Optimized** - Fast loading with optimized assets

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **React Simple Typewriter** - Typing animation effects

### Backend & Services
- **Node.js** - Server-side runtime
- **Express.js** - Web application framework
- **Resend** - Email service integration
- **Render** - Deployment platform

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Supabase** - Database and authentication (configured)

## 🎯 Key Sections

### Hero Section
- Animated profile with custom border effects
- Typewriter animation for role descriptions
- Call-to-action buttons (View Work, Download CV)
- Social media links

### About Section
- Personal journey and background
- Educational achievements
- Skills and expertise overview
- Languages and location

### Skills Section
- Interactive skill categories
- Progress indicators
- Technology stack visualization

### Projects Section
- Interactive flip cards with 3D effects
- GitHub integration with live data
- Project details and technologies
- Heart reaction system with localStorage

### Contact Section
- Functional contact form with validation
- Email integration via backend API
- Professional contact information
- Social media links

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/laila2005/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Hero.tsx        # Hero section
│   ├── About.tsx       # About section
│   ├── Skills.tsx      # Skills section
│   ├── Projects.tsx    # Projects section
│   ├── Contact.tsx     # Contact section
│   ├── Footer.tsx      # Footer component
│   └── Navigation.tsx  # Navigation bar
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── pages/              # Page components
```

## 🎨 Design Features

- **Glassmorphism Effects** - Modern glass-like UI elements
- **Gradient Themes** - Purple-pink gradient throughout
- **Custom Animations** - Smooth transitions and micro-interactions
- **Responsive Layout** - Mobile-first design approach
- **Accessibility** - WCAG compliant design patterns

## 📧 Contact Integration

The portfolio includes a functional contact form that:
- Validates user input
- Sends emails via Resend API
- Provides user feedback
- Handles errors gracefully

## 🔧 Customization

### Adding Projects
1. Update the projects array in `src/components/Projects.tsx`
2. Add project images to the `public/` folder
3. Update GitHub links and descriptions

### Modifying Styles
- Main theme colors are defined in `tailwind.config.ts`
- Component-specific styles are in individual component files
- Global styles are in `src/index.css`

### Updating Content
- Personal information in respective component files
- Skills and technologies in `src/components/Skills.tsx`
- Contact information in `src/components/Contact.tsx`

## 🚀 Deployment

The portfolio is deployed on Vercel/Netlify with:
- Automatic deployments from main branch
- Optimized build process
- CDN distribution for fast loading

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

While this is a personal portfolio, contributions and suggestions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 About Me

**Laila Mohamed Fikry** is a Software Engineering student at the Egyptian Russian University, passionate about creating beautiful, efficient solutions that bridge technology and user experience. Currently pursuing Software Engineering with expertise in systems programming and web development.

### Connect With Me
- **LinkedIn**: [laila-mohamed23](https://www.linkedin.com/in/laila-mohamed23/)
- **GitHub**: [laila2005](https://github.com/laila2005)
- **Email**: laila.mohamed.fikry@gmail.com

---

⭐ **Star this repository if you found it helpful!**
