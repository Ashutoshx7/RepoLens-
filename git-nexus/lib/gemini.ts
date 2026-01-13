import { GoogleGenerativeAI } from "@google/generative-ai";

// User's API key (provided directly for testing)
const API_KEY = "AIzaSyDRcUx6h0u6RQn1BhcVzvEPlTPQP45qioU";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeRepoWithGemini(prompt: string) {
    // Use gemini-1.5-flash which is the current recommended model
    // Note: The model name should NOT include "models/" prefix - the SDK adds it
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error: any) {
        console.error("Gemini Analysis Error:", error);
        // Provide detailed error for debugging
        const errorMessage = error.message || error.toString();

        // Check for common issues
        if (errorMessage.includes("404")) {
            throw new Error(
                `Model not found. This usually means:\n` +
                `1. The Generative Language API is not enabled on your Google Cloud project\n` +
                `2. The API key is invalid or restricted\n` +
                `3. You need to enable billing on your Google Cloud project\n\n` +
                `Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com\n` +
                `And enable the "Generative Language API" for your project.`
            );
        }

        throw new Error(`Gemini Error: ${errorMessage}`);
    }
}
