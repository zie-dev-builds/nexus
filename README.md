"use client";

import { useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Bookmark,
  Compass,
  Heart,
  Home,
  ImagePlus,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Palette,
  Search,
  Send,
  Settings,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

type Theme = "pink" | "dark" | "blue" | "face";

const people = [
  { name: "Maya Chen", handle: "@mayac", avatar: "https://i.pravatar.cc/100?img=47", online: true },
  { name: "Noah Williams", handle: "@noahw", avatar: "https://i.pravatar.cc/100?img=12", online: true },
  { name: "Lena Ortiz", handle: "@lenao", avatar: "https://i.pravatar.cc/100?img=32", online: false },
];

const seedPosts = [
  {
    id: 1,
    author: "Maya Chen",
    handle: "@mayac",
    avatar: "https://i.pravatar.cc/100?img=47",
    time: "18m",
    body: "A little reminder that the best ideas usually start out messy. Keep making room for the unexpected ✨",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80",
    likes: 248,
    comments: 18,
    liked: false,
  },
  {
    id: 2,
    author: "Noah Williams",
    handle: "@noahw",
    avatar: "https://i.pravatar.cc/100?img=12",
    time: "2h",
    body: "Found a new corner of the city today. The light was doing all the work.",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80",
    likes: 89,
    comments: 7,
    liked: true,
  },
];

function NexusLogo({ theme, face }: { theme: Theme; face?: string }) {
  const palette =
    theme === "blue"
      ? "linear-gradient(135deg,#7dd3fc,#0891b2)"
      : theme === "dark"
        ? "linear-gradient(135deg,#ff8bc7,#ec167c)"
        : theme === "face"
          ? "linear-gradient(135deg,#d8b4fe,#7c3aed)"
          : "linear-gradient(135deg,#f9a8d4,#be185d)";

  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-11 w-11 place-items-center">
        <div
          className="absolute inset-1 rotate-45 rounded-[11px] rounded-br-sm"
          style={{
            background: palette,
            backgroundImage: face ? `linear-gradient(#0003,#0003), url(${face})` : undefined,
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute inset-1 -rotate-45 rounded-[11px] rounded-bl-sm border-2 border-white/80"
          style={{
            background: theme === "blue" ? "#0e7490" : theme === "dark" ? "#501331" : theme === "face" ? "#4c1d95" : "#db2777",
            opacity: 0.92,
          }}
        />
        <span className="relative z-10 text-xl font-black text-white">✦</span>
      </div>
      <div>
        <div className="text-lg font-black tracking-[0.28em]">NEXUS</div>
        <div className="text-[9px] font-semibold tracking-[0.23em] opacity-50">YOUR PEOPLE, IN SYNC</div>
      </div>
    </div>
  );
}

function Avatar({ src, size = "h-10 w-10" }: { src: string; size?: string }) {
  return <img src={src} className={`${size} rounded-full object-cover ring-2 ring-white`} alt="" />;
}

export function NexusDashboard() {
  const { data: session } = useSession();
  const displayName = session?.user?.name ?? "Alex Morgan";
  const displayHandle = session?.user?.email ? `@${session.user.email.split("@")[0]}` : "@alexm";

  const [theme, setTheme] = useState<Theme>("pink");
  const [face, setFace] = useState("");
  const [activeNav, setActiveNav] = useState("Home");
  const [composter, setComposer] = useState("");
  const [posts, setPosts] = useState(seedPosts);
  const [showThemes, setShowThemes] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(["Hey! Are we still on for the creative jam?", "Absolutely. I saved a spot for us ☕"]);

  const currentThemeLabel =
    theme === "pink" ? "Default" : theme === "dark" ? "Dark mode" : theme === "blue" ? "Luminous blue" : "Face mode";

  const navItems = [
    { label: "Home", icon: Home },
    { label: "Explore", icon: Compass },
    { label: "Messages", icon: MessageCircle },
    { label: "Bookmarks", icon: Bookmark },
  ];

  const addPost = () => {
    if (!composter.trim()) {
      return;
    }

    setPosts((currentPosts) => [
      {
        id: Date.now(),
        author: displayName,
        handle: displayHandle,
        avatar: session?.user?.image ?? "https://i.pravatar.cc/100?img=68",
        time: "now",
        body: composer,
        likes: 0,
        comments: 0,
        liked: false,
      },
      ...currentPosts,
    ]);

    setComposer("");
  };

  const toggleLike = (id: number) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post,
      ),
    );
  };

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }

    setMessages((currentMessages) => [...currentMessages, message]);
    setMessage("");
  };

  const handleFaceUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFace(String(reader.result));
      setTheme("face");
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className={`min-h-screen theme-${theme}`}>
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside
          className={`${mobileMenuOpen ? "fixed inset-y-0 left-0 z-30 flex" : "hidden lg:flex"} w-[270px] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface)]/90 p-7 backdrop-blur-xl`}
        >
          <div className="mb-12">
            <NexusLogo theme={theme} face={face} />
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-sm font-bold transition ${
                  activeNav === label ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "opacity-60 hover:bg-[var(--accent-soft)] hover:opacity-100"
                }`}
              >
                <Icon size={19} strokeWidth={activeNav === label ? 2.5 : 2} />
                {label}
                {label === "Messages" ? <span className="ml-auto rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] text-white">3</span> : null}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-2">
            <button onClick={() => setShowThemes(!showThemes)} className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold opacity-60 hover:bg-[var(--accent-soft)] hover:opacity-100">
              <Palette size={19} />
              Theme studio
            </button>
            <button className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold opacity-60 hover:bg-[var(--accent-soft)] hover:opacity-100">
              <Settings size={19} />
              Settings
            </button>

            <div className="mt-5 flex items-center gap-3 border-t border-[var(--line)] pt-5">
              <Avatar src={session?.user?.image ?? "https://i.pravatar.cc/100?img=68"} size="h-10 w-10" />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{displayName}</div>
                <div className="text-xs opacity-50">{displayHandle}</div>
              </div>
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="ml-auto text-xs font-bold text-[var(--accent)]">
                Exit
              </button>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[var(--line)] bg-[var(--surface)]/85 px-5 backdrop-blur-xl lg:px-10">
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu />
            </button>
            <div className="hidden text-sm font-bold lg:block">{activeNav}</div>
            <div className="relative w-full max-w-[330px] lg:ml-auto">
              <Search size={17} className="absolute left-4 top-3.5 opacity-40" />
              <input className="w-full rounded-full border border-[var(--line)] bg-[var(--accent-soft)]/40 py-3 pl-11 pr-4 text-sm outline-none placeholder:opacity-50 focus:border-[var(--accent)]" placeholder="Search Nexus" />
            </div>
            <button className="ml-4 rounded-full p-2.5 hover:bg-[var(--accent-soft)]">
              <Bell size={20} />
            </button>
          </header>

          <div className="mx-auto max-w-[760px] px-5 py-8 lg:px-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold opacity-50">Friday, September 18</p>
                <h1 className="text-3xl font-black tracking-tight">
                  Good morning, {displayName.split(" ")[0]} <span className="text-[var(--accent)]">✦</span>
                </h1>
              </div>
              <button className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200/30">
                Create post
              </button>
            </div>

            <div className="card mb-7 p-5">
              <div className="flex gap-3">
                <Avatar src={session?.user?.image ?? "https://i.pravatar.cc/100?img=68"} />
                <textarea
                  value={composter}
                  onChange={(event) => setComposer(event.target.value)}
                  className="min-h-[64px] flex-1 resize-none bg-transparent pt-2 text-base outline-none placeholder:opacity-40"
                  placeholder="Share something with your people..."
                />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4">
                <div className="flex gap-1">
                  <button className="rounded-xl p-2 text-[var(--accent)] hover:bg-[var(--accent-soft)]">
                    <ImagePlus size={19} />
                  </button>
                  <button className="rounded-xl p-2 text-[var(--accent)] hover:bg-[var(--accent-soft)]">
                    <Sparkles size={19} />
                  </button>
                  <span className="ml-2 self-center text-xs opacity-40">Everyone can see this</span>
                </div>
                <button onClick={addPost} className="rounded-xl bg-[var(--accent)] px-5 py-2 text-sm font-bold text-white disabled:opacity-40" disabled={!composter.trim()}>
                  Post
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-5 border-b border-[var(--line)] text-sm font-bold">
              <button className="border-b-2 border-[var(--accent)] pb-3 text-[var(--accent)]">For you</button>
              <button className="pb-3 opacity-40">Following</button>
            </div>

            <div className="space-y-5">
              {posts.map((post) => (
                <motion.article layout key={post.id} className="card overflow-hidden p-5">
                  <div className="flex items-start gap-3">
                    <Avatar src={post.avatar} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{post.author}</span>
                        <span className="text-sm opacity-40">
                          {post.handle} · {post.time}
                        </span>
                        <MoreHorizontal size={18} className="ml-auto opacity-40" />
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7">{post.body}</p>

                      {post.image ? <img src={post.image} alt="Post attachment" className="mt-4 max-h-[390px] w-full rounded-2xl object-cover" /> : null}

                      <div className="mt-4 flex items-center gap-5 text-sm opacity-60">
                        <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 hover:text-[var(--accent)] ${post.liked ? "text-[var(--accent)] opacity-100" : ""}`}>
                          <Heart size={18} fill={post.liked ? "currentColor" : "none"} />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-2 hover:text-[var(--accent)]">
                          <MessageCircle size={18} />
                          {post.comments}
                        </button>
                        <button className="ml-auto">
                          <Bookmark size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <aside className="hidden w-[310px] shrink-0 space-y-6 border-l border-[var(--line)] bg-[var(--surface)]/50 p-7 xl:block">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-black">People to follow</h2>
              <button className="text-xs font-bold text-[var(--accent)]">See all</button>
            </div>

            {people.map((person) => (
              <div className="mb-4 flex items-center gap-3 last:mb-0" key={person.handle}>
                <div className="relative">
                  <Avatar src={person.avatar} size="h-9 w-9" />
                  {person.online ? <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface)] bg-emerald-400" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{person.name}</div>
                  <div className="text-xs opacity-45">{person.handle}</div>
                </div>
                <button onClick={() => setIsFollowing(!isFollowing)} className="rounded-lg border border-[var(--accent)] px-2.5 py-1 text-xs font-bold text-[var(--accent)]">
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>

          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-pink-400 to-fuchsia-700 p-5 text-white">
              <Sparkles size={20} />
              <h2 className="mt-8 text-xl font-black">Make your space yours.</h2>
              <p className="mt-1 text-sm text-white/75">Explore themes and make NEXUS feel like home.</p>
            </div>
            <button onClick={() => setShowThemes(true)} className="w-full p-4 text-left text-sm font-bold">
              Open theme studio <span className="float-right">→</span>
            </button>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {showThemes ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 p-5 backdrop-blur-sm" onClick={() => setShowThemes(false)}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={(event) => event.stopPropagation()} className="absolute bottom-5 right-5 w-full max-w-[390px] rounded-3xl bg-[var(--surface)] p-6 shadow-2xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">Theme studio</h2>
                  <p className="mt-1 text-xs opacity-50">Personalize your NEXUS experience</p>
                </div>
                <button onClick={() => setShowThemes(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                {([
                  ["pink", "Default", "White canvas · Pink core", "bg-gradient-to-r from-pink-200 to-pink-700"],
                  ["dark", "Dark mode", "Matte black · White type", "bg-gradient-to-r from-zinc-950 to-pink-600"],
                  ["blue", "Luminous blue", "Cool tones · Cyan light", "bg-gradient-to-r from-sky-300 to-cyan-700"],
                  ["face", "Personalized face", "Use an image as your mask", "bg-gradient-to-r from-violet-400 to-fuchsia-600"],
                ] as [Theme, string, string, string][]).map(([key, name, description, gradient]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left ${theme === key ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)]"}`}
                  >
                    <span className={`h-10 w-10 rounded-xl ${gradient}`} />
                    <span className="flex-1">
                      <strong className="block text-sm">{name}</strong>
                      <small className="opacity-50">{description}</small>
                    </span>
                    <span className={`h-4 w-4 rounded-full border-4 ${theme === key ? "border-[var(--accent)]" : "border-transparent ring-1 ring-gray-300"}`} />
                  </button>
                ))}
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[var(--line)] p-4 text-sm font-bold">
                <ImagePlus size={18} className="text-[var(--accent)]" />
                Upload face image
                <input type="file" accept="image/*" className="hidden" onChange={handleFaceUpload} />
              </label>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[var(--accent-soft)] p-3">
                <span className="text-xs opacity-60">Current theme</span>
                <strong className="text-sm text-[var(--accent)]">{currentThemeLabel}</strong>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {activeNav === "Messages" ? (
        <div className="fixed inset-0 z-30 bg-[var(--surface)] p-6 lg:left-[270px] lg:top-[76px] lg:p-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <Avatar src={people[0].avatar} />
              <div>
                <h2 className="font-black">Maya Chen</h2>
                <p className="text-xs text-emerald-500">Active now</p>
              </div>
            </div>

            <div className="card flex min-h-[500px] flex-col p-5">
              <div className="flex-1 space-y-4">
                {messages.map((currentMessage, index) => (
                  <div key={`${currentMessage}-${index}`} className={`flex ${index % 2 ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${index % 2 ? "bg-[var(--accent)] text-white" : "bg-[var(--accent-soft)]"}`}>
                      {currentMessage}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-2 border-t border-[var(--line)] pt-4">
                <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} className="flex-1 rounded-xl bg-[var(--accent-soft)] px-4 py-3 text-sm outline-none" placeholder="Write a message..." />
                <button onClick={sendMessage} className="rounded-xl bg-[var(--accent)] p-3 text-white">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
