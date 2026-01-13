"use client";

import { useState, useEffect, useMemo } from "react";
import { FileNode } from "@/lib/types";
import { fetchRepoContents, fetchFileContent } from "@/lib/github-content";
import { cn } from "@/lib/utils";
import {
    Folder, FileCode, ChevronRight, ChevronDown,
    Loader2, GitBranch, File, Copy,
    FileJson, FileType, FileImage, FileText, X, Search, MoreHorizontal,
    Files, GitGraph, Settings, Terminal, Play, LayoutPanelLeft, Maximize2, Command, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CodeExplorerProps {
    owner: string;
    repo: string;
}

// Simple syntax highlighter for visual flair without heavy deps
const highlightCode = (code: string, language: string) => {
    if (!code) return [];

    // Basic keywords
    const keywords = /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|async|await|try|catch|new|this|typeof|void)\b/g;
    // Strings
    const strings = /(['"`])(.*?)\1/g;
    // Comments
    const comments = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
    // Numbers
    const numbers = /\b(\d+)\b/g;
    // JSX Tags (rough approximation)
    const jsxTags = /(<\/?)([a-zA-Z0-9]+)(.*?>)/g;

    // Split by newlines to handle per-line rendering
    return code.split('\n').map((line, i) => {
        let formatted = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        if (language === 'ts' || language === 'js' || language === 'tsx' || language === 'jsx') {
            // We can't actually safely replace with HTML strings in a single pass due to overlapping matches
            // So we'll just do a very basic pass for keywords and comments for the "vibe"
            // Ideally we'd use Prism, but for a lightweight "vibe" component:

            // Highlights keywords
            formatted = formatted.replace(keywords, '<span class="text-purple-400 font-bold">$1</span>');
            // Highlights strings (this is fragile in regex but okay for display)
            formatted = formatted.replace(strings, '<span class="text-green-400">$1$2$1</span>');
            // Highlights comments
            formatted = formatted.replace(comments, '<span class="text-zinc-500 italic">$1</span>');
            // Highlights types (capitalized words)
            formatted = formatted.replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="text-yellow-300">$1</span>');
        }

        return <div key={i} dangerouslySetInnerHTML={{ __html: formatted || ' ' }} />;
    });
};

export default function CodeExplorer({ owner, repo }: CodeExplorerProps) {
    const [currentPath, setCurrentPath] = useState<string>("");
    const [files, setFiles] = useState<FileNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [loadingContent, setLoadingContent] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(260);
    const [activeSideTab, setActiveSideTab] = useState("explorer");
    const [terminalOpen, setTerminalOpen] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        loadPath("");
    }, [owner, repo]);

    const loadPath = async (path: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchRepoContents(owner, repo, path);
            if (!data || data.length === 0) {
                // If root and empty, it's an error usually
                if (!path) setError("No files found. Is the repository empty or private?");
            }
            setFiles(data || []);
        } catch (error: any) {
            console.error("Failed to load path:", error);
            setError(error.message || "Failed to load directory.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileClick = async (file: FileNode) => {
        if (file.type === "directory") {
            loadPath(file.path);
            setCurrentPath(file.path);
        } else {
            setSelectedFile(file);
            setLoadingContent(true);
            try {
                const content = await fetchFileContent(owner, repo, file.path);
                setFileContent(content);
            } catch (error) {
                console.error("Failed to load content:", error);
                setFileContent("// Failed to load file content.");
            } finally {
                setLoadingContent(false);
            }
        }
    };

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'ts': case 'tsx': return <FileCode className="size-4 text-blue-400" />;
            case 'js': case 'jsx': return <FileCode className="size-4 text-yellow-400" />;
            case 'css': case 'scss': return <FileType className="size-4 text-sky-400" />;
            case 'json': return <FileJson className="size-4 text-yellow-500" />;
            case 'md': return <FileText className="size-4 text-purple-400" />;
            case 'png': case 'jpg': case 'svg': return <FileImage className="size-4 text-green-400" />;
            case 'gitignore': return <FileCode className="size-4 text-orange-400" />;
            default: return <File className="size-4 text-zinc-500" />;
        }
    };

    const highlightedContent = useMemo(() => {
        if (!fileContent || !selectedFile) return [];
        const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
        return highlightCode(fileContent, ext);
    }, [fileContent, selectedFile]);

    return (
        <div className="h-[800px] border border-zinc-800 rounded-xl overflow-hidden flex flex-col bg-[#1e1e1e] text-zinc-300 shadow-2xl ring-1 ring-white/10 font-sans relative selection:bg-blue-500/30">

            {/* Top Bar (Title Bar) */}
            <div className="h-10 border-b border-[#2b2b2b] flex items-center justify-between px-4 bg-[#252526]">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="size-3 rounded-full bg-[#ff5f56]" />
                        <div className="size-3 rounded-full bg-[#ffbd2e]" />
                        <div className="size-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center gap-2">
                        <span className="font-medium text-zinc-300">{owner} / {repo}</span>
                        <span className="opacity-50">—</span>
                        <span>Code Space</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#3e3e3e] rounded px-2 py-1 text-xs text-zinc-400 min-w-[200px] justify-center cursor-pointer hover:border-zinc-500">
                    <Search className="size-3 mr-2" />
                    <span>Search {repo}</span>
                    <span className="ml-auto text-[10px] bg-[#333] px-1 rounded">⌘P</span>
                </div>

                <div className="flex items-center gap-3">
                    <LayoutPanelLeft className="size-4 text-zinc-400 hover:text-zinc-200 cursor-pointer" />
                    <Maximize2 className="size-4 text-zinc-400 hover:text-zinc-200 cursor-pointer" />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Activity Bar */}
                <div className="w-12 border-r border-[#2b2b2b] bg-[#333333] flex flex-col items-center py-2 gap-4 text-zinc-400">
                    <div
                        className={cn("p-2 rounded cursor-pointer transition-colors", activeSideTab === "explorer" ? "text-white border-l-2 border-white bg-[#2b2b2b]" : "hover:text-zinc-200")}
                        onClick={() => setActiveSideTab("explorer")}
                    >
                        <Files className="size-6" />
                    </div>
                    <div className="p-2 cursor-pointer hover:text-zinc-200"><Search className="size-6" /></div>
                    <div className="p-2 cursor-pointer hover:text-zinc-200"><GitGraph className="size-6" /></div>
                    <div className="mt-auto p-2 cursor-pointer hover:text-zinc-200"><Settings className="size-6" /></div>
                </div>

                {/* Sidebar (Explorer) */}
                {activeSideTab === "explorer" && (
                    <div
                        className="border-r border-[#2b2b2b] flex flex-col bg-[#252526]"
                        style={{ width: sidebarWidth }}
                    >
                        <div className="h-9 flex items-center px-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500 select-none justify-between">
                            <span>Explorer</span>
                            <MoreHorizontal className="size-4 cursor-pointer hover:text-zinc-300" />
                        </div>

                        {/* Repository Root Item */}
                        <div
                            className="px-2 py-1 flex items-center gap-1.5 text-xs font-bold text-blue-400 cursor-pointer hover:bg-[#2a2d2e] select-none"
                            onClick={() => { loadPath(""); setCurrentPath(""); }}
                        >
                            <ChevronDown className="size-3" />
                            <span className="uppercase">{repo}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto px-0 pb-2 custom-scrollbar">
                            {loading && !currentPath ? (
                                <div className="space-y-2 p-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-4 bg-[#333] rounded animate-pulse w-2/3" />)}
                                </div>
                            ) : error ? (
                                <div className="p-4 flex flex-col items-center text-center">
                                    <AlertCircle className="size-6 text-red-400 mb-2" />
                                    <span className="text-xs text-red-300">{error}</span>
                                    <button onClick={() => loadPath("")} className="mt-4 text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded hover:bg-red-500/20">Retry</button>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {/* Back Item */}
                                    {currentPath && (
                                        <div
                                            className="pl-6 px-2 py-1 flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-[#2a2d2e] cursor-pointer"
                                            onClick={() => {
                                                const parts = currentPath.split('/');
                                                parts.pop();
                                                const up = parts.join('/');
                                                loadPath(up);
                                                setCurrentPath(up);
                                            }}
                                        >
                                            <div className="size-4 flex items-center justify-center">..</div>
                                        </div>
                                    )}

                                    {files.map((file) => (
                                        <div
                                            key={file.path}
                                            onClick={() => handleFileClick(file)}
                                            className={cn(
                                                "pl-4 px-2 py-1 flex items-center gap-1.5 cursor-pointer hover:bg-[#2a2d2e] border-l-2 border-transparent transition-colors group select-none relative text-xs",
                                                selectedFile?.path === file.path && "bg-[#37373d] text-white border-blue-400"
                                            )}
                                        >
                                            {file.type === 'directory' ? (
                                                <>
                                                    <ChevronRight className="size-3 text-zinc-500 shrink-0" />
                                                    <Folder className="size-4 text-zinc-400 group-hover:text-white shrink-0" />
                                                </>
                                            ) : (
                                                <span className="ml-[18px] flex items-center gap-2 shrink-0">
                                                    {getFileIcon(file.name)}
                                                </span>
                                            )}
                                            <span className={cn(
                                                "truncate text-zinc-400 group-hover:text-zinc-200",
                                                selectedFile?.path === file.path && "text-white"
                                            )}>{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Editor Area */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
                    {/* Editor Tabs */}
                    <div className="h-9 border-b border-[#2b2b2b] flex items-center bg-[#252526] overflow-x-auto no-scrollbar">
                        {selectedFile ? (
                            <div className="h-full px-3 flex items-center gap-2 bg-[#1e1e1e] border-r border-[#2b2b2b] border-t-2 border-t-blue-500 min-w-[140px] max-w-[200px] group relative text-xs text-zinc-300 select-none">
                                {getFileIcon(selectedFile.name)}
                                <span className="font-medium truncate">{selectedFile.name}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                    className="ml-auto opacity-0 group-hover:opacity-100 hover:bg-[#333] rounded p-0.5"
                                >
                                    <X className="size-3 text-zinc-400" />
                                </button>
                            </div>
                        ) : (
                            <div className="px-4 text-xs italic text-zinc-500">Welcome to Git-Nexus Code Space</div>
                        )}
                    </div>

                    {/* Code Content */}
                    <div className="flex-1 overflow-hidden relative">
                        {selectedFile ? (
                            loadingContent ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="size-8 text-blue-500 animate-spin" />
                                    <span className="text-xs text-zinc-500">Fetching content...</span>
                                </div>
                            ) : (
                                <div className="h-full flex overflow-hidden">
                                    {/* Line Numbers */}
                                    <div className="w-12 bg-[#1e1e1e] text-right py-4 pr-3 select-none flex-shrink-0 border-r border-[#2b2b2b]">
                                        {fileContent?.split('\n').map((_, i) => (
                                            <div key={i} className="text-xs font-mono text-[#6e7681] leading-6">{i + 1}</div>
                                        ))}
                                    </div>
                                    {/* Code */}
                                    <div className="flex-1 overflow-auto custom-scrollbar bg-[#1e1e1e]">
                                        <div className="p-4 min-w-max font-mono text-xs leading-6 text-zinc-300 tab-4">
                                            {highlightedContent}
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-50 select-none">
                                <div className="size-32 rounded-full bg-[#252526] flex items-center justify-center mb-6">
                                    <Command className="size-12 text-[#333]" />
                                </div>
                                <span className="text-sm font-medium text-zinc-500">Select a file to begin editing</span>
                                <div className="flex gap-4 mt-6 text-xs">
                                    <span className="flex items-center gap-1"><Search className="size-3" /> Find File</span>
                                    <span className="flex items-center gap-1"><Terminal className="size-3" /> Toggle Terminal</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Terminal Panel */}
                    <AnimatePresence>
                        {terminalOpen && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 160 }}
                                exit={{ height: 0 }}
                                className="border-t border-[#2b2b2b] bg-[#1e1e1e] flex flex-col"
                            >
                                <div className="flex items-center px-4 h-8 border-b border-[#2b2b2b] gap-6 text-[10px] uppercase font-bold text-zinc-500 select-none">
                                    <span className="text-white border-b border-white h-full flex items-center cursor-pointer">Problems</span>
                                    <span className="hover:text-zinc-300 cursor-pointer">Output</span>
                                    <span className="hover:text-zinc-300 cursor-pointer">Terminal</span>
                                    <span className="hover:text-zinc-300 cursor-pointer">Debug Console</span>
                                    <div className="ml-auto flex items-center gap-2">
                                        <X className="size-3 cursor-pointer hover:text-white" onClick={() => setTerminalOpen(false)} />
                                    </div>
                                </div>
                                <div className="flex-1 p-2 font-mono text-xs text-zinc-400 overflow-auto">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <span className="text-zinc-600">➜</span>
                                        <span>Building project...</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-400">
                                        <span className="text-zinc-600">➜</span>
                                        <span>Compiled successfully in 1.2s</span>
                                    </div>
                                    <div className="mt-1 text-zinc-500">
                                        [Ready] Waiting for changes...
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#007acc] flex items-center px-3 justify-between text-[10px] text-white font-medium select-none z-10">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 hover:bg-white/10 px-1 rounded cursor-pointer"><GitBranch className="size-3" /> main*</span>
                    <span className="hover:bg-white/10 px-1 rounded cursor-pointer flex items-center gap-1"><X className="size-3 rounded-full bg-red-400/20 text-red-200 p-0.5" /> 0</span>
                    <span className="hover:bg-white/10 px-1 rounded cursor-pointer flex items-center gap-1"><Terminal className="size-3" /> 0</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="hover:bg-white/10 px-1 rounded cursor-pointer" onClick={() => setTerminalOpen(!terminalOpen)}>Ln 12, Col 45</span>
                    <span className="hover:bg-white/10 px-1 rounded cursor-pointer">UTF-8</span>
                    <span className="hover:bg-white/10 px-1 rounded cursor-pointer">{selectedFile ? 'TypeScript' : 'Plain Text'}</span>
                    <span className="hover:bg-white/10 px-1 rounded cursor-pointer"><Settings className="size-3" /></span>
                </div>
            </div>
        </div>
    );
}
