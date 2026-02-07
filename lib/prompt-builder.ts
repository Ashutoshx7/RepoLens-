import { RepoMetadata, FileStats } from "@/lib/types";

interface DeepAnalysisContext {
  metadata: RepoMetadata;
  fileStats: FileStats;
  fileTree: string;
  importantFiles: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  hasTests?: boolean;
  hasCI?: boolean;
  hasDocs?: boolean;
  hasDocker?: boolean;
  hasTypescript?: boolean;
  frameworks?: string[];
}

export function buildAnalysisPrompt(
  metadata: RepoMetadata,
  fileStats: FileStats,
  fileTree: string,
  importantFiles: Record<string, string>
): string {
  // Extract additional context from files
  const context = extractDeepContext(metadata, fileStats, fileTree, importantFiles);

  return `
# REPOSITORY DEEP ANALYSIS REQUEST

You are an elite software architect, security researcher, and code quality expert performing a comprehensive analysis of a GitHub repository. Your analysis should be thorough, actionable, and insightful.

---

## 📊 REPOSITORY OVERVIEW

| Attribute | Value |
|-----------|-------|
| **Repository** | ${metadata.fullName} |
| **Description** | ${metadata.description || "Not provided"} |
| **Primary Language** | ${metadata.language || "Unknown"} |
| **Stars** | ⭐ ${metadata.stars.toLocaleString()} |
| **Forks** | 🍴 ${metadata.forks.toLocaleString()} |
| **Open Issues** | 📋 ${metadata.openIssues} |
| **Size** | ${(metadata.size / 1024).toFixed(1)} MB |
| **License** | ${metadata.license || "Not specified"} |
| **Last Updated** | ${metadata.updatedAt} |
| **Created** | ${metadata.createdAt} |

---

## 📁 CODEBASE STATISTICS

- **Total Files**: ${fileStats.totalFiles}
- **Total Directories**: ${fileStats.totalDirectories}
- **Language Distribution**:
${Object.entries(fileStats.languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([lang, count]) => `  - ${lang}: ${count} files`)
      .join('\n')}

---

## 🏗️ PROJECT STRUCTURE

\`\`\`
${fileTree}
\`\`\`

---

## 📦 DETECTED CONFIGURATION

${context.hasTypescript ? "✅ TypeScript project" : ""}
${context.hasTests ? "✅ Has test files/directory" : "⚠️ No obvious test setup detected"}
${context.hasCI ? "✅ CI/CD pipeline configured" : "⚠️ No CI configuration found"}
${context.hasDocs ? "✅ Documentation present" : "⚠️ Limited documentation"}
${context.hasDocker ? "✅ Docker configuration found" : ""}

${context.dependencies && Object.keys(context.dependencies).length > 0 ? `
### Dependencies (${Object.keys(context.dependencies).length} packages)
${Object.entries(context.dependencies).slice(0, 20).map(([name, version]) => `- ${name}: ${version}`).join('\n')}
${Object.keys(context.dependencies).length > 20 ? `... and ${Object.keys(context.dependencies).length - 20} more` : ""}
` : ""}

${context.devDependencies && Object.keys(context.devDependencies).length > 0 ? `
### Dev Dependencies (${Object.keys(context.devDependencies).length} packages)
${Object.entries(context.devDependencies).slice(0, 15).map(([name, version]) => `- ${name}: ${version}`).join('\n')}
${Object.keys(context.devDependencies).length > 15 ? `... and ${Object.keys(context.devDependencies).length - 15} more` : ""}
` : ""}

${context.scripts && Object.keys(context.scripts).length > 0 ? `
### NPM Scripts
${Object.entries(context.scripts).map(([name, cmd]) => `- \`${name}\`: ${cmd}`).join('\n')}
` : ""}

---

## 📄 KEY FILES CONTENT

${Object.entries(importantFiles)
      .map(([name, content]) => `
### ${name}
\`\`\`
${content.slice(0, 4000)}
\`\`\`
`)
      .join("\n")}

---

# DEEP RESEARCH ANALYSIS INSTRUCTIONS

You are performing an **expert-level deep research analysis**. Think like a principal engineer conducting a thorough code review and architectural assessment. Go beyond surface-level observations.

## 1. 🎯 EXECUTIVE SUMMARY
Write a compelling, insightful summary that:
- Explains the project's core purpose and value proposition
- Identifies the target audience and use cases
- Assesses project maturity and production-readiness
- Highlights what makes this project notable (or concerning)

## 2. 🛠️ TECHNOLOGY STACK DETECTION
Perform thorough detection of ALL technologies:
- **Core Framework/Library**: Exact versions when visible
- **Language & Type System**: JavaScript/TypeScript/Flow/Python, etc.
- **State Management**: Redux, Zustand, Context, MobX, etc.
- **Styling**: CSS Modules, Tailwind, Styled-Components, etc.
- **API Layer**: REST, GraphQL, tRPC, etc.
- **Testing**: Jest, Vitest, Playwright, Cypress, etc.
- **Build & Bundling**: Webpack, Vite, Turbopack, esbuild, etc.
- **CI/CD & Deployment**: GitHub Actions, Vercel, Docker, etc.

## 3. 🏛️ ARCHITECTURE DEEP DIVE
Analyze architectural patterns and decisions:
- **Pattern Classification**: Monolith, Microservices, Modular Monolith, Serverless, etc.
- **Directory Structure**: How is code organized? Feature-based? Layer-based?
- **Separation of Concerns**: Is business logic properly isolated?
- **Data Flow**: Unidirectional? Event-driven? Request-response?
- **State Architecture**: Local vs. global state boundaries

## 4. 📊 QUALITY SCORES (0-100)
Provide rigorous, justified scores:
- **Overall**: Weighted holistic assessment
- **Code Quality**: DRY, SOLID, naming, patterns, readability
- **Security**: Input validation, auth, secrets, XSS/CSRF, dependencies
- **Maintainability**: Coupling, cohesion, modularity, tech debt signals
- **Documentation**: README depth, inline comments, API docs, examples
- **Testing**: Coverage indicators, test patterns, CI integration
- **Performance**: Bundle size, lazy loading, caching, optimization
- **Developer Experience**: Setup friction, tooling, error messages, onboarding

## 5. 🔬 DEEP RESEARCH INSIGHTS
Provide 12-18 detailed insights with SPECIFIC evidence:

### Code Patterns (type: "strength" or "weakness")
- Identify design patterns used (Factory, Observer, Singleton, etc.)
- Detect anti-patterns (God objects, tight coupling, magic numbers)
- Assess error handling strategies
- Review naming conventions and consistency

### Security Analysis (type: "security")
- Authentication/authorization implementation
- Input validation and sanitization
- Secret management practices
- Dependency vulnerability exposure
- XSS, CSRF, injection risk areas

### Performance Considerations (type: "suggestion")
- Bundle size optimization opportunities
- Render performance patterns (memoization, virtualization)
- Network request efficiency
- Caching strategies (or lack thereof)

### Maintainability Concerns (type: "weakness")
- Code duplication hotspots
- Overly complex functions/components
- Missing abstractions
- Technical debt indicators

Each insight MUST include:
- **title**: Clear, specific, actionable
- **description**: 2-3 sentences with specific file/pattern references when possible
- **priority**: "low", "medium", "high", or "critical"

## 6. 🔗 DEPENDENCY HEALTH
Analyze the dependency ecosystem:
- Version currency assessment
- Known vulnerability exposure
- Heavy/bloated dependency identification
- Suggestions for lighter alternatives

## 7. 📈 SCALING & GROWTH
Assess readiness for growth:
- Current architectural limitations
- Performance bottleneck predictions
- Suggested improvements for scale

---

# OUTPUT FORMAT

Respond with **ONLY valid JSON** (no markdown, no explanations). Use this exact structure:

{
  "summary": "Comprehensive 3-4 sentence executive summary covering what the project does, its purpose, target audience, and overall assessment.",
  "projectType": "web-app|api|library|cli|mobile|desktop|other",
  "maturity": "prototype|alpha|beta|production|mature",
  "techStack": [
    "React 18",
    "Next.js 14",
    "TypeScript 5.x",
    "Tailwind CSS",
    "PostgreSQL",
    "Prisma ORM",
    "etc..."
  ],
  "scores": {
    "overall": 75,
    "codeQuality": 80,
    "security": 70,
    "maintainability": 75,
    "documentation": 65,
    "testing": 60,
    "performance": 70,
    "developerExperience": 75
  },
  "insights": [
    {
      "type": "strength",
      "title": "Excellent Component Architecture",
      "description": "The project follows atomic design principles with well-organized component hierarchy. Components are properly typed and follow single responsibility principle.",
      "priority": "high"
    },
    {
      "type": "weakness",
      "title": "Limited Test Coverage",
      "description": "Only 30% of critical paths are covered by tests. Consider adding unit tests for utility functions and integration tests for API endpoints.",
      "priority": "high"
    },
    {
      "type": "security",
      "title": "Potential XSS Vulnerability",
      "description": "User input in component X is not sanitized before rendering. Consider using DOMPurify or proper escaping.",
      "priority": "critical"
    },
    {
      "type": "suggestion",
      "title": "Implement Error Boundaries",
      "description": "Add React Error Boundaries to prevent full app crashes. Currently, any component error crashes the entire application.",
      "priority": "medium"
    }
  ],
  "architecture": [
    {
      "name": "Frontend Application",
      "type": "frontend",
      "description": "Next.js application with App Router, server components, and client-side state management"
    },
    {
      "name": "API Layer",
      "type": "backend",
      "description": "RESTful API routes handling authentication, data fetching, and business logic"
    },
    {
      "name": "Database",
      "type": "database",
      "description": "PostgreSQL with Prisma ORM for type-safe database access"
    },
    {
      "name": "Authentication",
      "type": "service",
      "description": "NextAuth.js handling OAuth providers and session management"
    }
  ],
  "dependencies": {
    "status": "healthy|warning|critical",
    "outdated": 5,
    "vulnerabilities": 0,
    "heaviest": ["lodash", "moment"],
    "suggestions": ["Consider replacing moment with date-fns", "lodash can be tree-shaken"]
  },
  "quickWins": [
    "Add TypeScript strict mode",
    "Implement Husky for pre-commit hooks",
    "Add error tracking with Sentry"
  ],
  "longTermImprovements": [
    "Migrate to server components for better performance",
    "Implement comprehensive E2E testing",
    "Set up proper monitoring and alerting"
  ]
}

Be **thorough, critical, and constructive**. Reference specific file paths and code patterns when possible. Provide genuinely actionable insights that a developer can immediately use.
`;
}

function extractDeepContext(
  metadata: RepoMetadata,
  fileStats: FileStats,
  fileTree: string,
  importantFiles: Record<string, string>
): DeepAnalysisContext {
  const context: DeepAnalysisContext = {
    metadata,
    fileStats,
    fileTree,
    importantFiles,
  };

  // Parse package.json if available
  if (importantFiles["package.json"]) {
    try {
      const pkg = JSON.parse(importantFiles["package.json"]);
      context.dependencies = pkg.dependencies || {};
      context.devDependencies = pkg.devDependencies || {};
      context.scripts = pkg.scripts || {};
    } catch {
      // Ignore parse errors
    }
  }

  // Detect project characteristics from file tree
  const treeLower = fileTree.toLowerCase();
  context.hasTests = treeLower.includes("test") || treeLower.includes("spec") || treeLower.includes("__tests__");
  context.hasCI = treeLower.includes(".github/workflows") || treeLower.includes(".circleci") || treeLower.includes("jenkinsfile");
  context.hasDocs = treeLower.includes("docs/") || treeLower.includes("documentation");
  context.hasDocker = treeLower.includes("dockerfile") || treeLower.includes("docker-compose");
  context.hasTypescript = treeLower.includes("tsconfig") || fileStats.languages["TypeScript"] > 0;

  return context;
}
