# 🚀 Laila Mohamed Fikry - Portfolio

A modern, interactive developer portfolio built with React, TypeScript, and Tailwind CSS. Features smooth animations, interactive project cards, and a functional contact form.

## ✨ Live Demo
[View Portfolio](https://laila-portfolio.vercel.app)

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion  
**Backend:** Node.js, Express.js, Resend (Email)  
**Deployment:** Render, Vercel/Netlify

## 🎯 Features

- **Responsive Design** - Mobile-first approach
- **Interactive UI** - Smooth animations and glassmorphism effects
- **Project Showcase** - Flip cards with GitHub integration
- **Contact Form** - Email integration with validation
- **Custom Cursor** - Animated gradient cursor
- **Performance Optimized** - Fast loading and smooth interactions

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/laila2005/My_Portfolio.git
cd My_Portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the portfolio.

## 🚀 Vercel Deployment

This project is configured for Vercel deployment with serverless functions.

### Environment Variables Required:
- `RESEND_API_KEY` - Your Resend API key for email functionality
- `EMAIL_FROM` - Email address for sending emails (e.g., onboarding@resend.dev)

### Deployment Steps:
1. Connect your GitHub repository to Vercel
2. Set the framework preset to **Vite**
3. Add the environment variables in Vercel dashboard
4. Deploy!

The contact form will automatically use the `/api/contact` endpoint.

## 📁 Project Structure

```
src/
├── components/     # React components
│   ├── ui/        # Reusable UI components
│   ├── Hero.tsx   # Hero section
│   ├── About.tsx  # About section
│   ├── Skills.tsx # Skills section
│   ├── Projects.tsx # Projects section
│   ├── Contact.tsx # Contact section
│   └── Footer.tsx # Footer component
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── integrations/  # External services
```

## 🎨 Key Sections

- **Hero** - Animated profile, typewriter effect, CTA buttons
- **About** - Personal journey, education, achievements
- **Skills** - Interactive skill categories with progress indicators
- **Projects** - Flip cards with GitHub data and reactions
- **Contact** - Functional form with email integration

## 🔧 Customization

1. **Update personal info** in respective component files
2. **Add projects** in `src/components/Projects.tsx`
3. **Modify styles** in `tailwind.config.ts`
4. **Update contact details** in `src/components/Contact.tsx`

## 📧 Contact

- **LinkedIn:** [laila-mohamed23](https://www.linkedin.com/in/laila-mohamed23/)
- **GitHub:** [laila2005](https://github.com/laila2005)
- **Email:** laila.mohamed.fikry@gmail.com

## 📄 License

MIT License - feel free to use this code for your own portfolio!

---

⭐ **Star this repo if you found it helpful!**
