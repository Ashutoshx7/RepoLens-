"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Sparkles, Loader2, Shield, AlertTriangle, CheckCircle2,
    Code2, Lightbulb, TrendingUp, AlertCircle, Cpu, Lock,
    FileCode, Zap, ArrowRight, BookOpen, Box, Database, Globe,
    Server, Layers, GitBranch, Package, Settings, Wrench, Activity,
    BarChart3, PieChart as PieChartIcon, Target, Flame, Star, Eye, RefreshCw,
    ChevronRight, ExternalLink, Brain, Workflow, Anchor, Key
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, AreaChart, Area, CartesianGrid
} from 'recharts';

// Enhanced Analysis Result Interface - Deep Research
interface AnalysisResult {
    summary: string;
    projectType?: string;
    maturity?: string;
    techStack: string[];
    scores: {
        overall: number;
        codeQuality: number;
        security: number;
        maintainability: number;
        documentation: number;
        testing?: number;
        performance?: number;
        developerExperience?: number;
    };
    insights: {
        type: "strength" | "weakness" | "suggestion" | "security";
        title: string;
        description: string;
        priority: "low" | "medium" | "high" | "critical";
    }[];
    architecture: {
        name: string;
        type: "frontend" | "backend" | "database" | "service" | "infra" | "tool";
        description: string;
    }[];
    dependencies?: {
        status: string;
        outdated?: number;
        vulnerabilities?: number;
        heaviest?: string[];
        suggestions?: string[];
    };
    quickWins?: string[];
    longTermImprovements?: string[];
}

// Sophisticated Radar Chart for Scores
const ScoreRadarParams = [
    { key: 'codeQuality', label: 'Quality' },
    { key: 'security', label: 'Security' },
    { key: 'maintainability', label: 'Maintainability' },
    { key: 'documentation', label: 'Docs' },
    { key: 'testing', label: 'Testing' },
    { key: 'performance', label: 'Perf' },
    { key: 'developerExperience', label: 'DX' },
];

const ScoreRadarChart = ({ scores }: { scores: any }) => {
    const data = ScoreRadarParams.map(p => ({
        subject: p.label,
        A: scores[p.key] || 0,
        fullMark: 100,
    }));

    return (
        <div className="h-[300px] w-full mt-4 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e4e4e7" strokeDasharray="3 3" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#71717a', fontSize: 11, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Project Health"
                        dataKey="A"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="#3b82f6"
                        fillOpacity={0.2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Premium Card Component - Refined, Subtle Dark Theme
const PremiumCard = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
            "p-6 rounded-2xl border transition-all duration-500 ease-out",
            // Subtle, refined borders
            "border-zinc-200/40 dark:border-zinc-800/40",
            // Soft background with glass effect
            "bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md",
            // Refined shadow - very subtle
            "shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04)]",
            "dark:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.2)]",
            // Hover state - subtle lift
            "hover:border-zinc-300/60 dark:hover:border-zinc-700/50",
            "hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
            "dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.35)]",
            "hover:-translate-y-0.5",
            className
        )}
    >
        {children}
    </motion.div>
);

// Radial Progress Component - Monochrome style
const RadialProgress = ({ score, size = 140, strokeWidth = 10, label }: {
    score: number;
    size?: number;
    strokeWidth?: number;
    label: string;
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 80) return { stroke: "#18181b", text: "text-zinc-900 dark:text-zinc-100" };
        if (s >= 60) return { stroke: "#3f3f46", text: "text-zinc-700 dark:text-zinc-300" };
        if (s >= 40) return { stroke: "#71717a", text: "text-zinc-500" };
        return { stroke: "#a1a1aa", text: "text-zinc-400" };
    };

    const colors = getColor(score);

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg width={size} height={size} className="-rotate-90 drop-shadow-lg">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-zinc-100 dark:text-zinc-800"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className="dark:stroke-white"
                    initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className={cn("text-4xl font-bold tracking-tighter", colors.text)}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    {score}
                </motion.span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{label}</span>
            </div>
        </div>
    );
};

// Score Bar Component - Monochrome style
const ScoreBar = ({ label, score, icon, delay = 0 }: {
    label: string;
    score: number;
    icon: React.ReactNode;
    delay?: number;
}) => {
    // Subtle color based on score
    const getBarColor = (s: number) => {
        if (s >= 80) return "bg-gradient-to-r from-emerald-500/80 to-emerald-400/60";
        if (s >= 60) return "bg-gradient-to-r from-blue-500/80 to-blue-400/60";
        if (s >= 40) return "bg-gradient-to-r from-amber-500/80 to-amber-400/60";
        return "bg-gradient-to-r from-red-500/80 to-red-400/60";
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-2.5 group"
        >
            <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2.5 font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    <span className="text-zinc-400 dark:text-zinc-500">{icon}</span>
                    {label}
                </span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-100 tabular-nums tracking-tight">{score}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100/80 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.4, delay: delay + 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className={cn("h-full rounded-full", getBarColor(score))}
                />
            </div>
        </motion.div>
    );
};

// Tech Badge Component - Refined
const TechBadge = ({ tech, index }: { tech: string; index: number }) => (
    <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
        className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide bg-zinc-50/80 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/40 backdrop-blur-sm hover:bg-zinc-100/80 dark:hover:bg-zinc-700/40 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-300 cursor-default"
    >
        {tech}
    </motion.span>
);

// Risk Distribution Chart
const RiskDistributionChart = ({ insights }: { insights: any[] }) => {
    const data = [
        { name: 'Critical', value: insights.filter(i => i.priority === 'critical').length, color: '#ef4444' },
        { name: 'High', value: insights.filter(i => i.priority === 'high').length, color: '#f97316' },
        { name: 'Medium', value: insights.filter(i => i.priority === 'medium').length, color: '#eab308' },
        { name: 'Low', value: insights.filter(i => i.priority === 'low').length, color: '#3b82f6' },
    ].filter(d => d.value > 0);

    if (data.length === 0) return <div className="text-zinc-500 text-xs text-center py-10">No risks detected</div>;

    return (
        <div className="flex flex-col items-center">
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(24, 24, 27, 0.95)',
                                borderRadius: '8px',
                                border: '1px solid #3f3f46',
                                color: 'white'
                            }}
                            itemStyle={{ color: 'white' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 -mt-2">
                {data.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5">
                        <div className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase">{d.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Activity/Velocity Chart
const VelocityChart = () => {
    // Simulated data for visual appeal
    const data = [
        { name: 'Week 1', activity: 40 },
        { name: 'Week 2', activity: 30 },
        { name: 'Week 3', activity: 20 },
        { name: 'Week 4', activity: 27 },
        { name: 'Week 5', activity: 18 },
        { name: 'Week 6', activity: 23 },
        { name: 'Week 7', activity: 34 },
        { name: 'Week 8', activity: 45 },
        { name: 'Week 9', activity: 60 },
        { name: 'Week 10', activity: 55 },
        { name: 'Week 11', activity: 70 },
        { name: 'Week 12', activity: 65 },
    ];

    return (
        <div className="h-[200px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(24, 24, 27, 0.95)',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            color: 'white'
                        }}
                        itemStyle={{ color: '#3b82f6' }}
                        labelStyle={{ color: '#a1a1aa' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="activity"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorActivity)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// Category Bar Chart
const CategoryBarChart = ({ insights }: { insights: any[] }) => {
    const categories = {
        strength: insights.filter(i => i.type === "strength").length,
        weakness: insights.filter(i => i.type === "weakness").length,
        suggestion: insights.filter(i => i.type === "suggestion").length,
        security: insights.filter(i => i.type === "security").length,
    };

    const data = [
        { name: 'Strength', count: categories.strength, fill: '#22c55e' }, // green-500
        { name: 'Weakness', count: categories.weakness, fill: '#ef4444' }, // red-500
        { name: 'Suggestion', count: categories.suggestion, fill: '#a855f7' }, // purple-500
        { name: 'Security', count: categories.security, fill: '#f97316' }, // orange-500
    ].filter(d => d.count > 0);

    if (data.length === 0) return <div className="text-zinc-500 text-xs">No data available</div>;

    return (
        <div className="h-[200px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e4e4e7" opacity={0.3} />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: 10, fill: '#71717a' }}
                        width={60}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                            backgroundColor: 'rgba(24, 24, 27, 0.95)',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            color: 'white'
                        }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// Insight Card Component - Monochrome
const InsightCard = ({ insight, index }: {
    insight: AnalysisResult["insights"][0];
    index: number;
}) => {
    const typeConfig = {
        strength: { icon: <CheckCircle2 className="size-4" />, label: "Strength" },
        weakness: { icon: <AlertTriangle className="size-4" />, label: "Weakness" },
        suggestion: { icon: <Lightbulb className="size-4" />, label: "Suggestion" },
        security: { icon: <Shield className="size-4" />, label: "Security" },
    };

    const priorityConfig = {
        low: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
        medium: "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300",
        high: "bg-zinc-300 dark:bg-zinc-600 text-zinc-800 dark:text-zinc-200",
        critical: "bg-zinc-900 dark:bg-white text-white dark:text-black",
    };

    const config = typeConfig[insight.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
        >
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    {config.icon}
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">{insight.title}</h4>
                </div>
                <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", priorityConfig[insight.priority])}>
                    {insight.priority}
                </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {insight.description}
            </p>
        </motion.div>
    );
};

// Architecture Component Card - Monochrome
const ArchitectureCard = ({ component, index }: {
    component: AnalysisResult["architecture"][0];
    index: number;
}) => {
    const typeIcons = {
        frontend: <Globe className="size-5" />,
        backend: <Server className="size-5" />,
        database: <Database className="size-5" />,
        service: <Cpu className="size-5" />,
        infra: <Box className="size-5" />,
        tool: <Wrench className="size-5" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {typeIcons[component.type] || typeIcons.service}
                </div>
                <div>
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">{component.name}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">{component.type}</span>
                </div>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {component.description}
            </p>
        </motion.div>
    );
};

// Real-time Pipeline Progress Component - Monochrome Theme
const PipelineProgress = ({ steps, currentStep, stepDetails }: {
    steps: { id: string; label: string; status: string; details?: string }[];
    currentStep: number;
    stepDetails: Record<string, string>;
}) => {
    const stepIcons: Record<string, React.ReactNode> = {
        git: <GitBranch className="size-4" />,
        folder: <Layers className="size-4" />,
        file: <FileCode className="size-4" />,
        chart: <BarChart3 className="size-4" />,
        brain: <Brain className="size-4" />,
        sparkles: <Sparkles className="size-4" />,
        check: <CheckCircle2 className="size-4" />,
        complete: <Star className="size-4" />,
    };

    return (
        <div className="border border-zinc-200/40 dark:border-zinc-800/40 rounded-2xl p-8 bg-white/60 dark:bg-black/60 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center">
                {/* Animated Brain - Monochrome */}
                <div className="relative mb-8">
                    <div className="size-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-700/50">
                        <Brain className="size-12 text-zinc-900 dark:text-white animate-pulse" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 size-8 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold">
                        <Sparkles className="size-4" />
                    </div>
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-1">
                    Deep Research Pipeline
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                    RAG-powered analysis in progress...
                </p>

                {/* Progress Bar - Monochrome */}
                <div className="w-full max-w-md mb-8">
                    <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-zinc-900 dark:bg-white rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-zinc-500">
                        <span>Step {currentStep + 1} of {steps.length}</span>
                        <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                    </div>
                </div>

                {/* Pipeline Steps - Monochrome */}
                <div className="space-y-2 w-full max-w-md">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border",
                                step.status === "active"
                                    ? "bg-zinc-100/80 dark:bg-zinc-800/80 border-zinc-300/50 dark:border-zinc-600/50 text-zinc-900 dark:text-white"
                                    : step.status === "complete"
                                        ? "bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200/30 dark:border-zinc-700/30 text-zinc-600 dark:text-zinc-400"
                                        : "bg-zinc-50/30 dark:bg-zinc-900/30 border-zinc-200/20 dark:border-zinc-800/20 text-zinc-400 dark:text-zinc-600"
                            )}
                        >
                            <div className={cn(
                                "size-8 rounded-lg flex items-center justify-center transition-all",
                                step.status === "active"
                                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black"
                                    : step.status === "complete"
                                        ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600"
                            )}>
                                {step.status === "complete" ? (
                                    <CheckCircle2 className="size-4" />
                                ) : step.status === "active" ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    stepIcons[step.id.includes("git") ? "git" : step.id] || <Code2 className="size-4" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium block truncate">{step.label}</span>
                                {step.details && step.status !== "pending" && (
                                    <span className="text-[10px] text-zinc-500 dark:text-zinc-500 block truncate">
                                        {step.details}
                                    </span>
                                )}
                            </div>
                            {step.status === "active" && (
                                <div className="flex gap-1">
                                    <div className="size-1.5 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
                                    <div className="size-1.5 rounded-full bg-zinc-900 dark:bg-white animate-pulse" style={{ animationDelay: "0.2s" }} />
                                    <div className="size-1.5 rounded-full bg-zinc-900 dark:bg-white animate-pulse" style={{ animationDelay: "0.4s" }} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function HealthAnalysis({ owner, repo }: { owner: string; repo: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [activeInsightFilter, setActiveInsightFilter] = useState<string>("all");

    // Real-time pipeline state
    const [pipelineSteps, setPipelineSteps] = useState<{ id: string; label: string; status: string; details?: string }[]>([
        { id: "metadata", label: "Fetching repository metadata...", status: "pending" },
        { id: "tree", label: "Retrieving file structure...", status: "pending" },
        { id: "files", label: "Extracting important files...", status: "pending" },
        { id: "stats", label: "Calculating file statistics...", status: "pending" },
        { id: "prompt", label: "Building analysis context...", status: "pending" },
        { id: "ai", label: "Running deep AI research...", status: "pending" },
        { id: "parse", label: "Parsing results...", status: "pending" },
        { id: "complete", label: "Analysis complete!", status: "pending" },
    ]);
    const [currentPipelineStep, setCurrentPipelineStep] = useState(0);

    const startAnalysis = async () => {
        setLoading(true);
        setError(null);
        setCurrentPipelineStep(0);
        setPipelineSteps(prev => prev.map(s => ({ ...s, status: "pending", details: undefined })));

        try {
            // Use streaming API
            const response = await fetch("/api/analyze-stream", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ owner, repo }),
            });

            if (!response.ok) {
                throw new Error("Failed to start analysis");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("No response stream");
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);
                const lines = text.split("\n\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === "progress") {
                                setCurrentPipelineStep(data.step);
                                setPipelineSteps(prev => prev.map((s, i) => ({
                                    ...s,
                                    status: i < data.step ? "complete" : i === data.step ? data.status : "pending",
                                    details: i === data.step ? data.details : s.details
                                })));
                            } else if (data.type === "result") {
                                const apiData = data.data;
                                setResult({
                                    summary: apiData.summary,
                                    projectType: apiData.projectType,
                                    maturity: apiData.maturity,
                                    techStack: apiData.techStack || [],
                                    scores: {
                                        overall: apiData.scores?.overall || 0,
                                        codeQuality: apiData.scores?.codeQuality || 0,
                                        security: apiData.scores?.security || 0,
                                        maintainability: apiData.scores?.maintainability || 0,
                                        documentation: apiData.scores?.documentation || 0,
                                        testing: apiData.scores?.testing,
                                        performance: apiData.scores?.performance,
                                        developerExperience: apiData.scores?.developerExperience,
                                    },
                                    insights: apiData.insights || [],
                                    architecture: apiData.architecture || [],
                                    dependencies: apiData.dependencies,
                                    quickWins: apiData.quickWins || [],
                                    longTermImprovements: apiData.longTermImprovements || [],
                                });
                            } else if (data.type === "error") {
                                throw new Error(data.error);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || "Failed to analyze repository");
        } finally {
            setLoading(false);
        }
    };

    const filteredInsights = result?.insights.filter(
        i => activeInsightFilter === "all" || i.type === activeInsightFilter
    ) || [];

    // Initial State - Monochrome Design
    if (!loading && !result) {
        return (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center bg-white dark:bg-black relative overflow-hidden">
                <div className="relative">
                    <div className="inline-flex p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-6">
                        <Brain className="size-10 text-zinc-900 dark:text-zinc-100" />
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                        Repository Intelligence
                    </h3>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm text-left flex gap-3 items-start max-w-lg mx-auto">
                        <AlertCircle className="size-4 mt-0.5 shrink-0 text-zinc-500" />
                        <p className="whitespace-pre-line">{error}</p>
                    </div>
                )}

                <Button
                    onClick={startAnalysis}
                    disabled={loading}
                    size="lg"
                    className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-8"
                >
                    <Sparkles className="size-4 mr-2" />
                    Start Analysis
                    <ArrowRight className="size-4 ml-2" />
                </Button>
            </div>
        );
    }

    // Loading State - Real-time Pipeline Progress
    if (loading) {
        return <PipelineProgress steps={pipelineSteps} currentStep={currentPipelineStep} stepDetails={{}} />;
    }

    // Results State - Refined Deep Research UI
    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50">
                            <Brain className="size-5 text-zinc-600 dark:text-zinc-400" />
                        </span>
                        Repository Intelligence
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 ml-[52px]">
                        Deep research analysis of <span className="font-medium text-zinc-700 dark:text-zinc-200">{owner}/{repo}</span>
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={startAnalysis}
                    className="h-9 px-4 text-xs font-medium border-zinc-200/60 dark:border-zinc-700/50 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all duration-300 rounded-xl"
                >
                    <RefreshCw className="size-3.5 mr-2 text-zinc-500" />
                    Re-analyze
                </Button>
            </div>

            {/* At-a-Glance Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PremiumCard delay={0.05} className="flex flex-col justify-between h-32">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Anchor className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Project Type</span>
                    </div>
                    <div className="text-2xl font-bold capitalize text-zinc-900 dark:text-white tracking-tight">
                        {result!.projectType || "Unknown"}
                    </div>
                </PremiumCard>
                <PremiumCard delay={0.1} className="flex flex-col justify-between h-32">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Activity className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Maturity</span>
                    </div>
                    <div className="text-2xl font-bold capitalize text-zinc-900 dark:text-white tracking-tight">
                        {result!.maturity || "Evaluating"}
                    </div>
                </PremiumCard>
                <PremiumCard delay={0.15} className="flex flex-col justify-between h-32">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Package className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Dependencies</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold capitalize text-zinc-900 dark:text-white tracking-tight">
                            {result!.dependencies?.status || "Unknown"}
                        </div>
                        {result!.dependencies?.outdated && (
                            <span className="text-xs font-medium text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                                {result!.dependencies.outdated} outdated
                            </span>
                        )}
                    </div>
                </PremiumCard>
                <PremiumCard delay={0.2} className="flex flex-col justify-between h-32 border-zinc-900/10 dark:border-zinc-100/10">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Star className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Overall Score</span>
                    </div>
                    <div className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
                        {result!.scores.overall}
                        <span className="text-lg text-zinc-400 font-medium ml-1">/100</span>
                    </div>
                </PremiumCard>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Health Radar & Scores */}
                <div className="lg:col-span-1 space-y-6">
                    <PremiumCard delay={0.3} className="overflow-hidden relative min-h-[400px]">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Activity className="size-4 text-zinc-500" />
                                Health Radar
                            </h3>
                        </div>
                        <div className="flex flex-col items-center justify-center -ml-4">
                            {/* New Radar Chart */}
                            <ScoreRadarChart scores={result!.scores} />

                            {/* Score Text Overhead */}
                            <div className="absolute bottom-6 flex flex-col items-center pointer-events-none">
                                <span className="text-sm text-zinc-500 uppercase tracking-widest font-medium">Weighted Score</span>
                                <span className="text-3xl font-black text-zinc-900 dark:text-white">{result!.scores.overall}</span>
                            </div>
                        </div>
                    </PremiumCard>

                    {/* Key Metrics Bars */}
                    <PremiumCard delay={0.4}>
                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                            <BarChart3 className="size-4 text-zinc-500" />
                            Detailed Metrics
                        </h3>
                        <div className="space-y-5">
                            <ScoreBar label="Code Quality" score={result!.scores.codeQuality} icon={<Code2 className="size-3.5" />} delay={0.1} />
                            <ScoreBar label="Security" score={result!.scores.security} icon={<Shield className="size-3.5" />} delay={0.2} />
                            <ScoreBar label="Maintainability" score={result!.scores.maintainability} icon={<Settings className="size-3.5" />} delay={0.3} />
                            <ScoreBar label="Documentation" score={result!.scores.documentation} icon={<BookOpen className="size-3.5" />} delay={0.4} />
                            {result!.scores.testing !== undefined && (
                                <ScoreBar label="Testing" score={result!.scores.testing} icon={<CheckCircle2 className="size-3.5" />} delay={0.5} />
                            )}
                            {result!.scores.performance !== undefined && (
                                <ScoreBar label="Performance" score={result!.scores.performance} icon={<Zap className="size-3.5" />} delay={0.6} />
                            )}
                            {result!.scores.developerExperience !== undefined && (
                                <ScoreBar label="Dev Experience" score={result!.scores.developerExperience} icon={<Star className="size-3.5" />} delay={0.7} />
                            )}
                        </div>
                    </PremiumCard>
                </div>

                {/* Right Column: Summary, Tech Stack, Architecture */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tech Stack Horizontal Scroll */}
                    {result!.techStack.length > 0 && (
                        <PremiumCard delay={0.3}>
                            <div className="flex items-center gap-2 mb-4">
                                <Cpu className="size-4 text-zinc-500" />
                                <span className="font-semibold text-zinc-900 dark:text-white">Technology Stack</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {result!.techStack.map((tech, i) => (
                                    <TechBadge key={tech} tech={tech} index={i} />
                                ))}
                            </div>
                        </PremiumCard>
                    )}

                    {/* Summary Card */}
                    <PremiumCard delay={0.35}>
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="size-4 text-zinc-500" />
                            <span className="font-semibold text-zinc-900 dark:text-white">Executive Summary</span>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                            {result!.summary}
                        </p>
                    </PremiumCard>

                    {/* Architecture Section */}
                    {result!.architecture.length > 0 && (
                        <PremiumCard delay={0.4}>
                            <div className="flex items-center gap-2 mb-6">
                                <Layers className="size-4 text-zinc-500" />
                                <span className="font-semibold text-zinc-900 dark:text-white">System Architecture</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {result!.architecture.map((comp, i) => (
                                    <ArchitectureCard key={comp.name} component={comp} index={i} />
                                ))}
                            </div>
                        </PremiumCard>
                    )}

                    {/* Risk Analysis Chart */}
                    <PremiumCard delay={0.45}>
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="size-4 text-zinc-500" />
                            <span className="font-semibold text-zinc-900 dark:text-white">Risk Analysis</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-zinc-500 max-w-[200px]">
                                Distribution of issues by priority level found during deep analysis.
                            </div>
                            <div className="w-[50%]">
                                <RiskDistributionChart insights={result!.insights} />
                            </div>
                        </div>
                    </PremiumCard>

                    {/* Additional Deep Charts Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <PremiumCard delay={0.46} className="overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="size-4 text-blue-500" />
                                <span className="font-semibold text-zinc-900 dark:text-white">Project Vitality</span>
                            </div>
                            <div className="text-xs text-zinc-500 mb-2">Estimated activity trend (simulated).</div>
                            <VelocityChart />
                        </PremiumCard>

                        <PremiumCard delay={0.48} className="overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="size-4 text-purple-500" />
                                <span className="font-semibold text-zinc-900 dark:text-white">Insight Composition</span>
                            </div>
                            <div className="text-xs text-zinc-500 mb-2">Findings by category breakdown.</div>
                            <CategoryBarChart insights={result!.insights} />
                        </PremiumCard>
                    </div>
                </div>
            </div>

            {/* Quick Wins & Long Term Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result!.quickWins && result!.quickWins.length > 0 && (
                    <PremiumCard delay={0.5}>
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="size-4 text-amber-500" />
                            <span className="font-semibold text-zinc-900 dark:text-white">Quick Wins</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 ml-auto">Immediate Value</span>
                        </div>
                        <ul className="space-y-3">
                            {result!.quickWins.map((win, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300 group"
                                >
                                    <div className="mt-1 min-w-4 flex justify-center">
                                        <div className="size-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                                    </div>
                                    {win}
                                </motion.li>
                            ))}
                        </ul>
                    </PremiumCard>
                )}

                {result!.longTermImprovements && result!.longTermImprovements.length > 0 && (
                    <PremiumCard delay={0.55}>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="size-4 text-blue-500" />
                            <span className="font-semibold text-zinc-900 dark:text-white">Strategic Goals</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 ml-auto">Long Term</span>
                        </div>
                        <ul className="space-y-3">
                            {result!.longTermImprovements.map((improvement, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300 group"
                                >
                                    <div className="mt-1 min-w-4 flex justify-center">
                                        <div className="size-1.5 rounded-full bg-blue-400 group-hover:scale-125 transition-transform" />
                                    </div>
                                    {improvement}
                                </motion.li>
                            ))}
                        </ul>
                    </PremiumCard>
                )}
            </div>

            {/* Insights Section */}
            <PremiumCard delay={0.6}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Lightbulb className="size-4 text-zinc-500" />
                        <span className="font-semibold text-zinc-900 dark:text-white">Detailed Insights</span>
                        <span className="text-xs text-zinc-400 font-normal ml-2">({result!.insights.length} findings)</span>
                    </div>

                    <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        {["all", "strength", "weakness", "suggestion", "security"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveInsightFilter(filter)}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all capitalize",
                                    activeInsightFilter === filter
                                        ? "bg-white dark:bg-black text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800"
                                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="wait">
                        {filteredInsights.map((insight, i) => (
                            <InsightCard key={`${insight.title}-${i}`} insight={insight} index={i} />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredInsights.length === 0 && (
                    <div className="text-center py-12 text-zinc-500 text-sm italic">
                        No insights matches the selected filter.
                    </div>
                )}
            </PremiumCard>

        </div>
    );
}
