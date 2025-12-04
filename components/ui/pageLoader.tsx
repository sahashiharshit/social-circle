"use client";

import { useEffect, useState } from "react";

const messages = [
    "Connecting you with your circle...",
    "Warming up your feed...",
    "Spinning the social threads...",
    "Preparing your dashboard...",
    "Fetching good vibes...",
    "Loading your experience...",
];

export default function PageLoader() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        // Pick a random message
        setMessage(messages[Math.floor(Math.random() * messages.length)]);

        // Fake a minimum loading duration for aesthetics
        const timer = setTimeout(() => {
            setLoading(false);
        }, 900); // smooth quick load

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!loading) {
            const fadeTimer = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(fadeTimer);
        }
    }, [loading]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-accent text-white animate-in fade-in duration-300">
            <div className="animate-spin h-14 w-14 rounded-full border-4 border-white border-t-transparent mb-4"></div>
            <p className="text-sm opacity-80">{message}</p>
        </div>
    );
}
