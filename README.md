# Git-Pulse

> **The Ultimate Repository Intelligence Suite.**

Git-Pulse combines the powerful activity tracking of **GSoC-Spy** with the architectural insights of **Repo-Gist** into a single, cohesive, and beautiful application.

## ✨ Features

- **Unified Dashboard**: View high-level metadata, contribution stats, and health metrics in one place.
- **AI-Powered Deep Analysis**: 
  - RAG-powered repository intelligence using Groq Llama 3.3 70B
  - Real-time pipeline progress visualization
  - Code quality, security, and architecture scoring
  - Actionable insights and recommendations
- **Contributor Tracking**:
  - Track active contributors over 2 weeks, 1 month, or 3 months.
  - Identify maintainers vs regular contributors.
  - View detailed PR statistics (Merged/Open/Closed).
- **Code Explorer**: VS Code-style file browser with syntax highlighting
- **Tasteful Design**:
  - Monochrome UI with subtle animations
  - Dark mode optimized
  - Responsive and fast

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Shadcn/UI (Radix Primitives), Recharts
- **AI Engine**: Groq (Llama 3.3 70B)
- **Data Fetching**: Octokit (GitHub API)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Groq API Key (free at [console.groq.com](https://console.groq.com))
- GitHub Token (for higher rate limits)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/git-pulse.git
   cd git-pulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` with your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GITHUB_TOKEN=your_github_token_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | Groq API key for AI analysis. Get free at [console.groq.com](https://console.groq.com) |
| `GITHUB_TOKEN` | ✅ Yes | GitHub personal access token for API access. Create at [github.com/settings/tokens](https://github.com/settings/tokens) |
| `GEMINI_API_KEY` | ❌ No | Optional Gemini API key (alternative AI provider) |

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `GROQ_API_KEY`
   - `GITHUB_TOKEN`
4. Deploy!

### Deploy to Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
git-nexus/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── analyze/       # Standard analysis endpoint
│   │   └── analyze-stream/ # Real-time streaming endpoint
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── overview/         # Dashboard components
│   └── ui/               # Shadcn UI components
├── lib/                   # Utilities and services
│   ├── groq.ts           # Groq AI integration
│   ├── github-server.ts  # GitHub data fetching
│   └── prompt-builder.ts # RAG prompt construction
└── public/               # Static assets
```

## 🧠 RAG Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    RAG PIPELINE FLOW                        │
├─────────────────────────────────────────────────────────────┤
│  📥 Retrieval  → GitHub API (tree, files, metadata)        │
│  🔧 Augmentation → Context building & prompt construction   │
│  🧠 Generation → Groq Llama 3.3 70B deep analysis          │
│  📊 Display   → Real-time progress & rich UI rendering     │
└─────────────────────────────────────────────────────────────┘
```

## 📄 License

MIT License - feel free to use this project for any purpose.

---

Built with ❤️ using Next.js and Groq AI
