# Pallavi Pradhan Tuition

A modern, interactive tuition management platform built with Next.js 16, React 19, and TypeScript. This application provides a comprehensive solution for managing tuition classes, student assessments, and educational content.

## Features

- **Student Portal**: Secure login and signup system for students
- **Teacher Dashboard**: Administrative interface for teachers to manage classes and content
- **AI-Powered Quiz Generation**: Generate custom quizzes using Google Gemini AI from PDF documents
- **Live Quiz System**: Interactive quiz interface for students
- **Notes Management**: Upload and manage educational notes and resources
- **Class Management**: View and manage different class sections
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Frontend**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **AI Integration**: Google Generative AI (Gemini)
- **PDF Processing**: pdf-parse

## Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pallavi_pradhan_tution.git
cd pallavi_pradhan_tution
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Google Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
pallavi_pradhan_tution/
├── src/
│   └── app/
│       ├── components/      # Reusable React components
│       ├── api/            # API routes
│       ├── admin/          # Admin dashboard
│       ├── login/          # Student login
│       ├── signup/         # Student registration
│       ├── teacher-login/  # Teacher authentication
│       ├── quiz/           # Quiz interface
│       ├── live-quiz/      # Live quiz system
│       ├── notes/          # Notes management
│       └── page.tsx        # Home page
├── public/                 # Static assets
└── package.json
```

## Features Details

### Quiz Generation
The application uses Google's Gemini AI to automatically generate quizzes from uploaded PDF documents. Teachers can upload study materials and the system will create relevant questions.

### User Management
- Separate authentication flows for students and teachers
- Secure signup and login systems
- Role-based access control

### Class Management
View and organize different class sections with an intuitive interface.

## Deployment

The application can be deployed on Vercel, Netlify, or any platform that supports Next.js:

```bash
npm run build
npm start
```

For Vercel deployment, simply connect your GitHub repository and Vercel will handle the rest.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key for quiz generation |

## License

This project is private and proprietary.

## Support

For support or questions, please contact the administrator.
