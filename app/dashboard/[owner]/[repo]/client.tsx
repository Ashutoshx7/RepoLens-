"use client";

import { useState, useEffect } from "react";
import { RepoMetadata, RepoStats, TimeFilter, ContributorStats } from "@/lib/types";
import { fetchRepoStats } from "@/lib/github-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    ArrowRight, Shield
} from "lucide-react";
import HealthAnalysis from "@/components/overview/health-analysis";
import CodeExplorer from "@/components/overview/code-explorer";
import { ThemeToggle } from "@/components/theme-toggle";
import { ContributorProfile } from "@/components/overview/contributor-profile";
import Link from "next/link";
import { motion, animate } from "framer-motion";

export default function DashboardClient({
    metadata,
    owner,
    repo,
}: {
    metadata: RepoMetadata;
    owner: string;
    repo: string;
}) {
    const [stats, setStats] = useState<RepoStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("3m");
    const [selectedContributor, setSelectedContributor] = useState<ContributorStats | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            setLoadingStats(true);
            setStatsError(null);
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error("Request timed out")), 20000);
            });
            try {
                const data = await Promise.race([
                    fetchRepoStats(`${owner}/${repo}`, timeFilter),
                    timeoutPromise
                ]);
                setStats(data);
            } catch (error: any) {
                setStatsError(error.message || "Failed to load statistics");
            } finally {
                setLoadingStats(false);
            }
        };
        loadStats();
    }, [owner, repo, timeFilter]);

    const selectedContributorPRs = selectedContributor && stats
        ? stats.recentPRs.filter(pr => pr.user.login === selectedContributor.username)
        : [];

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-100 dark:selection:bg-zinc-800">
            {/* Navbar: Transparent & Airy */}
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-black/5 dark:border-white/5 transition-colors duration-500">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="size-8 flex items-center justify-center font-bold tracking-tighter text-lg hover:scale-110 active:scale-95 transition-transform duration-300"
                        >
                            GP
                        </Link>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-zinc-400 font-light">{owner}</span>
                            <span className="text-zinc-300 dark:text-zinc-700">/</span>
                            <span className="text-zinc-900 dark:text-zinc-100 tracking-tight">{repo}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400 opacity-60 hover:opacity-100 transition-opacity cursor-default" suppressHydrationWarning>
                            Updated {new Date(metadata.updatedAt).toLocaleDateString()}
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 py-12">
                <Tabs defaultValue="overview" className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <TabsList className="bg-transparent p-0 h-auto gap-8">
                            {[{ label: "Overview", value: "overview" }, { label: "Contributors", value: "contributors" }, { label: "Intelligence", value: "health" }, { label: "Code", value: "code" }].map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="rounded-none px-0 py-2 text-sm font-medium text-zinc-400 data-[state=active]:bg-transparent data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 transition-all shadow-none border-b border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white hover:text-zinc-600 dark:hover:text-zinc-300"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Range</span>
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                                className="bg-transparent text-xs font-medium outline-none cursor-pointer text-zinc-900 dark:text-zinc-100 hover:opacity-50 transition-opacity"
                            >
                                <option value="2w">2 Weeks</option>
                                <option value="1m">1 Month</option>
                                <option value="3m">3 Months</option>
                                <option value="6m">6 Months</option>
                                <option value="all">All Time</option>
                            </select>
                        </div>
                    </div>

                    <TabsContent value="overview" className="space-y-16 animate-in fade-in duration-1000 slide-in-from-bottom-8">
                        {/* Key Metrics - Clean Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
                            <StatMinimal label="Velocity" value={loadingStats ? 0 : stats?.totalPRs || 0} sub="Pull Requests" delay={0.1} />
                            <StatMinimal label="Community" value={loadingStats ? 0 : stats?.contributors.length || 0} sub="Contributors" delay={0.2} />
                            <StatMinimal label="Interest" value={metadata.stars} sub="Stars" delay={0.3} isStar={true} />
                            <StatMinimal label="Backlog" value={metadata.openIssues} sub="Issues" delay={0.4} />
                        </div>

                        {/* Activity Stream - Text Only */}
                        <section>
                            <div className="flex items-center justify-between mb-8 border-b border-black/5 dark:border-white/5 pb-4">
                                <h3 className="text-sm font-medium tracking-tight">Recent Activity</h3>
                                <Link href={`https://github.com/${owner}/${repo}/pulls`} target="_blank" className="text-xs text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 group">
                                    View on GitHub <ArrowRight className="size-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                </Link>
                            </div>

                            <div className="space-y-1">
                                {loadingStats ? (
                                    <div className="text-xs text-zinc-400 py-4 font-mono">Syncing stream...</div>
                                ) : (
                                    stats?.recentPRs.slice(0, 8).map((pr, i) => (
                                        <motion.div
                                            key={pr.number}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={{ x: 4, transition: { duration: 0.2 } }}
                                            className="group flex items-center gap-4 py-3 border-b border-black/[0.03] dark:border-white/[0.03] -mx-4 px-4 transition-colors cursor-default"
                                        >
                                            <motion.span
                                                className={cn(
                                                    "size-1.5 rounded-full shrink-0",
                                                    pr.state === 'open' ? "bg-emerald-500/50 group-hover:bg-emerald-500" : "bg-purple-500/50 group-hover:bg-purple-500"
                                                )}
                                                layoutId={`dot-${pr.number}`}
                                            />
                                            <div className="flex-1 min-w-0 flex items-baseline gap-3">
                                                <span className="font-mono text-[10px] text-zinc-400 opacity-60 group-hover:opacity-100 transition-opacity">#{pr.number}</span>
                                                <a href={pr.html_url} target="_blank" className="text-sm text-zinc-600 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors truncate font-normal">
                                                    {pr.title}
                                                </a>
                                            </div>
                                            <div className="hidden md:flex items-center gap-4 text-[10px] text-zinc-400 group-hover:text-zinc-500 transition-colors">
                                                <span>{pr.user.login}</span>
                                                <span className="font-mono opacity-50">{new Date(pr.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </section>
                    </TabsContent>

                    {/* Contributors - Square Cards */}
                    <TabsContent value="contributors" className="animate-in fade-in duration-700 slide-in-from-bottom-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {stats?.contributors.map((c, i) => (
                                <motion.div
                                    key={c.username}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setSelectedContributor(c)}
                                    className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-6 flex flex-col items-center text-center hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                                >
                                    {/* Rank Badge - Top Right */}
                                    <div className={cn(
                                        "absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                        i === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500" :
                                            i === 1 ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400" :
                                                i === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500" :
                                                    "bg-zinc-50 dark:bg-zinc-900 text-zinc-500"
                                    )}>
                                        #{i + 1}
                                    </div>

                                    {/* Avatar Ring */}
                                    <div className="relative mb-4 mt-2">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                                        <img src={c.avatarUrl} className="size-20 rounded-full border-4 border-zinc-50 dark:border-[#0c0c0e] shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-105" />
                                        {c.isMaintainer && (
                                            <div className="absolute -bottom-1 -right-1 z-20 bg-blue-500 text-white text-[9px] font-bold p-1 rounded-full border-2 border-white dark:border-[#0c0c0e]" title="Maintainer">
                                                <Shield className="size-3" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Identity */}
                                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-blue-500 transition-colors">
                                        {c.username}
                                    </h4>
                                    <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-0.5 rounded-full font-medium mb-6">
                                        {c.totalPRs} Commits
                                    </span>

                                    {/* Mini Stats Grid */}
                                    <div className="grid grid-cols-2 w-full gap-2 mt-auto">
                                        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-2 flex flex-col items-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                            <span className="text-emerald-600 dark:text-emerald-500 font-bold text-sm tabular-nums">{c.mergedPRs}</span>
                                            <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Merged</span>
                                        </div>
                                        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-2 flex flex-col items-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                            <span className="text-blue-600 dark:text-blue-500 font-bold text-sm tabular-nums">{c.openPRs}</span>
                                            <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Open</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="health" className="animate-in fade-in duration-1000 slide-in-from-bottom-8">
                        <HealthAnalysis owner={owner} repo={repo} />
                    </TabsContent>

                    <TabsContent value="code" className="animate-in fade-in duration-1000 slide-in-from-bottom-8">
                        <CodeExplorer owner={owner} repo={repo} />
                    </TabsContent>
                </Tabs>

                {/* Profile Drawer */}
                <ContributorProfile
                    contributor={selectedContributor}
                    contributions={selectedContributorPRs}
                    isOpen={!!selectedContributor}
                    onClose={() => setSelectedContributor(null)}
                />
            </main>
        </div>
    );
}

function StatMinimal({ label, value, sub, delay, isStar }: { label: string, value: number, sub: string, delay: number, isStar?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8, ease: "easeOut" }}
            className="flex flex-col group cursor-default"
        >
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-3 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">{label}</span>
            <div className="text-4xl md:text-5xl font-light tracking-tighter text-zinc-900 dark:text-zinc-100 tabular-nums">
                <CountUp value={value} />
                {isStar && <span className="text-lg align-top ml-1 opacity-50">k</span>}
            </div>
            <span className="text-xs text-zinc-400 mt-2 font-light group-hover:text-zinc-500 transition-colors">{sub}</span>
        </motion.div>
    )
}

function CountUp({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => setDisplayValue(latest),
        });

        return () => controls.stop();
    }, [value]);

    return <>{Math.floor(displayValue).toLocaleString()}</>;
}
