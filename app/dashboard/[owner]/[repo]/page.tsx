import { fetchRepoMetadata } from "@/lib/github-server";
import DashboardClient from "./client";
import { TokenManager } from "@/components/common/token-manager";

export default async function Dashboard({
    params,
}: {
    params: Promise<{ owner: string; repo: string }>;
}) {
    const { owner, repo } = await params;

    // We can fetch initial metadata on the server to ensure the repo exists and for SEO
    let metadata;
    try {
        metadata = await fetchRepoMetadata(owner, repo);
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-destructive">Repository Access Failed</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Could not access <span className="font-mono text-foreground">{owner}/{repo}</span>
                    </p>
                    <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm font-mono mt-4">
                        {errorMessage}
                    </div>
                </div>

                <div className="flex flex-col gap-4 items-center w-full max-w-sm">
                    <p className="text-sm text-muted-foreground text-center">
                        If this is a private repository or you are hitting rate limits,
                        you may need to configure a GitHub Token.
                    </p>
                    <TokenManager />

                    <a href="/" className="text-primary hover:underline underline-offset-4 mt-4">
                        Return Home
                    </a>
                </div>
            </div>
        );
    }

    return <DashboardClient metadata={metadata} owner={owner} repo={repo} />;
}
