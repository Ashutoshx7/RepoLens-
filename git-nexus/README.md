# Git-Pulse

> **The Ultimate Repository Intelligence Suite.**

Git-Pulse combines the powerful activity tracking of **GSoC-Spy** with the architectural insights of **Repo-Gist** into a single, cohesive, and beautiful application.

## Features

- **Unified Dashboard**: View high-level metadata, contribution stats, and health metrics in one place.
- **Contributor Tracking** (from GSoC-Spy):
  - Track active contributors over 2 weeks, 1 month, or 3 months.
  - Identify maintainers vs regular contributors.
  - View detailed PR statistics (Merged/Open/Closed).
- **Repository Analysis** (from Repo-Gist):
  - *Coming Soon*: AI-powered Code Quality scoring.
  - *Coming Soon*: Architecture diagrams and Security audit.
- **Tasteful Design**:
  - Glassmorphism UI with subtle animations.
  - Dark mode by default.
  - Responsive and fast.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, Framer Motion
- **UI Components**: Shadcn/UI (Radix Primitives)
- **Data Fetching**: Octokit (GitHub API)

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

To increase GitHub API rate limits, add a `.env.local` file:

```env
NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
```
*(Note: Current implementation uses client-side fetching for some stats, so the token might need to be configured differently or stored in localStorage as per GSoC-Spy original design).*
