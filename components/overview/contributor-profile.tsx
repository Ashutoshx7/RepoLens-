"use client";

import { ContributorStats, PullRequest } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatNumber, cn } from "@/lib/utils";
import {
    GitPullRequest, CheckCircle2, XCircle, Calendar,
    ExternalLink, Trophy, Star, GitMerge, Clock, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContributorProfileProps {
    contributor: ContributorStats | null;
    contributions: PullRequest[];
    isOpen: boolean;
    onClose: () => void;
}

export function ContributorProfile({ contributor, contributions, isOpen, onClose }: ContributorProfileProps) {
    if (!contributor) return null;

    // Calculate efficiency metrics
    const mergeRate = Math.round((contributor.mergedPRs / (contributor.totalPRs || 1)) * 100);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-zinc-900/40 backdrop-blur-[2px] z-[100]"
                    />

                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-[#09090b] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-[101] overflow-y-auto"
                    >
                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-6">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="relative group cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                                        <img
                                            src={contributor.avatarUrl}
                                            alt={contributor.username}
                                            className="size-24 rounded-full border-4 border-white dark:border-black shadow-lg relative z-10"
                                        />
                                        {contributor.isMaintainer && (
                                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full ring-4 ring-white dark:ring-black z-20">
                                                <ShieldIcon className="size-4" />
                                            </div>
                                        )}
                                    </motion.div>

                                    <div>
                                        <motion.h2
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-3xl font-bold text-zinc-900 dark:text-zinc-50"
                                        >
                                            {contributor.username}
                                        </motion.h2>

                                        <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.15 }}
                                            className="flex items-center gap-3 mt-2"
                                        >
                                            <span className="flex items-center gap-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-full text-zinc-600 dark:text-zinc-400">
                                                <Trophy className="size-3 text-amber-500" />
                                                Top Contributor
                                            </span>
                                            <a
                                                href={`https://github.com/${contributor.username}`}
                                                target="_blank"
                                                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
                                            >
                                                github.com/{contributor.username} <ArrowRight className="size-3" />
                                            </a>
                                        </motion.div>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <XIcon className="size-5 text-zinc-500" />
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                                <StatBox
                                    icon={GitDirectionIcon}
                                    label="Total PRs"
                                    value={contributor.totalPRs}
                                    delay={0.2}
                                />
                                <StatBox
                                    icon={GitMerge}
                                    label="Merged"
                                    value={contributor.mergedPRs}
                                    color="text-purple-600 dark:text-purple-400"
                                    bg="bg-purple-50 dark:bg-purple-500/10"
                                    delay={0.25}
                                />
                                <StatBox
                                    icon={GitPullRequest}
                                    label="Open"
                                    value={contributor.openPRs}
                                    color="text-green-600 dark:text-green-400"
                                    bg="bg-green-50 dark:bg-green-500/10"
                                    delay={0.3}
                                />
                                <StatBox
                                    icon={ActivityIcon}
                                    label="Efficiency"
                                    value={`${mergeRate}%`}
                                    color="text-blue-600 dark:text-blue-400"
                                    bg="bg-blue-50 dark:bg-blue-500/10"
                                    delay={0.35}
                                />
                            </div>

                            {/* Activity Timeline */}
                            <div className="relative">
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                                    <Clock className="size-4 text-zinc-500" />
                                    Recent Activity
                                </h3>

                                <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-zinc-100 dark:bg-zinc-800" />

                                <div className="space-y-6">
                                    {contributions.length > 0 ? (
                                        contributions.map((pr, i) => (
                                            <motion.div
                                                key={pr.number}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + (i * 0.05) }}
                                                className="relative pl-10 group"
                                            >
                                                {/* Timeline Connector */}
                                                <div className={cn(
                                                    "absolute left-3.5 top-2.5 size-3 rounded-full border-[3px] border-white dark:border-[#09090b] z-10 box-content transition-colors duration-300",
                                                    pr.state === 'open'
                                                        ? "bg-green-500 group-hover:scale-125"
                                                        : "bg-purple-500 group-hover:scale-125"
                                                )} />

                                                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow-md">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="min-w-0 flex-1">
                                                            <a
                                                                href={pr.html_url}
                                                                target="_blank"
                                                                className="block font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                                                            >
                                                                {pr.title}
                                                            </a>
                                                            <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-500">
                                                                <span className="font-mono">#{pr.number}</span>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="size-3" />
                                                                    {new Date(pr.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <span className={cn(
                                                            "text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0",
                                                            pr.state === 'open'
                                                                ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                                                : "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
                                                        )}>
                                                            {pr.merged_at ? "Merged" : pr.state}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="pl-10 py-8 text-zinc-400 text-sm italic"
                                        >
                                            No recent activity found.
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function StatBox({ icon: Icon, label, value, color, bg, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay || 0 }}
            className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col items-start gap-3 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
        >
            <div className={cn("p-2 rounded-lg", bg || "bg-zinc-100 dark:bg-zinc-800")}>
                <Icon className={cn("size-4", color || "text-zinc-900 dark:text-zinc-100")} />
            </div>
            <div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-1">
                    {value}
                </div>
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    {label}
                </div>
            </div>
        </motion.div>
    );
}

// Icons
function ShieldIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg> }
function XIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg> }
function GitDirectionIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M6 9v6" /></svg> }
function ActivityIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg> }
