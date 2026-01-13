import { RepoMetadata, FileStats } from "@/lib/types";

export function buildAnalysisPrompt(
    metadata: RepoMetadata,
    fileStats: FileStats,
    fileTree: string,
    importantFiles: Record<string, string>
): string {
    return `
You are an expert Senior Software Architect and Code Auditor. Your task is to analyze the following GitHub repository and provide a comprehensive health report.

### Repository Context
- **Name**: ${metadata.fullName}
- **Description**: ${metadata.description}
- **Language**: ${metadata.language}
- **Stars**: ${metadata.stars}
- **Size**: ${metadata.size} KB

### File Statistics
- **Total Files**: ${fileStats.totalFiles}
- **Languages**: ${JSON.stringify(fileStats.languages)}

### Project Structure (Truncated)
${fileTree}

### Key Files Content
${Object.entries(importantFiles)
            .map(([name, content]) => `\n--- ${name} ---\n${content.slice(0, 2000)}\n`) // Limit content size per file
            .join("\n")}

### Analysis Requirements
Analyze the provided code and structure. Output your response in valid JSON format ONLY, with no extra text or markdown formatting. The JSON structure should be:

{
  "summary": "A professional executive summary of what this repo does and its architecture.",
  "techStack": ["List", "of", "technologies", "detected"],
  "scores": {
    "overall": 0-100,
    "codeQuality": 0-100,
    "security": 0-100,
    "maintainability": 0-100,
    "documentation": 0-100
  },
  "insights": [
    {
      "type": "strength" | "weakness" | "suggestion" | "security",
      "title": "Short Title",
      "description": "Detailed explanation",
      "priority": "low" | "medium" | "high" | "critical"
    }
  ],
  "architecture": [
    {
      "name": "Component Name",
      "type": "frontend" | "backend" | "database" | "service",
      "description": "What it does"
    }
  ]
}

Be critical but constructive. Identify security risks (e.g., exposed secrets, weak deps), architectural patterns, and code quality issues.
`;
}
