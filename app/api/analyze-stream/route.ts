import { NextRequest } from "next/server";
import { fetchRepoTree, fetchImportantFiles, calculateFileStats, createCompactTreeString, fetchRepoMetadata } from "@/lib/github-server";
import { analyzeRepoWithGroq } from "@/lib/groq";
import { buildAnalysisPrompt } from "@/lib/prompt-builder";

// Pipeline step definitions
const PIPELINE_STEPS = [
    { id: "metadata", label: "Fetching repository metadata...", icon: "git" },
    { id: "tree", label: "Retrieving file structure...", icon: "folder" },
    { id: "files", label: "Extracting important files...", icon: "file" },
    { id: "stats", label: "Calculating file statistics...", icon: "chart" },
    { id: "prompt", label: "Building analysis context...", icon: "brain" },
    { id: "ai", label: "Running deep AI research...", icon: "sparkles" },
    { id: "parse", label: "Parsing results...", icon: "check" },
    { id: "complete", label: "Analysis complete!", icon: "complete" },
];

export async function POST(req: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const sendProgress = (stepIndex: number, status: "active" | "complete" | "error", details?: string) => {
                const step = PIPELINE_STEPS[stepIndex];
                const data = JSON.stringify({
                    type: "progress",
                    step: stepIndex,
                    totalSteps: PIPELINE_STEPS.length,
                    stepId: step.id,
                    label: step.label,
                    icon: step.icon,
                    status,
                    details,
                    timestamp: Date.now()
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            };

            const sendResult = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "result", data })}\n\n`));
            };

            const sendError = (error: string) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", error })}\n\n`));
            };

            try {
                const { owner, repo } = await req.json();

                if (!owner || !repo) {
                    sendError("Owner and Repo are required");
                    controller.close();
                    return;
                }

                console.log(`\n🚀 RAG PIPELINE STARTED: ${owner}/${repo}`);

                // STEP 0: Metadata
                sendProgress(0, "active");
                const metadata = await fetchRepoMetadata(owner, repo);
                sendProgress(0, "complete", `${metadata.stars} stars, ${metadata.forks} forks`);

                // STEP 1: Tree
                sendProgress(1, "active");
                const tree = await fetchRepoTree(owner, repo);
                sendProgress(1, "complete", `${tree.length} root directories`);

                // STEP 2: Important Files
                sendProgress(2, "active");
                const importantFiles = await fetchImportantFiles(owner, repo);
                sendProgress(2, "complete", `${Object.keys(importantFiles).length} files extracted`);

                // STEP 3: File Stats
                sendProgress(3, "active");
                const fileStats = calculateFileStats(tree);
                const compactTree = createCompactTreeString(tree, 50);
                sendProgress(3, "complete", `${fileStats.totalFiles} files, ${fileStats.totalDirectories} dirs`);

                // STEP 4: Prompt Building
                sendProgress(4, "active");
                const prompt = buildAnalysisPrompt(metadata, fileStats, compactTree, importantFiles);
                sendProgress(4, "complete", `${Math.round(prompt.length / 1000)}K chars context`);

                // STEP 5: AI Analysis
                sendProgress(5, "active", "Groq Llama 3.3 70B processing...");
                const aiResponseText = await analyzeRepoWithGroq(prompt);
                sendProgress(5, "complete", `${Math.round(aiResponseText.length / 1000)}K chars response`);

                // STEP 6: Parsing
                sendProgress(6, "active");
                let cleanedJson = aiResponseText.trim();
                if (cleanedJson.startsWith("```json")) {
                    cleanedJson = cleanedJson.replace(/^```json/, "").replace(/```$/, "");
                } else if (cleanedJson.startsWith("```")) {
                    cleanedJson = cleanedJson.replace(/^```/, "").replace(/```$/, "");
                }
                const analysisData = JSON.parse(cleanedJson);
                sendProgress(6, "complete", `${analysisData.insights?.length || 0} insights found`);

                // STEP 7: Complete
                sendProgress(7, "complete", `Score: ${analysisData.scores?.overall}/100`);

                console.log(`✅ RAG PIPELINE COMPLETE: ${owner}/${repo}`);

                // Send final result
                sendResult(analysisData);

            } catch (error: any) {
                console.error("❌ RAG PIPELINE ERROR:", error.message);
                sendError(error.message || "Analysis failed");
            } finally {
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}
