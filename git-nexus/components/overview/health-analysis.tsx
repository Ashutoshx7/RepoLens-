"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sparkles, Loader2, Shield, AlertTriangle, CheckCircle2,
    Code2, Lightbulb, TrendingUp, AlertCircle, Cpu, Lock,
    FileCode, Zap, ArrowRight, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnalysisResult {
    summary: string;
    overallScore: number;
    codeQuality: number;
    security: number;
    documentation: number;
    architecture: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    securityIssues: string[];
}

export default function HealthAnalysis({ owner, repo }: { owner: string; repo: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const startAnalysis = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ owner, repo }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || "Failed to analyze repository");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        if (score >= 40) return "bg-orange-500";
        return "bg-red-500";
    };

    const ScoreBar = ({ label, score }: { label: string, score: number }) => (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-zinc-500">
                <span>{label}</span>
                <span>{score}/100</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full rounded-full", getScoreColor(score))}
                />
            </div>
        </div>
    );

    if (!result) {
        return (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-12 text-center bg-white dark:bg-black">
                <div className="inline-flex p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-6">
                    <Sparkles className="size-6 text-zinc-900 dark:text-zinc-100" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                    Repository Health Analysis
                </h3>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-8">
                    Generate an AI-powered report on code quality, security, and architecture using Gemini.
                </p>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-400 text-sm text-left flex gap-3 items-start">
                        <AlertCircle className="size-4 mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <Button
                    onClick={startAnalysis}
                    disabled={loading}
                    className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                    {loading ? (
                        <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Generating Report...
                        </>
                    ) : (
                        <>
                            Start Analysis
                            <ArrowRight className="size-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className="lg:col-span-1 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
                    <div className="text-center mb-8">
                        <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-4">Overall Score</div>
                        <div className="text-7xl font-bold tracking-tighter text-zinc-900 dark:text-white">
                            {result.overallScore}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <ScoreBar label="Code Quality" score={result.codeQuality} />
                        <ScoreBar label="Security" score={result.security} />
                        <ScoreBar label="Documentation" score={result.documentation} />
                        <ScoreBar label="Architecture" score={result.architecture} />
                    </div>
                </div>

                {/* Summary Card */}
                <div className="lg:col-span-2 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
                    <div className="flex items-center gap-2 mb-6">
                        <BookOpen className="size-5" />
                        <span className="font-semibold">Executive Summary</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                        {result.summary}
                    </p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-green-500" /> Strengths
                            </div>
                            <ul className="space-y-2">
                                {result.strengths.slice(0, 4).map((str, i) => (
                                    <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300 pl-4 border-l-2 border-zinc-100 dark:border-zinc-800">
                                        {str}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                                <AlertTriangle className="size-4 text-orange-500" /> Weaknesses
                            </div>
                            <ul className="space-y-2">
                                {result.weaknesses.slice(0, 4).map((wk, i) => (
                                    <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300 pl-4 border-l-2 border-zinc-100 dark:border-zinc-800">
                                        {wk}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recommendations */}
                <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="size-5" />
                        <span className="font-semibold">Recommendations</span>
                    </div>
                    <div className="space-y-4">
                        {result.recommendations.map((rec, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="flex items-center justify-center size-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-500 shrink-0 mt-0.5">
                                    {i + 1}
                                </span>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security */}
                <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
                    <div className="flex items-center gap-2 mb-6">
                        <Lock className="size-5" />
                        <span className="font-semibold">Security Findings</span>
                    </div>
                    {result.securityIssues.length > 0 ? (
                        <ul className="space-y-4">
                            {result.securityIssues.map((issue, i) => (
                                <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-100 dark:border-red-900/20">
                                    {issue}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm text-zinc-500 italic">No major security issues detected.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
