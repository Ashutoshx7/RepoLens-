import { NextRequest, NextResponse } from "next/server";
import { fetchRepoTree, fetchImportantFiles, calculateFileStats, createCompactTreeString, fetchRepoMetadata } from "@/lib/github-server";
import { analyzeRepoWithGroq } from "@/lib/groq";
import { buildAnalysisPrompt } from "@/lib/prompt-builder";

export async function POST(req: NextRequest) {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 RAG PIPELINE STARTED");
    console.log("=".repeat(60));

    try {
        const { owner, repo } = await req.json();
        console.log(`\n📦 Target Repository: ${owner}/${repo}`);

        if (!owner || !repo) {
            return NextResponse.json({ error: "Owner and Repo are required" }, { status: 400 });
        }

        // STEP 1: RETRIEVAL - Fetch Data from GitHub
        console.log("\n" + "-".repeat(40));
        console.log("📥 STEP 1: RETRIEVAL (GitHub Data Fetching)");
        console.log("-".repeat(40));

        const startRetrieval = Date.now();
        const [tree, importantFiles, metadata] = await Promise.all([
            fetchRepoTree(owner, repo),
            fetchImportantFiles(owner, repo),
            fetchRepoMetadata(owner, repo)
        ]);
        const retrievalTime = Date.now() - startRetrieval;

        console.log(`  ✅ Repository Metadata: ${metadata.fullName}`);
        console.log(`     - Stars: ${metadata.stars}, Forks: ${metadata.forks}`);
        console.log(`     - Language: ${metadata.language}`);
        console.log(`  ✅ File Tree: ${tree.length} root nodes retrieved`);
        console.log(`  ✅ Important Files: ${Object.keys(importantFiles).length} files fetched`);
        console.log(`     Files: ${Object.keys(importantFiles).join(", ")}`);
        console.log(`  ⏱️  Retrieval Time: ${retrievalTime}ms`);

        // STEP 2: AUGMENTATION - Process & Build Context
        console.log("\n" + "-".repeat(40));
        console.log("🔧 STEP 2: AUGMENTATION (Context Building)");
        console.log("-".repeat(40));

        const startAugmentation = Date.now();
        const fileStats = calculateFileStats(tree);
        const compactTree = createCompactTreeString(tree, 50);
        const prompt = buildAnalysisPrompt(metadata, fileStats, compactTree, importantFiles);
        const augmentationTime = Date.now() - startAugmentation;

        console.log(`  ✅ File Statistics:`);
        console.log(`     - Total Files: ${fileStats.totalFiles}`);
        console.log(`     - Total Directories: ${fileStats.totalDirectories}`);
        console.log(`     - Languages: ${Object.keys(fileStats.languages).slice(0, 5).join(", ")}`);
        console.log(`  ✅ Prompt Length: ${prompt.length} characters`);
        console.log(`  ⏱️  Augmentation Time: ${augmentationTime}ms`);

        // STEP 3: GENERATION - AI Analysis
        console.log("\n" + "-".repeat(40));
        console.log("🧠 STEP 3: GENERATION (Groq Llama 3.3 70B)");
        console.log("-".repeat(40));

        const startGeneration = Date.now();
        const aiResponseText = await analyzeRepoWithGroq(prompt);
        const generationTime = Date.now() - startGeneration;

        console.log(`  ✅ AI Response Length: ${aiResponseText.length} characters`);
        console.log(`  ⏱️  Generation Time: ${generationTime}ms`);

        // STEP 4: PARSING - Extract Structured Data
        console.log("\n" + "-".repeat(40));
        console.log("📊 STEP 4: PARSING (JSON Extraction)");
        console.log("-".repeat(40));

        let cleanedJson = aiResponseText.trim();
        if (cleanedJson.startsWith("```json")) {
            cleanedJson = cleanedJson.replace(/^```json/, "").replace(/```$/, "");
        } else if (cleanedJson.startsWith("```")) {
            cleanedJson = cleanedJson.replace(/^```/, "").replace(/```$/, "");
        }

        const analysisData = JSON.parse(cleanedJson);

        console.log(`  ✅ Parsed Successfully`);
        console.log(`     - Summary: ${analysisData.summary?.slice(0, 80)}...`);
        console.log(`     - Project Type: ${analysisData.projectType}`);
        console.log(`     - Maturity: ${analysisData.maturity}`);
        console.log(`     - Tech Stack: ${analysisData.techStack?.slice(0, 5).join(", ")}`);
        console.log(`     - Overall Score: ${analysisData.scores?.overall}`);
        console.log(`     - Insights Count: ${analysisData.insights?.length}`);

        // PIPELINE COMPLETE
        const totalTime = retrievalTime + augmentationTime + generationTime;
        console.log("\n" + "=".repeat(60));
        console.log("✅ RAG PIPELINE COMPLETE");
        console.log(`   Total Time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
        console.log("=".repeat(60) + "\n");

        return NextResponse.json(analysisData);

    } catch (error: any) {
        console.error("\n❌ RAG PIPELINE ERROR:", error.message);
        console.error("   Details:", error.toString());
        return NextResponse.json({
            error: error.message || "Failed to analyze repository",
            details: error.toString()
        }, { status: 500 });
    }
}
