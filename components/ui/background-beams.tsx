"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    const beamsRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = beamsRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const beams: { x: number; y: number; speed: number; opacity: number }[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const initBeams = () => {
            for (let i = 0; i < 20; i++) {
                beams.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speed: 0.5 + Math.random(),
                    opacity: Math.random() * 0.5,
                });
            }
        };

        const draw = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Grid
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            const gridSize = 50;

            // Vertical lines
            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }


            // Draw Moving Beams
            beams.forEach((beam) => {
                beam.y -= beam.speed;
                if (beam.y < -100) {
                    beam.y = canvas.height + 100;
                    beam.x = Math.random() * canvas.width;
                }

                const gradient = ctx.createLinearGradient(beam.x, beam.y, beam.x, beam.y + 200);
                gradient.addColorStop(0, `rgba(100, 100, 255, 0)`);
                gradient.addColorStop(0.5, `rgba(100, 100, 255, ${beam.opacity * 0.5})`);
                gradient.addColorStop(1, `rgba(100, 100, 255, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(beam.x - 1, beam.y, 2, 200);
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        resize();
        initBeams();
        draw();
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={beamsRef}
            className={cn("fixed inset-0 z-0 pointer-events-none opacity-40", className)}
        />
    );
};
