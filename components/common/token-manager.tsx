"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie";
import { KeyRound } from "lucide-react";

export function TokenManager() {
    const [token, setToken] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const saveToken = () => {
        if (!token) return;
        // Set cookie for server access (expires in 7 days)
        Cookies.set("github_token", token, { expires: 7 });
        // Set localStorage for client access
        localStorage.setItem("github_pat", token); // Key from utils.ts TOKEN_STORAGE_KEY
        window.location.reload();
    };

    if (!isOpen) {
        return (
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                <KeyRound className="mr-2 size-4" /> Add GitHub Token
            </Button>
        );
    }

    return (
        <Card className="w-full max-w-sm mx-auto mt-4">
            <CardHeader>
                <CardTitle>Configure GitHub Token</CardTitle>
                <CardDescription>
                    Add a Personal Access Token to increase rate limits and access private repositories.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input
                    type="password"
                    placeholder="ghp_..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={saveToken}>Save & Reload</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Token is saved in browser cookies and sent to the server for API requests.
                </p>
            </CardContent>
        </Card>
    );
}
