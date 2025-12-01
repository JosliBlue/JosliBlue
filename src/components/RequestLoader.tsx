import React, { useEffect, useState } from "react";

export const RequestLoader = () => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Resolving host...");

    useEffect(() => {
        const steps = [
            { p: 20, s: "Resolving host..." },
            { p: 45, s: "Connecting to server..." },
            { p: 70, s: "Sending request..." },
            { p: 90, s: "Waiting for response..." },
            { p: 100, s: "Done" },
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep >= steps.length) {
                clearInterval(interval);
                return;
            }
            const step = steps[currentStep];
            setStatus(step.s);
            setProgress(step.p);
            currentStep++;
        }, 150);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="py-8 px-4 w-full max-w-md mx-auto">
            <div className="flex justify-between text-xs font-mono text-text-secondary mb-2">
                <span>{status}</span>
                <span>{progress}%</span>
            </div>
            <div className="h-1 w-full bg-bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-accent transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="mt-2 flex gap-2 font-mono text-[10px] text-text-secondary/50">
                <span>GET</span>
                <span>HTTP/1.1</span>
            </div>
        </div>
    );
};
