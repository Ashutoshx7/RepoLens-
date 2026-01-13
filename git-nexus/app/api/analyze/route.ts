import { NextRequest, NextResponse } from "next/server";
import { fetchRepoTree, fetchImportantFiles, calculateFileStats, createCompactTreeString, fetchRepoMetadata } from "@/lib/github-server";
import { analyzeRepoWithGemini } from "@/lib/gemini";
import { buildAnalysisPrompt } from "@/lib/prompt-builder";

export async function POST(req: NextRequest) {
    try {
        const { owner, repo } = await req.json();

        if (!owner || !repo) {
            return NextResponse.json({ error: "Owner and Repo are required" }, { status: 400 });
        }

        // 1. Fetch Data from GitHub
        const [tree, importantFiles, metadata] = await Promise.all([
            fetchRepoTree(owner, repo),
            fetchImportantFiles(owner, repo),
            fetchRepoMetadata(owner, repo)
        ]);

        // 2. Process Data
        const fileStats = calculateFileStats(tree);
        const compactTree = createCompactTreeString(tree, 50);

        // 3. Build Prompt
        const prompt = buildAnalysisPrompt(metadata, fileStats, compactTree, importantFiles);

        // 4. Call AI
        const aiResponseText = await analyzeRepoWithGemini(prompt);

        // 5. Parse JSON (Handle potential markdown code blocks if the model adds them)
        let cleanedJson = aiResponseText.trim();
        if (cleanedJson.startsWith("```json")) {
            cleanedJson = cleanedJson.replace(/^```json/, "").replace(/```$/, "");
        } else if (cleanedJson.startsWith("```")) {
            cleanedJson = cleanedJson.replace(/^```/, "").replace(/```$/, "");
        }

        const analysisData = JSON.parse(cleanedJson);

        return NextResponse.json(analysisData);

    } catch (error: any) {
        console.error("Analysis Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to analyze repository",
            details: error.toString()
        }, { status: 500 });
    }
}
