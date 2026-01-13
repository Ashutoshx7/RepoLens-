"use server";

import { Octokit } from 'octokit';
import { createOctokit } from './github-client';
import type { FileNode } from './types';

// Simple in-memory cache (Note: Persists only in long-running processes like local dev)
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedOrFetch = async <T>(
    key: string,
    fetchFn: () => Promise<T>
): Promise<T> => {
    const now = Date.now();
    const cachedItem = cache[key];

    if (cachedItem && now - cachedItem.timestamp < CACHE_TTL) {
        return cachedItem.data as T;
    }

    const data = await fetchFn();
    cache[key] = { data, timestamp: now };
    return data;
};

export const fetchRepoContents = async (
    owner: string,
    repo: string,
    path: string = ''
): Promise<FileNode[]> => {
    const cacheKey = `contents_${owner}_${repo}_${path}`;

    return getCachedOrFetch(cacheKey, async () => {
        const octokit = createOctokit();

        try {
            const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner,
                repo,
                path,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            if (!Array.isArray(data)) {
                // It's a file, not a directory
                // If we somehow requested a file as a directory, wrap it
                return [{
                    name: data.name,
                    path: data.path,
                    type: "file",
                    size: data.size,
                    extension: data.name.split('.').pop()
                }];
            }

            return data.map((item: any) => ({
                name: item.name,
                path: item.path,
                type: (item.type === "dir" ? "directory" : "file") as "file" | "directory",
                size: item.size,
                extension: item.name.split('.').pop()
            })).sort((a, b) => {
                // Folders first
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === "directory" ? -1 : 1;
            });
        } catch (error) {
            console.error("Error fetching repository contents:", error);
            throw error;
        }
    });
};

export const fetchFileContent = async (
    owner: string,
    repo: string,
    path: string
): Promise<string> => {
    const cacheKey = `file_${owner}_${repo}_${path}`;

    return getCachedOrFetch(cacheKey, async () => {
        const octokit = createOctokit();

        try {
            const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner,
                repo,
                path,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                    'Accept': 'application/vnd.github.raw'
                }
            });

            return data as unknown as string;
        } catch (error) {
            console.error("Error fetching file content:", error);
            throw error;
        }
    });
};
