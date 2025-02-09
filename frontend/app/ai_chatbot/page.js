'use client'

import { useState } from "react";
import Image from "next/image";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { Card, CardContent } from "./components/Card";
import chatbot from "../../public/AI-chatbot.png";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const handleSendMessage = async () => {
   
    if (!userInput.trim()) return;
    console.log(userInput)

    // Add user message to chat history
    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);

    // Placeholder for AI response
    setMessages([...newMessages, { sender: "ai", text: "Thinking..." }]);
 
    try {
        
        const res = await fetch("http://localhost:5000/response", { 
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "https://localhost:3000"
            },
            body: JSON.stringify({ 
             user_input: userInput, 
            
            }),
          });
   

      const data = await res.json();
      console.log(data)
     
      setMessages([...newMessages, { sender: "ai", text: data.response || "No response received." }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { sender: "ai", text: "Error connecting to the AI agent." }]);
    }

    setUserInput(""); 
  };  

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-b from-gray-900 to-black text-white">
      {/* AI Agent Header */}
      <header className="flex flex-col items-center gap-4 mb-10">
        <Image src={chatbot} alt="AI Avatar" width={180} height={180} />
        <h1 className="text-6xl font-bold">Chat with CryptoSage</h1>
        <h3 className="text-2xl font-bold text-center">
          Welcome to CryptoSage, the smart assistant that helps you navigate the complex world of cryptocurrency trading.
        </h3>
      </header>

      {/* Chat Container */}
      <div className="w-full max-w-lg space-y-6">
        {/* Chat History */}
        <Card className="my-card max-h-[400px] overflow-y-auto">
          <CardContent className="text-center min-h-[100px] flex flex-col gap-3 text-white">
            {messages.length === 0 ? (
              <p className="text-gray-400">Ask me anything...</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-700 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* User Input Box */}
        <div className="flex gap-3">
          <Input
            className="flex-1 text-white p-3 border-gray-600"
            placeholder="Ask about crypto"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          
          <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

