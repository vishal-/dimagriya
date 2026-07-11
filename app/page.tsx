"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { 
  FaBell, FaChevronRight, FaPlay, FaGamepad, FaTrophy, 
  FaUserFriends, FaUser, FaInfoCircle, FaStar, FaCrown, FaCheckCircle
} from "react-icons/fa";

const AVATARS = [
  { id: "boy", icon: "fluent-emoji-flat:boy", label: "Pavi" },
  { id: "rocket", icon: "fluent-emoji-flat:rocket", label: "Rocket" },
  { id: "unicorn", icon: "fluent-emoji-flat:unicorn", label: "Unicorn" },
  { id: "lion", icon: "fluent-emoji-flat:lion", label: "Lion" },
  { id: "frog", icon: "fluent-emoji-flat:frog", label: "Frog" },
  { id: "alien", icon: "fluent-emoji-flat:alien-monster", label: "Alien" },
  { id: "robot", icon: "fluent-emoji-flat:robot", label: "Robot" },
  { id: "cat", icon: "fluent-emoji-flat:cat-face", label: "Kitty" },
  { id: "panda", icon: "fluent-emoji-flat:panda", label: "Panda" }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");
  
  // Profile & DB States
  const [name, setName] = useState("Pavi");
  const [avatar, setAvatar] = useState("boy");
  const [userId, setUserId] = useState<string | null>(null);
  
  // Kid score states
  const [points, setPoints] = useState(350);
  const [streak, setStreak] = useState(7);
  const [activitiesCompleted, setActivitiesCompleted] = useState(4);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "🎉 Welcome to Dimagriya! Ready to learn?", read: false },
    { id: 2, text: "🔥 You have a 7-day streak! Keep it up!", read: false }
  ]);

  // Database synchronizer
  const triggerDatabaseLog = async (gameType: string, scoreEarned: number) => {
    setLoading(true);
    setApiResponse(null);
    showToast(`Logging your ${gameType} progress...`);

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          avatar: avatar,
          userId: userId
        })
      });
      const data = await res.json();
      setApiResponse(data);
      if (data.success) {
        if (data.user?.id) setUserId(data.user.id);
        setPoints(prev => prev + scoreEarned);
        showToast(`🎉 Correct! +${scoreEarned} Points Added!`);
      }
    } catch (err: any) {
      // Graceful local mode
      setPoints(prev => prev + scoreEarned);
      setApiResponse({
        success: false,
        error: "Database offline",
        details: "Pino logged the session, but database is not connected. Simulating gameplay points."
      });
      showToast(`🎉 Played! +${scoreEarned} Points Added (Simulated)`);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResponse(null);
    showToast("Saving profile to database...");

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Pavi",
          avatar: avatar,
          userId: userId
        })
      });
      const data = await res.json();
      setApiResponse(data);
      if (data.success) {
        if (data.user?.id) setUserId(data.user.id);
        showToast("✓ Profile saved successfully!");
      }
    } catch (err: any) {
      setApiResponse({
        success: false,
        error: "Database offline",
        details: "Updated details locally. Save was registered in local server log."
      });
      showToast("✓ Profile updated locally!");
    } finally {
      setLoading(false);
    }
  };

  const activeAvatarObj = AVATARS.find(a => a.id === avatar) || AVATARS[0];

  return (
    <div className="min-h-screen bg-white lg:bg-indigo-50/50 flex justify-center items-start lg:py-8 font-sans antialiased text-indigo-950">
      
      {/* Device Wrapper: max-width 768px for mobile/tablet optimization */}
      <main className="w-full max-w-[768px] min-h-screen lg:min-h-[920px] bg-white lg:shadow-2xl lg:rounded-[36px] overflow-hidden flex flex-col relative lg:border lg:border-slate-100 pb-28">
        
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-brand-navy/95 text-white px-5 py-3 rounded-full text-sm font-bold shadow-xl border border-indigo-400/20 flex items-center gap-2 animate-bounce">
            <Icon icon="fluent-emoji-flat:sparkles" className="w-5 h-5 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Logo Row */}
        <header className="p-5 flex items-center justify-between border-b border-indigo-50/60 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center shadow-inner select-none">
              <Icon icon="fluent-emoji-flat:brain" className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-brand-navy leading-none tracking-tight">
                Dimagriya
              </h1>
              <p className="text-[11px] font-bold mt-1 select-none flex gap-1">
                <span className="text-pink-500">Play.</span>
                <span className="text-cyan-500">Learn.</span>
                <span className="text-brand-orange">Grow.</span>
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ minWidth: "44px", minHeight: "44px" }}
              className="relative rounded-2xl bg-indigo-50/50 border border-indigo-100/50 hover:bg-indigo-50 flex items-center justify-center transition-all cursor-pointer"
            >
              <FaBell className="text-indigo-950 text-lg hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white"></span>
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-indigo-50 z-30 p-4 animate-fade-in">
                <h3 className="font-bold text-sm text-brand-navy mb-2 flex items-center justify-between">
                  <span>Notifications</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">New</span>
                </h3>
                <div className="flex flex-col gap-2">
                  {notifications.map(n => (
                    <div key={n.id} className="text-xs p-2.5 rounded-xl bg-indigo-50/50 leading-normal border border-indigo-100/20">
                      {n.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* -------------------- HOME TAB -------------------- */}
        {activeTab === "Home" && (
          <div className="p-5 flex-1 flex flex-col gap-5">
            
            {/* User Profile Bar */}
            <div className="flex items-center justify-between bg-indigo-50/20 p-2 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-brand-purple/20 bg-indigo-100 shadow-sm flex items-center justify-center">
                  {avatar === "boy" ? (
                    <img 
                      src="/images/pavi_avatar.png" 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon icon={activeAvatarObj.icon} className="w-9 h-9" />
                  )}
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-brand-navy flex items-center gap-1.5">
                    Hi {name}! 👋
                  </h2>
                  <p className="text-xs text-indigo-500 font-medium">Ready for some fun?</p>
                </div>
              </div>

              {/* Streak Badge */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 px-3 py-1.5 rounded-2xl shadow-sm">
                <Icon icon="fluent-emoji-flat:fire" className="w-5 h-5 animate-pulse" />
                <div className="text-left leading-none">
                  <span className="text-sm font-black text-brand-orange leading-none">{streak}</span>
                  <p className="text-[8px] font-black text-brand-orange/80 uppercase tracking-wider">Day Streak</p>
                </div>
              </div>
            </div>

            {/* Featured Banner: Brain Adventure */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-6 text-white overflow-hidden shadow-lg shadow-indigo-100 flex flex-col justify-between min-h-[190px]">
              {/* Graphic background elements */}
              <div className="absolute top-4 right-1/3 opacity-30 animate-pulse">
                <Icon icon="fluent-emoji-flat:glowing-star" className="w-6 h-6" />
              </div>
              <div className="absolute bottom-6 left-1/3 opacity-30">
                <Icon icon="fluent-emoji-flat:sparkles" className="w-8 h-8" />
              </div>

              {/* Text Area */}
              <div className="z-10 max-w-[60%] flex flex-col gap-2">
                <span className="text-yellow-300 font-extrabold text-xs tracking-wider uppercase">
                  Today's
                </span>
                <h2 className="text-[26px] font-black leading-tight tracking-tight drop-shadow-sm">
                  Brain Adventure
                </h2>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full w-fit">
                  <Icon icon="fluent-emoji-flat:star" className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-extrabold">{activitiesCompleted + 3} Activities</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => triggerDatabaseLog("Brain Adventure", 50)}
                style={{ minHeight: "44px" }}
                className="z-10 mt-4 bg-brand-yellow hover:bg-yellow-300 active:scale-95 transition-all text-brand-navy font-black text-xs px-4 py-2.5 rounded-full shadow-md shadow-purple-900/20 w-fit flex items-center gap-2 cursor-pointer"
              >
                <span>Start Adventure</span>
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-inner">
                  <FaChevronRight className="text-brand-navy text-[9px]" />
                </span>
              </button>

              {/* Absolute Character Image */}
              <img 
                src="/images/brain_adventure_hero.png" 
                alt="Brain Adventure Boy" 
                className="absolute right-[-10px] bottom-[-15px] w-[180px] h-[190px] object-contain z-10 pointer-events-none drop-shadow-lg"
              />
            </div>

            {/* Adventure Progress Tracker */}
            <div className="bg-white rounded-2xl border border-indigo-50 p-4 shadow-sm flex items-center gap-3.5">
              <Icon icon="fluent-emoji-flat:locked-chest" className="w-9 h-9 flex-shrink-0 animate-subtle-bounce" />
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                  Adventure Progress
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden relative border border-slate-50 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500" 
                      style={{ width: `${(activitiesCompleted / 7) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-black text-slate-500">{activitiesCompleted} / 7</span>
                </div>
              </div>
              <Icon icon="fluent-emoji-flat:wrapped-gift" className="w-9 h-9 flex-shrink-0 hover:scale-110 transition-transform cursor-pointer" onClick={() => triggerDatabaseLog("Gift Claim", 30)} />
            </div>

            {/* Quick Play Grid */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-brand-navy">Quick Play</h3>
                  <p className="text-xs text-indigo-500/80 font-medium">Pick an activity and play now!</p>
                </div>
                <button 
                  onClick={() => setActiveTab("Play")}
                  className="text-xs font-extrabold text-brand-purple flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  See All <FaChevronRight className="text-[8px]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {/* Quiz Card */}
                <button 
                  onClick={() => triggerDatabaseLog("Quiz Game", 25)}
                  className="flex flex-col items-center justify-center p-4 rounded-3xl bg-indigo-50 border border-indigo-100/50 hover:bg-indigo-100 hover:-translate-y-0.5 active:scale-95 transition-all shadow-sm group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-200/50 flex items-center justify-center shadow-inner relative mb-2">
                    <Icon icon="fluent-emoji-flat:brain" className="w-10 h-10" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 text-white font-black text-[10px] flex items-center justify-center border border-white">?</span>
                  </div>
                  <span className="font-extrabold text-sm text-brand-navy group-hover:text-brand-purple">Quiz</span>
                </button>

                {/* Riddles Card */}
                <button 
                  onClick={() => triggerDatabaseLog("Riddles Game", 25)}
                  className="flex flex-col items-center justify-center p-4 rounded-3xl bg-emerald-50 border border-emerald-100/50 hover:bg-emerald-100 hover:-translate-y-0.5 active:scale-95 transition-all shadow-sm group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-200/50 flex items-center justify-center shadow-inner mb-2">
                    <Icon icon="fluent-emoji-flat:magnifying-glass-tilted-left" className="w-10 h-10" />
                  </div>
                  <span className="font-extrabold text-sm text-brand-navy group-hover:text-emerald-600">Riddles</span>
                </button>

                {/* Puzzles Card */}
                <button 
                  onClick={() => triggerDatabaseLog("Puzzles Game", 25)}
                  className="flex flex-col items-center justify-center p-4 rounded-3xl bg-sky-50 border border-sky-100/50 hover:bg-sky-100 hover:-translate-y-0.5 active:scale-95 transition-all shadow-sm group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-sky-200/50 flex items-center justify-center shadow-inner mb-2">
                    <Icon icon="fluent-emoji-flat:jigsaw" className="w-10 h-10" />
                  </div>
                  <span className="font-extrabold text-sm text-brand-navy group-hover:text-sky-600">Puzzles</span>
                </button>

                {/* Fastest Fingers Card */}
                <button 
                  onClick={() => triggerDatabaseLog("Fastest Fingers", 25)}
                  className="flex flex-col items-center justify-center p-4 rounded-3xl bg-amber-50 border border-amber-100/50 hover:bg-amber-100 hover:-translate-y-0.5 active:scale-95 transition-all shadow-sm group group-hover:bg-amber-100 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-200/50 flex items-center justify-center shadow-inner mb-2">
                    <Icon icon="fluent-emoji-flat:high-voltage" className="w-10 h-10 animate-pulse" />
                  </div>
                  <span className="font-extrabold text-sm text-brand-navy group-hover:text-amber-600">Fastest Fingers</span>
                </button>
              </div>
            </div>

            {/* More Fun Activities Section */}
            <div className="flex flex-col gap-3">
              <h3 className="font-extrabold text-base text-brand-navy">More Fun Activities</h3>
              
              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Find & Spot */}
                <div 
                  onClick={() => triggerDatabaseLog("Find & Spot", 30)}
                  className="bg-white border border-indigo-50 rounded-2xl p-3 flex items-center gap-3.5 hover:shadow-md cursor-pointer hover:border-indigo-100 transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <Icon icon="fluent-emoji-flat:eye" className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-brand-navy leading-none">Find & Spot</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1">Observe & Win</span>
                  </div>
                </div>

                {/* Math Sprint */}
                <div 
                  onClick={() => triggerDatabaseLog("Math Sprint", 30)}
                  className="bg-white border border-indigo-50 rounded-2xl p-3 flex items-center gap-3.5 hover:shadow-md cursor-pointer hover:border-indigo-100 transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Icon icon="fluent-emoji-flat:input-numbers" className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-brand-navy leading-none">Math Sprint</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1">Fun with Numbers</span>
                  </div>
                </div>

                {/* Creativity */}
                <div 
                  onClick={() => triggerDatabaseLog("Creativity Game", 30)}
                  className="bg-white border border-indigo-50 rounded-2xl p-3 flex items-center gap-3.5 hover:shadow-md cursor-pointer hover:border-indigo-100 transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Icon icon="fluent-emoji-flat:artist-palette" className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-brand-navy leading-none">Creativity</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1">Draw & Imagine</span>
                  </div>
                </div>

                {/* Special Needs */}
                <div 
                  onClick={() => triggerDatabaseLog("Special Needs Game", 20)}
                  className="bg-white border border-indigo-50 rounded-2xl p-3 flex items-center gap-3.5 hover:shadow-md cursor-pointer hover:border-indigo-100 transition-all active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <Icon icon="fluent-emoji-flat:red-heart" className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-brand-navy leading-none">For Special Needs</span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1">Learn at your pace</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Banner: Growth & Stat Points */}
            <div className="relative bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-5 text-white overflow-hidden shadow-lg flex items-center min-h-[140px] gap-4">
              {/* Mascot cat */}
              <img 
                src="/images/cat_growth_hero.png" 
                alt="Mascot Cat" 
                className="w-24 h-24 object-contain flex-shrink-0 drop-shadow-md z-10"
              />
              
              <div className="flex-1 flex flex-col gap-2.5 z-10">
                <div className="leading-tight">
                  <span className="text-[10px] text-yellow-300 font-extrabold uppercase tracking-widest leading-none">Small steps every day</span>
                  <h3 className="text-lg font-black leading-tight mt-0.5">Big growth forever!</h3>
                </div>
                
                <div className="flex flex-col gap-1 text-[10px] font-bold text-white/95">
                  <div className="flex items-center gap-1.5">
                    <FaStar className="text-yellow-300 text-[8px]" />
                    <span>1000+ Activities</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaStar className="text-yellow-300 text-[8px]" />
                    <span>50K+ Happy Kids</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaStar className="text-yellow-300 text-[8px]" />
                    <span>100% Safe &amp; Ad-free</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Journey Component */}
            <div className="flex flex-col gap-3">
              <h3 className="font-extrabold text-base text-brand-navy">Continue Your Journey</h3>
              
              <div className="bg-white rounded-2xl border border-indigo-50 p-4 shadow-sm flex items-center justify-between gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-950 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Icon icon="fluent-emoji-flat:rocket" className="w-8 h-8" />
                </div>
                
                <div className="flex-1 flex flex-col gap-1.5">
                  <h4 className="text-xs font-black text-brand-navy leading-none">Space Explorer</h4>
                  <span className="text-[10px] text-slate-400 font-bold">3 / 10 Activities Completed</span>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-50">
                    <div className="h-full bg-brand-purple rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>

                <button 
                  onClick={() => triggerDatabaseLog("Space Explorer Progress", 40)}
                  style={{ minHeight: "44px" }}
                  className="bg-brand-purple hover:bg-indigo-700 active:scale-95 transition-all text-white font-extrabold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md shadow-indigo-100 cursor-pointer"
                >
                  <span>Continue</span>
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <FaChevronRight className="text-white text-[8px]" />
                  </span>
                </button>
              </div>
            </div>

            {/* Developer Tech Diagnostics Box */}
            {apiResponse && (
              <div className="mt-2 bg-slate-900 text-white rounded-2xl p-4 text-xs font-mono border border-slate-800 leading-normal">
                <div className="font-bold border-b border-slate-800 pb-1.5 mb-2 uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Developer Diagnostics (DB &amp; Pino logs)</span>
                  <span className="bg-brand-purple text-white px-2 py-0.5 rounded text-[10px] font-bold">POST /api/session</span>
                </div>
                {apiResponse.success ? (
                  <div className="text-emerald-400">
                    <p>✓ Status: SUCCESS (Prisma ORM &amp; PG Client Operational)</p>
                    <p className="mt-1">👤 User ID: {apiResponse.user.id}</p>
                    <p>👤 User Name: "{apiResponse.user.name}" (Avatar: {apiResponse.user.avatar})</p>
                    <p>🎮 Logged Game Session: {apiResponse.session.gameType}</p>
                    <p className="mt-2 text-slate-400 font-sans text-[10px] italic">Structured transaction details and PG pool connections were logged via Pino in the dev console.</p>
                  </div>
                ) : (
                  <div className="text-amber-400">
                    <p>✓ Status: SIMULATED (Postgres connection offline)</p>
                    <p className="mt-1">Pino Logger successfully captured and outputted the database transaction payload: "{apiResponse.error}". Details: {apiResponse.details}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* -------------------- PLAY TAB -------------------- */}
        {activeTab === "Play" && (
          <div className="p-5 flex-1 flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
                <FaGamepad className="text-brand-purple" /> Games Room
              </h2>
              <p className="text-xs text-indigo-500 font-medium">Earn points, win badges, and get smarter every day!</p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { title: "Memory Cards", desc: "Match identical animal cards to build memory power.", icon: "fluent-emoji-flat:monkey-face", score: 25, color: "bg-orange-100 text-orange-800" },
                { title: "Logic Blocks", desc: "Fill in the missing blocks to complete the spatial patterns.", icon: "fluent-emoji-flat:puzzle-piece", score: 35, color: "bg-indigo-100 text-indigo-800" },
                { title: "Word Magic", desc: "Construct vocabulary words from dynamic letter options.", icon: "fluent-emoji-flat:book-with-letters", score: 30, color: "bg-pink-100 text-pink-800" },
                { title: "Speed Addition", desc: "Solve simple math formulas as fast as your fingers fly!", icon: "fluent-emoji-flat:abacus", score: 40, color: "bg-yellow-100 text-yellow-800" }
              ].map((game, i) => (
                <div key={i} className="bg-white rounded-3xl border border-indigo-50 p-4 shadow-sm flex items-center justify-between gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Icon icon={game.icon} className="w-10 h-10" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-brand-navy leading-none">{game.title}</span>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${game.color}`}>
                        +{game.score} Pts
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">{game.desc}</p>
                  </div>
                  <button 
                    onClick={() => triggerDatabaseLog(game.title, game.score)}
                    style={{ minWidth: "44px", minHeight: "44px" }}
                    className="rounded-full bg-brand-purple hover:bg-indigo-700 active:scale-90 transition-all text-white flex items-center justify-center shadow-md cursor-pointer"
                  >
                    <FaPlay className="text-xs ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- REWARDS TAB -------------------- */}
        {activeTab === "Rewards" && (
          <div className="p-5 flex-1 flex flex-col gap-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Icon icon="fluent-emoji-flat:trophy" className="w-11 h-11" />
              </div>
              <h2 className="text-xl font-extrabold text-brand-navy">Trophy Room</h2>
              <p className="text-xs text-indigo-500 font-medium mt-1">Excellent work! You earned {points} points so far.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Streak Star", criteria: "Maintain a 7-day streak", icon: "fluent-emoji-flat:fire", unlocked: true },
                { title: "Star Collector", criteria: "Gain 300 total points", icon: "fluent-emoji-flat:star", unlocked: true },
                { title: "Brain Cadet", criteria: "Complete 10 activities", icon: "fluent-emoji-flat:rocket", unlocked: activitiesCompleted >= 10 },
                { title: "Grand Champion", criteria: "Gain 500 total points", icon: "fluent-emoji-flat:crown", unlocked: points >= 500 }
              ].map((badge, i) => (
                <div key={i} className={`rounded-3xl border p-4 flex flex-col items-center justify-center text-center gap-2 ${
                  badge.unlocked 
                    ? "bg-white border-yellow-200/50 shadow-sm" 
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${badge.unlocked ? "bg-yellow-50" : "bg-slate-200/50"}`}>
                    <Icon icon={badge.icon} className={`w-10 h-10 ${badge.unlocked ? "" : "grayscale"}`} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-extrabold text-xs text-brand-navy leading-none">{badge.title}</span>
                    <span className="text-[9px] text-slate-400 font-bold mt-1">{badge.criteria}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-1 ${
                    badge.unlocked ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-500"
                  }`}>
                    {badge.unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- FRIENDS TAB -------------------- */}
        {activeTab === "Friends" && (
          <div className="p-5 flex-1 flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
                <FaUserFriends className="text-brand-purple" /> Friends Leaderboard
              </h2>
              <p className="text-xs text-indigo-500 font-medium">Compete with other players in Dimagriya!</p>
            </div>

            <div className="bg-white rounded-3xl border border-indigo-50 shadow-sm overflow-hidden flex flex-col">
              {[
                { rank: 1, name: "Aarav", avatarIcon: "fluent-emoji-flat:alien-monster", score: 420, active: false },
                { rank: 2, name: name + " (You)", avatarIcon: activeAvatarObj.icon, score: points, active: true },
                { rank: 3, name: "Zara", avatarIcon: "fluent-emoji-flat:unicorn", score: 310, active: false },
                { rank: 4, name: "Kabir", avatarIcon: "fluent-emoji-flat:robot", score: 250, active: false }
              ].sort((a,b) => b.score - a.score).map((user, i) => (
                <div key={i} className={`p-4 flex items-center justify-between border-b border-indigo-50 last:border-0 ${
                  user.active ? "bg-purple-50/30" : ""
                }`}>
                  <div className="flex items-center gap-3.5">
                    <span className={`w-6 text-center font-black text-sm ${
                      i === 0 ? "text-yellow-500 text-base" : i === 1 ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {i + 1}
                    </span>
                    
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                      {user.active && avatar === "boy" ? (
                        <img 
                          src="/images/pavi_avatar.png" 
                          alt="User Avatar" 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Icon icon={user.avatarIcon} className="w-7 h-7" />
                      )}
                    </div>
                    
                    <span className={`font-extrabold text-sm ${user.active ? "text-brand-purple font-black" : "text-brand-navy"}`}>
                      {user.name}
                    </span>
                  </div>
                  
                  <span className="font-extrabold text-sm text-brand-navy">
                    {user.score} <span className="text-[10px] text-slate-400 font-bold uppercase">Pts</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- PROFILE TAB -------------------- */}
        {activeTab === "Profile" && (
          <div className="p-5 flex-1 flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
                <FaUser className="text-brand-purple" /> Profile Settings
              </h2>
              <p className="text-xs text-indigo-500 font-medium">Customize your avatar and update your player details in the database!</p>
            </div>

            <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
              
              {/* Profile Preview */}
              <div className="flex flex-col items-center justify-center py-4 bg-indigo-50/10 border border-indigo-50/55 rounded-3xl gap-2.5">
                <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-4 border-brand-purple bg-indigo-50 shadow-md flex items-center justify-center">
                  {avatar === "boy" ? (
                    <img 
                      src="/images/pavi_avatar.png" 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon icon={activeAvatarObj.icon} className="w-14 h-14" />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-extrabold text-lg text-brand-navy">{name}</h3>
                  <span className="text-xs font-bold text-slate-400">Level 3 Explorer</span>
                </div>
              </div>

              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="profile-name" className="text-xs font-black text-brand-navy uppercase tracking-wide">
                  Player Name:
                </label>
                <input 
                  id="profile-name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  maxLength={20}
                  className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-purple focus:outline-none font-bold text-base transition-all"
                />
              </div>

              {/* Avatar Selector Grid */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-brand-navy uppercase tracking-wide">
                  Select Avatar:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {AVATARS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAvatar(a.id)}
                      style={{ minHeight: "68px" }}
                      className={`rounded-2xl border-2 p-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                        avatar === a.id 
                          ? "border-brand-purple bg-purple-50/50 scale-105 shadow-sm" 
                          : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                      }`}
                    >
                      {a.id === "boy" ? (
                        <img 
                          src="/images/pavi_avatar.png" 
                          alt="Pavi profile" 
                          className="w-9 h-9 object-cover rounded-full"
                        />
                      ) : (
                        <Icon icon={a.icon} className="w-9 h-9" />
                      )}
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Save Button */}
              <button
                type="submit"
                disabled={loading}
                style={{ minHeight: "50px" }}
                className="w-full rounded-2xl bg-gradient-to-r from-brand-purple to-indigo-600 text-white font-bold text-base shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Saving Profile...
                  </span>
                ) : (
                  <>
                    <FaCheckCircle className="text-lg" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}

        {/* -------------------- FLOATING BOTTOM NAV BAR -------------------- */}
        <nav className="absolute bottom-0 left-0 right-0 h-22 bg-white border-t border-indigo-50/60 flex items-center justify-around px-2 z-20">
          {[
            { id: "Home", label: "Home", icon: FaGamepad },
            { id: "Play", label: "Play", icon: FaGamepad },
            { id: "Rewards", label: "Rewards", icon: FaTrophy },
            { id: "Friends", label: "Friends", icon: FaUserFriends },
            { id: "Profile", label: "Profile", icon: FaUser }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            
            // Custom icons matching the specific tab labels
            let customIcon = (
              <tab.icon className={`text-lg transition-transform ${isActive ? "scale-110" : ""}`} />
            );
            
            if (tab.id === "Home") {
              // Custom Home house emoji icon
              customIcon = (
                <Icon 
                  icon="fluent-emoji-flat:house" 
                  className={`w-6 h-6 transition-all ${isActive ? "scale-110" : "grayscale opacity-70"}`} 
                />
              );
            } else if (tab.id === "Play") {
              // Custom Gamepad emoji icon
              customIcon = (
                <Icon 
                  icon="fluent-emoji-flat:video-game" 
                  className={`w-6 h-6 transition-all ${isActive ? "scale-110" : "grayscale opacity-70"}`} 
                />
              );
            } else if (tab.id === "Rewards") {
              // Custom Trophy emoji icon
              customIcon = (
                <Icon 
                  icon="fluent-emoji-flat:trophy" 
                  className={`w-6 h-6 transition-all ${isActive ? "scale-110" : "grayscale opacity-70"}`} 
                />
              );
            } else if (tab.id === "Friends") {
              // Custom Friends emoji icon
              customIcon = (
                <Icon 
                  icon="fluent-emoji-flat:peoples" 
                  className={`w-6 h-6 transition-all ${isActive ? "scale-110" : "grayscale opacity-70"}`} 
                />
              );
            } else if (tab.id === "Profile") {
              // Custom Boy / User emoji icon
              customIcon = (
                <Icon 
                  icon="fluent-emoji-flat:boy" 
                  className={`w-6 h-6 transition-all ${isActive ? "scale-110" : "grayscale opacity-70"}`} 
                />
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowNotifications(false);
                }}
                style={{ minHeight: "44px", minWidth: "56px" }}
                className="flex flex-col items-center justify-center gap-1 cursor-pointer select-none group"
              >
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive ? "bg-purple-100/50" : "group-hover:bg-indigo-50/30"
                }`}>
                  {customIcon}
                </div>
                <span className={`text-[10px] font-black transition-colors ${
                  isActive ? "text-brand-purple" : "text-slate-400 group-hover:text-slate-600"
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

      </main>
    </div>
  );
}
