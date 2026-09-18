"use client";

import { useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";

type ChatMessage = { id: string; body: string; senderId: string; receiverId: string; createdAt: string };

type RealtimeChatProps = { userId: string; receiverId: string; initialMessages?: ChatMessage[] };

export function RealtimeChat({ userId, receiverId, initialMessages = [] }: RealtimeChatProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [body, setBody] = useState("");
  const [connected, setConnected] = useState(false);
  const socket = useMemo<Socket>(() => io({ autoConnect: false }), []);

  useEffect(() => {
    socket.auth = { userId };
    socket.connect();
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onMessage = (message: ChatMessage) => {
      if ((message.senderId === userId && message.receiverId === receiverId) || (message.senderId === receiverId && message.receiverId === userId)) {
        setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
      }
    };
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message:new", onMessage);
    return () => { socket.off("connect", onConnect); socket.off("disconnect", onDisconnect); socket.off("message:new", onMessage); socket.disconnect(); };
  }, [receiverId, socket, userId]);

  const send = () => {
    const value = body.trim();
    if (!value || !connected) return;
    socket.emit("message:send", { receiverId, body: value });
    setBody("");
  };

  return <div className="flex min-h-[360px] flex-col rounded-2xl border border-[var(--line)] p-4"><div className="mb-3 text-xs opacity-60">{connected ? "Live chat connected" : "Connecting to live chat…"}</div><div className="flex-1 space-y-2">{messages.map((message) => <div key={message.id} className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}><div className="max-w-[75%] rounded-2xl bg-[var(--accent-soft)] px-3 py-2 text-sm">{message.body}</div></div>)}</div><div className="mt-4 flex gap-2"><input value={body} onChange={(event) => setBody(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} className="flex-1 rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-sm outline-none" placeholder="Write a message…" /><button onClick={send} disabled={!connected || !body.trim()} className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Send</button></div></div>;
}
