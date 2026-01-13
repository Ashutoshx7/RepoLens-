"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FileNode } from "@/lib/types";
import { fetchRepoContents, fetchFileContent } from "@/lib/github-content";
import { cn, getGitHubToken } from "@/lib/utils";
import {
    Folder, FolderOpen, FileCode, ChevronRight, ChevronDown,
    Loader2, GitBranch, File, Copy, Check,
    FileJson, FileType, FileImage, FileText, X, Search, MoreHorizontal,
    Files, GitGraph, Settings, Terminal, Play, LayoutPanelLeft, Maximize2, Command, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";

interface CodeExplorerProps {
    owner: string;
    repo: string;
}

// Extended FileNode with children for tree structure
interface TreeNode extends FileNode {
    children?: TreeNode[];
    isLoading?: boolean;
    isLoaded?: boolean;
}

// Map file extensions to Prism language names
const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const languageMap: Record<string, string> = {
        ts: 'typescript',
        tsx: 'tsx',
        js: 'javascript',
        jsx: 'jsx',
        json: 'json',
        css: 'css',
        scss: 'scss',
        html: 'markup',
        xml: 'markup',
        svg: 'markup',
        md: 'markdown',
        mdx: 'markdown',
        py: 'python',
        rb: 'ruby',
        go: 'go',
        rs: 'rust',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        h: 'c',
        hpp: 'cpp',
        cs: 'csharp',
        php: 'php',
        sh: 'bash',
        bash: 'bash',
        zsh: 'bash',
        yml: 'yaml',
        yaml: 'yaml',
        sql: 'sql',
        graphql: 'graphql',
        gql: 'graphql',
        dockerfile: 'docker',
        makefile: 'makefile',
        gitignore: 'git',
        env: 'bash',
    };
    return languageMap[ext] || 'plaintext';
};

// Recursive Tree Item Component
function TreeItem({
    node,
    depth,
    expandedPaths,
    onToggle,
    onFileClick,
    selectedPath,
    getFileIcon,
}: {
    node: TreeNode;
    depth: number;
    expandedPaths: Set<string>;
    onToggle: (path: string) => void;
    onFileClick: (file: TreeNode) => void;
    selectedPath: string | null;
    getFileIcon: (filename: string) => React.ReactElement;
}) {
    const isExpanded = expandedPaths.has(node.path);
    const isDirectory = node.type === "directory";
    const isSelected = selectedPath === node.path;
    const paddingLeft = 12 + depth * 12;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                onClick={() => isDirectory ? onToggle(node.path) : onFileClick(node)}
                className={cn(
                    "flex items-center gap-1 py-[3px] cursor-pointer hover:bg-[#2a2d2e] border-l-2 border-transparent transition-all group select-none text-[13px]",
                    isSelected && "bg-[#37373d] text-white border-blue-500"
                )}
                style={{ paddingLeft }}
            >
                {isDirectory ? (
                    <>
                        <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.15 }}
                            className="shrink-0"
                        >
                            <ChevronRight className="size-3 text-zinc-500" />
                        </motion.div>
                        {isExpanded ? (
                            <FolderOpen className="size-4 text-yellow-500/80 shrink-0" />
                        ) : (
                            <Folder className="size-4 text-yellow-500/60 shrink-0" />
                        )}
                    </>
                ) : (
                    <span className="ml-[14px] flex items-center shrink-0">
                        {getFileIcon(node.name)}
                    </span>
                )}
                <span className={cn(
                    "truncate ml-1",
                    isDirectory ? "text-zinc-300" : "text-zinc-400 group-hover:text-zinc-200",
                    isSelected && "text-white"
                )}>
                    {node.name}
                </span>
                {node.isLoading && (
                    <Loader2 className="size-3 text-zinc-500 animate-spin ml-auto mr-2" />
                )}
            </motion.div>

            {/* Render children if expanded */}
            <AnimatePresence>
                {isDirectory && isExpanded && node.children && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                    >
                        {node.children.map((child) => (
                            <TreeItem
                                key={child.path}
                                node={child}
                                depth={depth + 1}
                                expandedPaths={expandedPaths}
                                onToggle={onToggle}
                                onFileClick={onFileClick}
                                selectedPath={selectedPath}
                                getFileIcon={getFileIcon}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default function CodeExplorer({ owner, repo }: CodeExplorerProps) {
    const [tree, setTree] = useState<TreeNode[]>([]);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [loadingContent, setLoadingContent] = useState(false);
    const [sidebarWidth] = useState(280);
    const [activeSideTab, setActiveSideTab] = useState("explorer");
    const [terminalOpen, setTerminalOpen] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load root directory on mount
    useEffect(() => {
        loadRootDirectory();
    }, [owner, repo]);

    const loadRootDirectory = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = getGitHubToken();
            const data = await fetchRepoContents(owner, repo, "", token);
            if (!data || data.length === 0) {
                setError("No files found. Is the repository empty or private?");
            }
            // Convert to tree nodes
            const treeNodes: TreeNode[] = (data || []).map(item => ({
                ...item,
                children: item.type === "directory" ? undefined : undefined,
                isLoading: false,
                isLoaded: false,
            }));
            setTree(treeNodes);
        } catch (error: any) {
            console.error("Failed to load root:", error);
            setError(error.message || "Failed to load repository.");
        } finally {
            setLoading(false);
        }
    };

    // Load children for a directory
    const loadDirectoryChildren = useCallback(async (path: string) => {
        const token = getGitHubToken();

        // Mark node as loading
        setTree(prev => updateNodeInTree(prev, path, { isLoading: true }));

        try {
            const data = await fetchRepoContents(owner, repo, path, token);
            const children: TreeNode[] = (data || []).map(item => ({
                ...item,
                children: item.type === "directory" ? undefined : undefined,
                isLoading: false,
                isLoaded: false,
            }));

            // Update tree with children
            setTree(prev => updateNodeInTree(prev, path, {
                children,
                isLoading: false,
                isLoaded: true,
            }));
        } catch (error) {
            console.error("Failed to load directory:", error);
            setTree(prev => updateNodeInTree(prev, path, { isLoading: false }));
        }
    }, [owner, repo]);

    // Helper to update a node in the tree
    const updateNodeInTree = (nodes: TreeNode[], path: string, updates: Partial<TreeNode>): TreeNode[] => {
        return nodes.map(node => {
            if (node.path === path) {
                return { ...node, ...updates };
            }
            if (node.children) {
                return { ...node, children: updateNodeInTree(node.children, path, updates) };
            }
            return node;
        });
    };

    // Find node in tree
    const findNodeInTree = (nodes: TreeNode[], path: string): TreeNode | null => {
        for (const node of nodes) {
            if (node.path === path) return node;
            if (node.children) {
                const found = findNodeInTree(node.children, path);
                if (found) return found;
            }
        }
        return null;
    };

    // Toggle directory expand/collapse
    const handleToggle = useCallback(async (path: string) => {
        const node = findNodeInTree(tree, path);
        if (!node || node.type !== "directory") return;

        const isCurrentlyExpanded = expandedPaths.has(path);

        if (isCurrentlyExpanded) {
            // Collapse
            setExpandedPaths(prev => {
                const next = new Set(prev);
                next.delete(path);
                return next;
            });
        } else {
            // Expand - load children if not loaded
            if (!node.isLoaded && !node.isLoading) {
                await loadDirectoryChildren(path);
            }
            setExpandedPaths(prev => new Set(prev).add(path));
        }
    }, [tree, expandedPaths, loadDirectoryChildren]);

    // Handle file click
    const handleFileClick = async (file: TreeNode) => {
        setSelectedFile(file);
        setLoadingContent(true);
        try {
            const token = getGitHubToken();
            const content = await fetchFileContent(owner, repo, file.path, token);
            setFileContent(content);
        } catch (error) {
            console.error("Failed to load content:", error);
            setFileContent("// Failed to load file content.");
        } finally {
            setLoadingContent(false);
        }
    };

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        const name = filename.toLowerCase();

        // Special files
        if (name === 'package.json') return <FileJson className="size-4 text-green-500" />;
        if (name === 'tsconfig.json') return <FileJson className="size-4 text-blue-400" />;
        if (name.includes('readme')) return <FileText className="size-4 text-blue-300" />;
        if (name.startsWith('.git')) return <FileCode className="size-4 text-orange-400" />;
        if (name.startsWith('.env')) return <FileCode className="size-4 text-yellow-600" />;

        switch (ext) {
            case 'ts': return <FileCode className="size-4 text-blue-400" />;
            case 'tsx': return <FileCode className="size-4 text-blue-500" />;
            case 'js': return <FileCode className="size-4 text-yellow-400" />;
            case 'jsx': return <FileCode className="size-4 text-yellow-500" />;
            case 'css': case 'scss': case 'sass': return <FileType className="size-4 text-pink-400" />;
            case 'json': return <FileJson className="size-4 text-yellow-500" />;
            case 'md': case 'mdx': return <FileText className="size-4 text-blue-300" />;
            case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': case 'ico':
                return <FileImage className="size-4 text-purple-400" />;
            case 'html': return <FileCode className="size-4 text-orange-500" />;
            case 'yml': case 'yaml': return <FileCode className="size-4 text-red-400" />;
            case 'lock': return <File className="size-4 text-zinc-600" />;
            default: return <File className="size-4 text-zinc-500" />;
        }
    };

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

                        {/* Repository Root Header */}
                        <div
                            className="px-2 py-1.5 flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 cursor-pointer hover:bg-[#2a2d2e] select-none border-b border-[#2b2b2b]"
                            onClick={() => { setExpandedPaths(new Set()); loadRootDirectory(); }}
                        >
                            <ChevronDown className="size-3" />
                            <span className="uppercase tracking-wide">{repo}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto pb-2 custom-scrollbar">
                            {loading ? (
                                <div className="space-y-1.5 p-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-4 bg-[#333] rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="p-4 flex flex-col items-center text-center">
                                    <AlertCircle className="size-6 text-red-400 mb-2" />
                                    <span className="text-xs text-red-300">{error}</span>
                                    <button onClick={loadRootDirectory} className="mt-4 text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded hover:bg-red-500/20">Retry</button>
                                </div>
                            ) : (
                                <div className="pt-1">
                                    {tree.map((node) => (
                                        <TreeItem
                                            key={node.path}
                                            node={node}
                                            depth={0}
                                            expandedPaths={expandedPaths}
                                            onToggle={handleToggle}
                                            onFileClick={handleFileClick}
                                            selectedPath={selectedFile?.path || null}
                                            getFileIcon={getFileIcon}
                                        />
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
                                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setFileContent(null); }}
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
                                <div className="h-full overflow-auto custom-scrollbar bg-[#1e1e1e]">
                                    {fileContent && (
                                        <Highlight
                                            theme={themes.vsDark}
                                            code={fileContent}
                                            language={getLanguageFromExtension(selectedFile.name)}
                                        >
                                            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                                <pre
                                                    className="font-mono text-[13px] leading-6 p-0 m-0"
                                                    style={{ ...style, background: 'transparent', minWidth: 'max-content' }}
                                                >
                                                    {tokens.map((line, i) => {
                                                        const lineProps = getLineProps({ line });
                                                        return (
                                                            <div
                                                                key={i}
                                                                {...lineProps}
                                                                className={cn(lineProps.className, "flex hover:bg-[#2a2d2e] transition-colors")}
                                                            >
                                                                {/* Line Number */}
                                                                <span className="w-14 shrink-0 text-right pr-4 text-[#6e7681] select-none border-r border-[#2b2b2b] mr-4">
                                                                    {i + 1}
                                                                </span>
                                                                {/* Line Content */}
                                                                <span className="flex-1">
                                                                    {line.map((token, key) => (
                                                                        <span key={key} {...getTokenProps({ token })} />
                                                                    ))}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </pre>
                                            )}
                                        </Highlight>
                                    )}
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
