"use client";

import { useState, useEffect, useRef } from "react";

const GREETING = `Greetings, participant!

I am the riddle-bot, your digital guide in this challenge.

My protocols are designed to present you with a series of riddles. Your goal is to solve them to unlock a specific Microsoft 365 tool and move on to the next phase of the challenge.

Once you've unlocked your tool, you'll be given a problem to solve. Use your creativity to come up with a unique solution!

Need a hint or have a question? Just ask. I'm ready when you are.`;

const INITIAL_MESSAGES = [
  { sender: "bot", text: GREETING },
  { sender: "bot", text: "Enter Riddle number (0-40):" },
];

export default function ChatBot() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState("awaitRiddleNumber");
  const [currentId, setCurrentId] = useState(null);
  const bottomRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const appendMessages = (...newMsgs) =>
    setMessages((prev) => [...prev, ...newMsgs]);

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setStage("awaitRiddleNumber");
    setCurrentId(null);
    setInput("");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userContent = input.trim();
    appendMessages({ sender: "user", text: userContent });
    setInput("");

    if (stage === "awaitRiddleNumber") {
      const id = parseInt(userContent, 10);
      if (isNaN(id) || id < 0 || id > 40) {
        appendMessages({
          sender: "bot",
          text: "Please enter a valid number between 0 and 40.",
        });
        return;
      }

      setCurrentId(id);
      try {
        const res = await fetch(`/api/riddles/${id}`);
        const data = await res.json();
        if (data.success) {
          appendMessages(
            { sender: "bot", text: data.riddle },
            { sender: "bot", text: "Enter your answer:" }
          );
          setStage("awaitAnswer");
        } else {
          appendMessages({ sender: "bot", text: data.error || "Error" });
        }
      } catch {
        appendMessages({ sender: "bot", text: "Something went wrong." });
      }
    } else if (stage === "awaitAnswer" && currentId !== null) {
      try {
        const res = await fetch(`/api/riddles/${currentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answer: userContent }),
        });
        const data = await res.json();
        if (data.success) {
          appendMessages(
            { sender: "bot", text: data.response },
            { sender: "bot", text: "Enter Riddle number (0-40):" }
          );
          setStage("awaitRiddleNumber");
          setCurrentId(null);
        } else {
          appendMessages({ sender: "bot", text: data.error || "Error" });
        }
      } catch {
        appendMessages({ sender: "bot", text: "Something went wrong." });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-gradient-to-br from-[#114FA8] via-[#0078D4] to-[#6EB9FF] text-white font-sans px-2">
      <div className="flex flex-col w-full max-w-none sm:max-w-lg md:max-w-2xl h-[100dvh] sm:h-[95vh] md:h-[90vh] rounded-none sm:rounded-xl overflow-hidden shadow-2xl bg-black/20 backdrop-blur-md">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/30 backdrop-blur-sm shadow-md">
        {/* Four-square Microsoft logo */}
        <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-5 h-5">
          <div className="bg-[#F25022]" />
          <div className="bg-[#7FBA00]" />
          <div className="bg-[#00A4EF]" />
          <div className="bg-[#FFB900]" />
        </div>
        <h1 className="text-sm sm:text-base font-semibold select-none">Ignite 365 Quest</h1>

        {/* Reset button */}
        <button
          onClick={resetChat}
          className="ml-auto flex items-center gap-1 text-xs sm:text-sm px-3 py-1 border border-white/40 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <span className="text-lg leading-none">↻</span>
          Reset
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 glass-scroll">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl break-words ${
              msg.sender === "bot" ? "self-start" : "self-end"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg backdrop-blur-sm whitespace-pre-wrap ${
                msg.sender === "bot"
                  ? "bg-white/20"
                  : "bg-[#0078D4] text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 bg-black/40 backdrop-blur flex gap-2">
        <input
          className="flex-1 rounded-md px-2 sm:px-3 py-2 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#7FBA00] shadow-inner"
          placeholder="Type here & hit Enter…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-[#0078D4] text-white font-semibold px-3 sm:px-4 py-2 rounded-md hover:bg-[#1890F1] shadow-md cursor-pointer"
        >
          Send
        </button>
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-sm bg-black/30 border-t border-white/10 px-4 py-3 text-center text-xs text-white/80 font-mono flex justify-center items-center gap-1">
        <span className="opacity-75">© {new Date().getFullYear()}</span>
        <a
          href="https://ignitestudents.club"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:text-[#F25022] transition-colors"
        >
          Microsoft Ignite Students Club
        </a>
      </footer>
    </div>
    </div>
  );
} 