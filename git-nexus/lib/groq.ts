import Groq from "groq-sdk";

// Read API key from environment variable
const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
    console.warn("⚠️ GROQ_API_KEY environment variable is not set. AI analysis will fail.");
}

// Initialize Groq SDK (server-side only)
const groq = new Groq({
    apiKey: API_KEY || "",
});

export async function analyzeRepoWithGroq(prompt: string) {
    console.log("Starting Groq analysis...");

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert Senior Software Architect specializing in code analysis. You must output strictly valid JSON matching the requested schema. Do not output markdown code blocks, just the raw JSON object."
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3, // Lower temperature for more consistent JSON
            max_tokens: 8000,
            response_format: { type: "json_object" },
        });

        const text = chatCompletion.choices[0]?.message?.content || "";
        console.log("Groq Analysis completed successfully!");
        return text;
    } catch (error: any) {
        console.error("Groq Error Details:", error);
        throw new Error("Groq API Error: " + error.message);
    }
}
