import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const BRAND_COLOR = "#0d9488";

const thread = [
  { from: "manager", text: "Hi Sarah, you've been assigned to Mary Johnson tomorrow at 10am.", time: "9:12 AM" },
  { from: "me", text: "Got it, thank you!", time: "9:20 AM" },
  { from: "manager", text: "Reminder: your CPR certification expires this month.", time: "Yesterday" },
];

export default function Messages() {
  return (
    <div className="flex h-[65vh] flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-sm font-black text-slate-900">Toronto West Office</h3>
        <p className="text-[11px] text-slate-400">Your franchise manager</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {thread.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-sm ${
                m.from === "me"
                  ? "rounded-br-sm text-white"
                  : "rounded-bl-sm border border-slate-100 bg-slate-50 text-slate-700"
              }`}
              style={m.from === "me" ? { background: BRAND_COLOR } : {}}
            >
              <p>{m.text}</p>
              <p className={`mt-1 text-[9px] ${m.from === "me" ? "text-teal-100" : "text-slate-400"}`}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium focus:border-teal-500 focus:outline-none"
        />
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: BRAND_COLOR }}
        >
          <FaPaperPlane className="text-xs" />
        </button>
      </div>
    </div>
  );
}