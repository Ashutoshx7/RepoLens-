"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ArrowRight, Command, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden relative flex flex-col items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.03] pointer-events-none bg-dots" />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center">

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border border-border bg-background shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Intelligence active</span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-medium tracking-tight text-foreground leading-[1.1]">
            Repository <span className="text-muted-foreground italic font-light">Intelligence</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-sans font-normal tracking-tight max-w-lg mx-auto leading-relaxed opacity-60">
            Insights, velocity, and health scores for your engineering team.
          </p>
        </motion.div>

        {/* Search Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full max-w-xl relative group mx-auto mb-16"
        >
          <form
            onSubmit={handleAnalyze}
            className="relative flex items-center bg-background border border-border rounded-xl p-1 transition-all duration-300 focus-within:border-foreground/20 focus-within:ring-[3px] focus-within:ring-foreground/5 shadow-sm"
          >
            <div className="pl-4 pr-2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
              <Search className="size-5" />
            </div>

            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="github.com/owner/repository"
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-base h-10 text-foreground placeholder:text-muted-foreground/40 font-sans"
              autoFocus
              spellCheck={false}
            />

            <AnimatePresence>
              {url.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9, x: 5 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 5 }}
                  type="submit"
                  disabled={isLoading}
                  className="mr-1 h-10 px-4 flex items-center gap-2 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="size-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Analyze</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {!url && (
              <div className="mr-4 hidden sm:flex items-center gap-1.5 opacity-20 pointer-events-none border border-border px-1.5 py-0.5 rounded text-[10px] font-mono">
                <Command className="size-3" />
                <span>K</span>
              </div>
            )}
          </form>
        </motion.div>

        {/* Quick Links / Examples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/30 font-bold mr-2">Try Privateer</span>
          {exampleRepos.map((repo) => (
            <button
              key={repo.name}
              onClick={() => handleQuickAnalyze(repo.name)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground/60 bg-muted/30 border border-transparent hover:border-border hover:bg-muted/50 hover:text-foreground transition-all duration-300"
            >
              {repo.name}
            </button>
          ))}
        </motion.div>

      </main>

      {/* Subtle Footer */}
      <footer className="absolute bottom-10 left-0 right-0 text-center opacity-20 hover:opacity-40 transition-opacity">
        <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
          Built for the next generation of engineers
        </p>
      </footer>
    </div>
  );
}
