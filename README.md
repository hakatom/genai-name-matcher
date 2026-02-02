# GenAI Name Matcher

A heuristic name matching application that uses phonetic and distance algorithms to determine if two names refer to the same person.

## Features

- Advanced name matching using multiple algorithms (Jaro-Winkler, Soundex, Metaphone)
- Real-time matching with confidence scores
- Clean, modern UI with detailed analysis
- RESTful API for integration with other services

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Matching Algorithms**: Talisman library (phonetic & distance algorithms)

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hakatom/genai-name-matcher.git
cd genai-name-matcher
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Running Tests

```bash
npm test
```

## Deployment to Production

This application can be deployed to various hosting platforms. Below are instructions for the most popular options:

### Option 1: Deploy to Render (Recommended - Free Tier Available)

Render provides free hosting for web services and is very easy to set up.

#### Steps:

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Deploy from GitHub**
   - Click "New +" → "Web Service"
   - Connect your GitHub account and select the `genai-name-matcher` repository
   - Configure the service:
     - **Name**: genai-name-matcher (or your preferred name)
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free
   
3. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Your app will be available at: `https://genai-name-matcher.onrender.com`

#### Using the render.yaml file (Alternative Method)

This repository includes a `render.yaml` configuration file for automated deployment:

1. In your Render dashboard, click "New +" → "Blueprint"
2. Connect your repository
3. Render will automatically detect the `render.yaml` file and configure everything
4. Click "Apply" to deploy

**Note**: Free tier services on Render may spin down after inactivity and take 30-60 seconds to restart.

### Option 2: Deploy to Railway

Railway offers a simple deployment process with a free tier.

#### Steps:

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Deploy from GitHub**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select the `genai-name-matcher` repository
   - Railway will automatically detect it's a Node.js app
   - Click "Deploy"

3. **Configure Domain**
   - Go to Settings → Generate Domain
   - Your app will be available at the generated URL

### Option 3: Deploy to Heroku

Heroku is a well-established platform with a free tier (requires credit card verification).

#### Steps:

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create a new Heroku app**
```bash
heroku create genai-name-matcher
```

4. **Deploy**
```bash
git push heroku main
```

5. **Open your app**
```bash
heroku open
```

### Option 4: Self-Hosted Deployment

If you have your own server or VPS:

1. **Clone the repository on your server**
```bash
git clone https://github.com/hakatom/genai-name-matcher.git
cd genai-name-matcher
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up process manager (PM2)**
```bash
npm install -g pm2
pm2 start server.js --name genai-name-matcher
pm2 save
pm2 startup
```

4. **Configure reverse proxy (nginx)**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

- `PORT`: The port number the server will listen on (default: 3000)
  - Automatically set by most hosting platforms

## API Documentation

### POST /api/match

Compares two names and returns a match result with confidence score.

**Request Body:**
```json
{
  "name1": "John Smith",
  "name2": "Smith, John"
}
```

**Response:**
```json
{
  "match": true,
  "score": 0.95,
  "details": [
    "Jaro-Winkler similarity: 0.95",
    "Soundex match: true",
    "Common tokens: 2"
  ]
}
```

**Error Response:**
```json
{
  "error": "Both name1 and name2 are required and cannot be empty",
  "match": false,
  "score": 0
}
```

## Project Structure

```
genai-name-matcher/
├── index.html          # Frontend UI
├── app.js             # Frontend JavaScript
├── style.css          # Styling
├── server.js          # Express server
├── src/
│   └── matcher.js     # Name matching algorithms
├── tests/             # Test files
├── package.json       # Dependencies and scripts
└── render.yaml        # Render deployment configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

---

**Made with ❤️ for accurate name matching**
