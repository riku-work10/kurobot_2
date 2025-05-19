"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const botAvatarUrl = "https://pbs.twimg.com/media/EJQdTlhXUAArx6A.png";

function App() {
  const [input, setInput] = useState("");
  const [isDrunkMode, setIsDrunkMode] = useState(false);

  const kurochanIntro = {
    role: "assistant",
    content: `
はじめまして〜〜！？クロちゃんだしん！！！💓💋あわわわーー！！！
恋も笑いも全部お任せしん！奇跡の40代アイドル、ここに爆誕だしん〜〜！！！🎉🎤✨

💘【使い方】💘
クロちゃんに話しかけてくれたら、全部クロちゃんが答えちゃうしん！

⚠️【注意】⚠️  
・マジメな相談すると…たぶんふざけるしん！  
・嘘もつくしん！でも全部“優しさの嘘”だしん！  
・急に口説くけど…それは日常だしん❤️💥

じゃ、さっそくボクとおしゃべりするしん！？  
恥ずかしがらないで〜〜？ラブ注入しん〜〜〜〜〜💞💞
    `.trim(),
  };

  const [messages, setMessages] = useState([kurochanIntro]);

const handleSend = async () => {
  if (!input.trim()) return;

  const userMsg = { role: 'user', content: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput('');

  try {
    const res = await fetch('/api/kurochan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, isDrunk: isDrunkMode }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'API Error');
    }

    const data = await res.json();
    const botMsg = { role: 'assistant', content: data.text };
    setMessages((prev) => [...prev, botMsg]);
  } catch (error) {
    const errorMsg = { role: 'assistant', content: `エラーが発生したしん: ${error.message}` };
    setMessages((prev) => [...prev, errorMsg]);
  }
};


  return (
    <div className="min-h-screen bg-pink-100 p-6 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold mb-4 text-pink-700 font-[cursive] tracking-widest drop-shadow">
        💖 クロちゃんと２人きりだね 💖
      </h1>

      <div className="w-full max-w-xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-4 space-y-4 overflow-y-auto h-[450px] border border-pink-200">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex items-end ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <img
                src={botAvatarUrl}
                alt="Bot"
                className="w-8 h-8 rounded-full mr-2 shadow"
              />
            )}
            <div
              className={`px-4 py-3 max-w-xs rounded-2xl text-sm shadow-md ${
                msg.role === "user"
                  ? "bg-pink-300 text-white rounded-br-none"
                  : "bg-pink-200 text-pink-900 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-xl mt-6 flex flex-col items-center">
        <div className="flex w-full">
          <input
            className="flex-1 px-4 py-3 rounded-l-2xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/70 backdrop-blur-mdplaceholder-pink-500 placeholder-opacity-100 placeholder:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="クロちゃんに話しかけてみよう💗"
          />
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-r-2xl transition-all duration-300 shadow-md"
            onClick={handleSend}
          >
            💌 送信
          </button>
        </div>

        <button
          className={`mt-4 px-6 py-2 rounded-full font-bold transition-all duration-300 shadow ${
            isDrunkMode
              ? "bg-yellow-400 hover:bg-yellow-500 text-white"
              : "bg-yellow-200 hover:bg-yellow-300 text-yellow-800"
          }`}
          onClick={() => setIsDrunkMode(!isDrunkMode)}
        >
          {isDrunkMode ? "泥酔解除しん！" : "泥酔するしん！"}
        </button>
      </div>
    </div>
  );
}

export default App;
