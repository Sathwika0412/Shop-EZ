import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, ChatMessage } from '../types';
import { Send, X, Sparkles, User, MessageSquareHeart } from 'lucide-react';
import { motion } from 'motion/react';

interface ArtisanAdvisorChatProps {
  onClose: () => void;
  currentProductContext: Product | null;
}

export const ArtisanAdvisorChat: React.FC<ArtisanAdvisorChatProps> = ({
  onClose,
  currentProductContext
}) => {
  const { user } = useShop();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [
        {
          text: `Namaste! 🙏 Welcome to ShopEZ. I am your Artisan Advisor and Digital Curator.

I am here to guide you through our curated collection of literature, designer garments, smart electronics, natural skincare, and fine lifestyle appliances.

Whether you are seeking the story behind Tagore's 'Gitanjali', the craft of hand-glazed Khurja ceramics, the high-resolution audio of AcousticPure headphones, or premium skincare formulas, please ask me!

${currentProductContext ? `I see you are currently looking at our exquisite **"${currentProductContext.name}"**. Would you like to hear the fascinating backstory of how it was crafted?` : "How may I help you explore our collection today?"}`
        }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    // Append user message locally
    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', parts: [{ text: userText }] }
    ];
    setMessages(updatedMessages);

    try {
      // Send chat history and current product details to Express proxy
      const response = await fetch('/api/artisan-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          currentProductContext
        })
      });

      const data = await response.json();
      
      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          { role: 'model', parts: [{ text: data.text }] }
        ]);
      } else {
        throw new Error(data.error || 'Failed to generate response.');
      }
    } catch (error: any) {
      console.error('Gemini API communication failed:', error);
      const errMsg = error?.message || 'Error occurred while contacting the AI Assistant.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          parts: [
            {
              text: `Apologies, patron! A brief disturbance in our communications occurred: "${errMsg}".

Please ensure your GEMINI_API_KEY is properly set in the Secrets/Settings panel if you are running in production.`
            }
          ]
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex justify-end">
      
      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="bg-stone-900 text-stone-100 w-full max-w-md h-full shadow-2xl flex flex-col justify-between"
      >
        {/* Chat Drawer Header */}
        <div className="p-5 border-b border-stone-800 flex justify-between items-center bg-stone-950">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-sm text-white">Artisan AI Advisor</h2>
              <p className="text-[9px] font-mono tracking-wider text-amber-500 uppercase">Interactive Heritage Curator</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Product Context Banner */}
        {currentProductContext && (
          <div className="bg-stone-800/80 px-5 py-2.5 border-b border-stone-850 flex items-center justify-between text-xs">
            <span className="text-stone-400 truncate max-w-[240px]">
              Discussing: <strong className="text-white font-medium">{currentProductContext.name}</strong>
            </span>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase font-mono">
              ₹{currentProductContext.price}
            </span>
          </div>
        )}

        {/* Conversation Message List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-stone-950/30">
          {messages.map((msg, index) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={index}
                className={`flex space-x-3 max-w-[85%] ${
                  isModel ? 'self-start' : 'self-end ml-auto flex-row-reverse space-x-reverse'
                }`}
              >
                {/* Profile Icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                  isModel 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}>
                  {isModel ? <MessageSquareHeart className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                {/* Message Box */}
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                  isModel 
                    ? 'bg-stone-800 border border-stone-850 text-stone-200' 
                    : 'bg-amber-500 text-stone-950 font-semibold'
                }`}>
                  <p className="whitespace-pre-line">{msg.parts[0].text}</p>
                </div>
              </div>
            );
          })}

          {/* Typing/Loading Indicator */}
          {isSending && (
            <div className="flex space-x-3 items-center max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                <MessageSquareHeart className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="bg-stone-800 border border-stone-850 p-3.5 rounded-2xl flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Message Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-850 bg-stone-950 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask about books, apparel, gadgets, skincare..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
            className="flex-1 p-3 bg-stone-850 border border-stone-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50 text-white"
          />
          <button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="p-3 bg-amber-500 text-stone-950 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-500 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </motion.div>
    </div>
  );
};
