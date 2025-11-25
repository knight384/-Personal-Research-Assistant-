# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- A Google Generative AI API Key (get it from [aistudio.google.com](https://aistudio.google.com/app/apikey))
- Vercel account (optional, for cloud deployment)

## Environment Setup

1. **Create a `.env.local` file** in the project root:
   ```env
   GEMINI_API_KEY=your_google_api_key_here
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Local Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building for Production

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

## Deployment to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. When prompted, configure environment variables:
   - Set `GEMINI_API_KEY` to your Google API key

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Select your GitHub repository
5. Add environment variables in the project settings
6. Deploy

## Deployment to Other Platforms

### Netlify
```bash
netlify deploy --prod --dir dist
```

### AWS Amplify
```bash
amplify publish
```

### Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:
```bash
docker build -t lumina-research .
docker run -p 3000:3000 lumina-research
```

## Important Notes

- **API Key Security**: Never commit `.env.local` to version control. It's already in `.gitignore`.
- **Backend API**: The application requires backend API endpoints (`/api/research` and `/api/analyze`) which are configured for Vercel serverless functions.
- **CORS**: Ensure your deployment environment allows requests to the Google Generative AI API.

## Troubleshooting

### Build fails
- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)

### API Key errors
- Verify the `GEMINI_API_KEY` environment variable is set correctly
- Test the key at [aistudio.google.com](https://aistudio.google.com)

### APIs not working
- Ensure you're on Vercel or a platform that supports serverless functions
- Check that the `/api` directory is properly configured

## Production Checklist

- [ ] TypeScript strict mode enabled (`tsconfig.json`)
- [ ] Build completes without errors (`npm run build`)
- [ ] Environment variables configured
- [ ] `.env.local` added to `.gitignore`
- [ ] GEMINI_API_KEY securely stored in deployment platform
- [ ] All dependencies installed and up-to-date
- [ ] Performance optimized (check build size)
