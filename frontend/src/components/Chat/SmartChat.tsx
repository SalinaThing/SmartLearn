import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { useUser } from '@/hooks/useUser';
import axios from 'axios';

const SmartChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleOpenChat = () => {
        if (!user) {
            setChatHistory([{ role: 'ai', content: '🚨 **Login Required**\n\nYou must be logged in to chat with the SmartLearn AI Assistant. Please sign in or sign up to access this premium feature! 🎓' }]);
        } else if (user.role !== 'student') {
            setChatHistory([{ role: 'ai', content: '🚨 **Student Access Only**\n\nThe AI Assistant is specifically tailored and exclusively reserved for Student accounts. 🛠️' }]);
        }
        setIsOpen(true);
        setIsMinimized(false);
    };

    const handleSendMessage = async (e?: React.FormEvent, customMsg?: string) => {
        if (e) e.preventDefault();
        const finalMsg = customMsg || message;
        if (!finalMsg.trim() || isLoading) return;

        const userMessage = finalMsg.trim();
        if (!customMsg) setMessage('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7000/api/v1';
            const previousHistory = chatHistory.map(item => ({
                role: item.role === 'ai' ? 'assistant' : 'user',
                content: item.content
            }));

            const response = await axios.post(
                `${apiUrl}/chat/course-assistant`,
                {
                    message: userMessage,
                    history: previousHistory
                },
                {
                    withCredentials: true
                }
            );

            const aiAnswer = response?.data?.answer || "I couldn't generate a response right now.";
            setChatHistory(prev => [...prev, { role: 'ai', content: aiAnswer }]);
        } catch (error) {
            console.error('Chat error:', error);
            const fallback = axios.isAxiosError(error)
                ? (error.response?.data?.message || "Sorry, I'm having trouble connecting right now. Please try again later.")
                : "Sorry, I'm having trouble connecting right now. Please try again later.";
            setChatHistory(prev => [...prev, { role: 'ai', content: fallback }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        "Give me a study plan",
        "Show my enrolled courses",
        "Learning tips",
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className={`bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden mb-4 flex flex-col ${
                    isMinimized ? 'h-14 w-64' : 'h-[550px] w-[350px] sm:w-[400px]'
                }`}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#39c1f3] to-[#2a9fd8] p-4 flex items-center justify-between text-white shadow-lg sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                    <FiMessageCircle size={18} />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-blue-600 rounded-full animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight text-white/90">SmartLearn AI</span>
                                <span className="text-[10px] text-white/70 uppercase font-black">Active Assistant</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                                {isMinimized ? <FiMaximize2 size={16} /> : <FiMinimize2 size={16} />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                                <FiX size={16} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* MessagesArea */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-[#f8fafc] dark:bg-gray-900/50">
                                {chatHistory.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                            <FiMessageCircle className="text-blue-600 dark:text-blue-400" size={32} />
                                        </div>
                                        <div className="max-w-[80%]">
                                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">How can I help you?</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Ask about your courses, Request a study plan, or learn new concepts instantly.
                                            </p>
                                        </div>
                                        
                                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                                            {user && user.role === 'student' && suggestions.map((s, i) => (
                                                <button 
                                                    key={i} 
                                                    onClick={() => handleSendMessage(undefined, s)}
                                                    className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {chatHistory.map((item, index) => (
                                    <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            item.role === 'user' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700'
                                        }`}>
                                            <p className="whitespace-pre-line">{item.content}</p>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm">
                                            <div className="flex gap-1.5 Items-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s]" />
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                                {user && user.role === 'student' && chatHistory.length > 0 && chatHistory.length < 5 && (
                                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide no-scrollbar">
                                        {suggestions.map((s, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => handleSendMessage(undefined, s)}
                                                className="whitespace-nowrap px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg text-[11px] font-semibold text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <form onSubmit={handleSendMessage} className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        disabled={!user || user.role !== 'student' || isLoading}
                                        placeholder={!user ? "Login required..." : user.role !== 'student' ? "Student access only..." : "Type your message..."}
                                        className="w-full bg-gray-100 dark:bg-gray-900/50 border border-transparent focus:border-blue-500/30 rounded-xl py-3 pl-4 pr-12 text-sm outline-none transition-all dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!user || user.role !== 'student' || !message.trim() || isLoading}
                                        className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md group"
                                    >
                                        <FiSend size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                </form>
                                <p className="text-[9px] text-center text-gray-400 mt-2 font-medium uppercase tracking-widest italic opacity-50">Powered by Smart Dummy AI</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <div className="relative group">
                    <div className="absolute -top-14 right-0 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 text-[12px] font-bold text-[#39c1f3] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        Chat with us 👋
                    </div>
                    <button
                        onClick={handleOpenChat}
                        className="w-[64px] h-[64px] bg-[#39c1f3] rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-white overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                        <svg viewBox="0 0 24 24" width="36" height="36" className="relative z-10 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C13.8546 22 15.5925 21.4948 16.9839 20.6358L21.5 22L20.0827 17.7288C21.313 16.1479 22 14.1565 22 12C22 6.47715 17.5228 2 12 2Z" fill="white"/>
                            <path d="M8 13.5C8 13.5 9.5 15.5 12 15.5C14.5 15.5 16 13.5 16 13.5" stroke="#39c1f3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SmartChat;

