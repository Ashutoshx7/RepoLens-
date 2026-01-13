"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ArrowRight, Command, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const exampleRepos = [
  { name: "facebook/react", stars: "220K" },
  { name: "vercel/next.js", stars: "118K" },
  { name: "shadcn/ui", stars: "45K" },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);

    try {
      const cleanUrl = url
        .replace("https://github.com/", "")
        .replace("github.com/", "")
        .replace(/\/$/, "");
      const parts = cleanUrl.split("/");

      if (parts.length >= 2) {
        router.push(`/dashboard/${parts[0]}/${parts[1]}`);
      } else {
        alert("Please enter a valid repository URL (e.g., owner/repo)");
        setIsLoading(false);
      }
    } catch (err) {
      alert("Invalid URL format");
      setIsLoading(false);
    }
  };

  const handleQuickAnalyze = (repo: string) => {
    setUrl(`https://github.com/${repo}`);
    router.push(`/dashboard/${repo}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden relative flex flex-col items-center justify-center p-6">
      {/* Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none bg-noise" />

      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">System Online</span>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 mb-16"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-medium tracking-tight text-white leading-[0.9]">
            Repository <br />
            <span className="italic opacity-50 font-heading text-zinc-500">Intelligence</span>.
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-sans font-light tracking-wide max-w-lg mx-auto leading-relaxed">
            The definitive analytics suite for engineering leadership. <br className="hidden md:block" />
            Insights, velocity, and health scores in one view.
          </p>
        </motion.div>

        {/* Glass Box Input */}
        <motion.form
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          onSubmit={handleAnalyze}
          className="w-full max-w-md relative group mx-auto mb-20"
        >
          {/* Glow backing */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />

          <div className="relative flex items-center bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-800 rounded-xl p-2 transition-all duration-300 group-hover:border-zinc-700 group-focus-within:border-zinc-600 group-focus-within:ring-1 group-focus-within:ring-zinc-700/50 shadow-2xl">
            <div className="pl-3 pr-2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors">
              <Search className="size-5" />
            </div>

            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="github.com/owner/repository"
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-base h-11 text-zinc-200 placeholder:text-zinc-700 font-sans tracking-wide"
              autoFocus
              spellCheck={false}
            />

            <AnimatePresence>
              {(url.length > 0) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="submit"
                  disabled={isLoading}
                  className="mr-1 size-9 flex items-center justify-center rounded-lg bg-white text-black hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
                >
                  {isLoading ? (
                    <div className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="size-4" />
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {!url && (
              <div className="mr-3 hidden sm:flex items-center gap-1 opacity-20 pointer-events-none">
                <Command className="size-3" />
                <span className="text-xs font-mono">K</span>
              </div>
            )}
          </div>
        </motion.form>

        {/* Footer Links - Now Relative */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="flex flex-wrap items-center justify-center gap-8 text-[11px] uppercase tracking-widest text-zinc-600 font-sans font-medium"
        >
          {exampleRepos.map((repo) => (
            <button
              key={repo.name}
              onClick={() => handleQuickAnalyze(repo.name)}
              className="hover:text-zinc-300 transition-colors border-b border-transparent hover:border-zinc-700 pb-0.5"
            >
              {repo.name}
            </button>
          ))}
        </motion.div>

      </main>
    </div>
  );
}
