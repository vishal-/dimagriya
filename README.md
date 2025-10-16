# DiMagriya - Assessment Platform

A modern React-based assessment platform built with TypeScript, Vite, and Tailwind CSS. Features a kid-friendly dark theme, timer functionality, and comprehensive admin tools for managing assessments.

## Features

- 🎨 **Kid-friendly UI** with dark theme and colorful accents
- ⏱️ **Timer functionality** with sticky footer display
- 📝 **Assessment management** with sections and questions
- 🔐 **Admin dashboard** with authentication
- 📊 **Answer key viewer** for admins
- 📱 **Responsive design** for all devices
- 🚀 **Fast deployment** to GitHub Pages

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM (HashRouter)
- **Backend**: Supabase
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/dimagriya.git
cd dimagriya
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages (local)

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

This project includes GitHub Actions for automatic deployment:

1. **Push to main branch**: The app automatically deploys when you push to the `main` or `setup` branch.
2. **Custom domain is already configured** in GitHub Pages settings.

### Manual Deployment

If you prefer to deploy manually:

1. Build the project:

```bash
npm run build
```

2. Deploy using gh-pages:

```bash
npm run deploy
```

### GitHub Pages Configuration

1. Go to your repository settings
2. Navigate to "Pages" in the sidebar
3. Set source to "GitHub Actions"
4. The workflow will handle the rest

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── container/       # Main app container
│   ├── pages/          # Page components
│   └── auth/           # Authentication components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
