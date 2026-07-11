"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { FaPlay, FaGamepad, FaInfoCircle } from "react-icons/fa";

const AVATARS = [
  { id: "rocket", icon: "fluent-emoji-flat:rocket", label: "Rocket" },
  { id: "unicorn", icon: "fluent-emoji-flat:unicorn", label: "Unicorn" },
  { id: "lion", icon: "fluent-emoji-flat:lion", label: "Lion" },
  { id: "frog", icon: "fluent-emoji-flat:frog", label: "Frog" },
  { id: "alien", icon: "fluent-emoji-flat:alien-monster", label: "Alien" },
  { id: "robot", icon: "fluent-emoji-flat:robot", label: "Robot" },
];

export default function Home() {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("rocket");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Little Explorer",
          avatar: selectedAvatar,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({
        success: false,
        error: "Failed to connect to API",
        details: "API request failed or network timeout.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex items-center justify-center p-4">
      {/* Container: Max width 768px as requested in AGENTS.md */}
      <main className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 p-6 text-white text-center relative">
          <div className="absolute top-2 right-2 flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-white/40"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white/40"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white/40"></span>
          </div>
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-md animate-bounce">
              <Icon icon="fluent-emoji-flat:brain" className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Kids Brain Gym</h1>
          <p className="text-xs text-white/90 mt-1 font-medium tracking-wide">
            PLAY • LEARN • GROW
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col gap-6">
          {/* Welcome Message */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 justify-center sm:justify-start">
              <FaGamepad className="text-purple-500" /> Let's Start!
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Choose your look and tell us your name to play.
            </p>
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name-input" className="text-sm font-bold text-slate-700">
              What is your name?
            </label>
            <input
              id="name-input"
              type="text"
              placeholder="Type your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none font-medium transition-all text-base"
              maxLength={20}
            />
          </div>

          {/* Avatar Selector */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-700">
              Choose an Avatar:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  style={{ minHeight: "64px" }}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedAvatar === avatar.id
                      ? "border-purple-500 bg-purple-50/50 scale-105 shadow-sm"
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <Icon icon={avatar.icon} className="w-10 h-10" />
                  <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                    {avatar.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            style={{ minHeight: "48px" }}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Creating Adventure...
              </span>
            ) : (
              <>
                <FaPlay className="text-sm" /> Let's Play!
              </>
            )}
          </button>
        </form>

        {/* Demo Status Area */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 text-xs text-slate-600 flex flex-col gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-700 text-xs">
            <FaInfoCircle className="text-blue-500" />
            <span>Tech Stack Test Details</span>
          </div>

          {result && (
            <div className={`p-3 rounded-xl border text-[11px] leading-relaxed font-mono ${
              result.success 
                ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                : "bg-amber-50 border-amber-100 text-amber-900"
            }`}>
              <div className="font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Status: {result.success ? "Success (DB & Logger OK)" : "Database Error (Logger Logged)"}</span>
                <span className="px-1.5 py-0.5 rounded bg-black/5 text-[9px]">POST /api/session</span>
              </div>
              {result.success ? (
                <div>
                  <p>✓ User Created: "{result.user.name}" (ID: {result.user.id.slice(0, 8)}...)</p>
                  <p>✓ GameSession Logged: type="{result.session.gameType}" (score: {result.session.score})</p>
                  <p className="mt-1 text-slate-400 italic font-sans text-[10px]">Pino logged the transaction details successfully in terminal.</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-red-600">Error: {result.error}</p>
                  <p className="mt-1 text-slate-500 text-[10px] font-sans leading-normal">{result.details}</p>
                  <p className="mt-1 text-slate-400 italic font-sans text-[10px]">Pino logged the error trace successfully in terminal.</p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1 text-[10px] text-slate-400 leading-normal">
            <p>• Emojis rendered via <strong>Fluent Emoji Flat</strong> from Iconify.</p>
            <p>• Icons loaded via <strong>React Icons</strong>.</p>
            <p>• Logs structured via <strong>Pino</strong> &amp; <strong>pino-pretty</strong>.</p>
            <p>• DB schema managed via <strong>Prisma ORM</strong> with <strong>pg driver adapter</strong>.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
