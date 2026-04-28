"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, 
  FiChevronDown, 
  FiUsers, 
  FiBarChart2, 
  FiUserCheck, 
  FiPieChart, 
  FiLink, 
  FiFilter,
  FiCalendar,
  FiDollarSign,
  FiEdit,
  FiImage,
  FiMessageSquare,
  FiSettings,
  FiFileText,
  FiMail,
  FiMessageCircle,
  FiSend,
  FiArrowLeft
} from "react-icons/fi";

export default function UserManual() {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("manual"); // "manual" or "ai"
  const [aiMessages, setAiMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const faqs = [
    {
      question: "How to see total users by month, year or week?",
      answer: "Go to the Dashboard section. The first graph named 'Total Users Over Time' displays this data. You can switch between Week, Month, and Year filters, and use the arrow buttons to view older or newer time ranges.",
      icon: <FiBarChart2 className="text-[#FF5E92]" />
    },
    {
      question: "How to see newly joined users with their names?",
      answer: "In the Dashboard section, the second graph shows which users recently joined. It includes their names and filters like This Week and This Month.",
      icon: <FiUsers className="text-[#FF5E92]" />
    },
    {
      question: "How to view Gender Ratio and Profile Completion Rate?",
      answer: "In the Dashboard section, graph 3 and 4 display 'Gender Ratio' and 'Profile Completion Rate'. These graphs show gender distribution and how many users have completed different percentages of their profile.",
      icon: <FiPieChart className="text-[#FF5E92]" />
    },
    {
      question: "What does Connection Status Overview show?",
      answer: "In the Dashboard section, the 5th graph shows the Connection Status Overview. It displays how many connections are Pending, Accepted, Rejected, and Cancelled from the total user base. The chart includes: Accepted, Cancelled, Pending, and Rejected distributions.",
      icon: <FiLink className="text-[#FF5E92]" />
    },
    {
      question: "How to view all users based on creation time and see user details?",
      answer: "Go to the User section from the left navbar. Use the filter button called 'Default Order' or 'Newer First'. Select 'Newer First' to see users based on their creation time. Click on any user to navigate to their detailed profile page where all user information will be displayed.",
      icon: <FiCalendar className="text-[#FF5E92]" />
    },
    {
      question: "How to search users by email or name?",
      answer: "In the User section, use the search bar at the top. You can type any user's name or email address to filter and find specific users quickly.",
      icon: <FiSearch className="text-[#FF5E92]" />
    },
    {
      question: "How to see users based on plan type?",
      answer: "In the User section, there is a plan-based filter control. Select 'All' to see all users, or select a specific plan (Standard, Gold, Platinum) to view only users with that particular plan. You can also view user subscription details in the same row of user short info.",
      icon: <FiFilter className="text-[#FF5E92]" />
    },
    {
      question: "How to see how many people have which plan?",
      answer: "Go to the User section. On the right side, there is a 'Plan Insight' section that shows the distribution of users based on their subscription plans (Standard, Gold, Platinum).",
      icon: <FiPieChart className="text-[#FF5E92]" />
    },
    {
      question: "What is the difference between total users and new users?",
      answer: "Total users represent all registered users in the system. New users specifically refer to users who have created their accounts in the current month only.",
      icon: <FiUsers className="text-[#FF5E92]" />
    },
    {
      question: "How to see all transactions and financial reports?",
      answer: "Go to the Transaction section → Financial Reports. You can filter data by DAY, WEEK, or MONTH. Use the 'Export CSV' button to download reports. The section shows: Total Revenue, User, Email, Plan, Price, and Subscribed On dates.",
      icon: <FiDollarSign className="text-[#FF5E92]" />
    },
    {
      question: "Where can we see all user plan specifics with billing details?",
      answer: "Go to the Transaction section → User Billing Overview. Use the search bar to find users by name or email. The table shows: Name, Gender, Email, Plan, Type, Expires, Days Left, Price, and Notice. Use the 'Export CSV' button to download this data.",
      icon: <FiFileText className="text-[#FF5E92]" />
    },
    {
      question: "How to change plan details or plan prices?",
      answer: "Go to the Plan Control section. You can see all listed plans there. Click the 'Edit' button next to any plan to modify: Plan Name, Price, Duration, Description, and Features. Save changes after editing.",
      icon: <FiEdit className="text-[#FF5E92]" />
    },
    {
      question: "How to see Diamond plan details (marriage application form)?",
      answer: "In the Plan Control section, navigate to 'Application Plans'. This section manages and tracks all marriage application plans. You can filter by status and view: Application Details, Plan & Penalty, Applicant Info, Partner Info, and Payment & Actions.",
      icon: <FiSettings className="text-[#FF5E92]" />
    },
    {
      question: "How to set wallpapers or announcement banners in the app?",
      answer: "Use the 'In-App Banner' section to upload and manage banners. Currently, this feature is optimized for the mobile app only. The website version has limited banner support.",
      icon: <FiImage className="text-[#FF5E92]" />
    },
    {
      question: "How to see who raised contact forms or wants to talk to us?",
      answer: "Go to the Alerts section. Use the three filters: 'All' (all inquiries), 'Contacted' (users we have responded to), and 'Not Contacted' (users we haven't responded to yet). The section shows: Name, Email, Phone Number, and Message details.",
      icon: <FiMessageSquare className="text-[#FF5E92]" />
    }
  ];

  // Enhanced AI function with better matching
  const findAnswer = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    // Direct match with similarity scoring
    const matches = faqs.map(faq => {
      const faqLower = faq.question.toLowerCase();
      let score = 0;
      
      // Check for direct word matches
      const questionWords = lowerQuestion.split(/\s+/);
      const faqWords = faqLower.split(/\s+/);
      
      questionWords.forEach(word => {
        if (word.length > 3 && faqLower.includes(word)) {
          score += 2;
        }
      });
      
      // Check for exact phrase matches
      if (lowerQuestion.includes(faqLower.replace('?', '')) || 
          faqLower.includes(lowerQuestion)) {
        score += 10;
      }
      
      return { faq, score };
    }).filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score);

    if (matches.length > 0 && matches[0].score >= 3) {
      return matches[0].faq.answer;
    }

    // Keyword-based fallback
    const keywordMap = {
      'user': [0, 1, 4, 5, 6, 7, 8],
      'users': [0, 1, 4, 5, 6, 7, 8],
      'plan': [6, 7, 10, 11, 12, 13],
      'plans': [6, 7, 10, 11, 12, 13],
      'dashboard': [0, 1, 2, 3],
      'transaction': [9, 10],
      'transactions': [9, 10],
      'billing': [10, 11],
      'contact': [15],
      'banner': [14],
      'wallpaper': [14],
      'gender': [2],
      'connection': [3],
      'search': [5],
      'filter': [4, 6],
      'export': [9, 10, 11],
      'financial': [9],
      'revenue': [9],
      'money': [9],
      'payment': [9, 10],
      'subscription': [6, 7, 10, 11]
    };

    for (const [keyword, indices] of Object.entries(keywordMap)) {
      if (lowerQuestion.includes(keyword)) {
        const bestMatch = indices[0];
        return faqs[bestMatch].answer;
      }
    }

    return null;
  };

  const handleAISubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage = {
      type: 'user',
      content: userInput,
      timestamp: new Date(),
      id: Date.now(),
      displayText: userInput // Store the complete text
    };

    setAiMessages(prev => [...prev, newUserMessage]);
    setUserInput("");
    setIsTyping(true);
    
    // Simulate AI thinking with random delay for realism
    const thinkingTime = Math.random() * 800 + 700;
    
    setTimeout(() => {
      const answer = findAnswer(userInput);
      
      const aiResponse = {
        type: 'ai',
        content: answer || "I'm sorry, but this question is beyond my current knowledge base. For specific or complex issues, please contact our support team who will be happy to assist you further.",
        timestamp: new Date(),
        id: Date.now() + 1,
        displayText: answer || "I'm sorry, but this question is beyond my current knowledge base. For specific or complex issues, please contact our support team who will be happy to assist you further." // Store complete text
      };

      setAiMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, thinkingTime);
  };

  const handleContactSupport = () => {
    const deviceInfo = `
Device Information:
- User Agent: ${navigator.userAgent}
- Platform: ${navigator.platform}
- Language: ${navigator.language}
- Screen Resolution: ${window.screen.width}x${window.screen.height}
- Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
- Current URL: ${window.location.href}
- Timestamp: ${new Date().toISOString()}
    `.trim();

    const subject = "Support Request - Dashboard Assistance";
    const body = `
Hello Vereda Support Team,

I need assistance with the dashboard. Please help me with the following:

[Please describe your issue or question here]

---
${deviceInfo}
---

Thank you,
[Your Name]

    `.trim();

    const mailtoLink = `mailto:himanshu@vereda.co.in?cc=abhishek@vereda.co.in&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink, '_blank');
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  // Reset AI chat when switching to AI view
  useEffect(() => {
    if (activeView === "ai" && aiMessages.length === 0) {
      const welcomeMessage = {
        type: 'ai',
        content: "Hello! I'm VeredaAI, your intelligent assistant for the dashboard. I can help you with user management, plan configurations, transaction reports, and much more. What would you like to know?",
        timestamp: new Date(),
        id: Date.now(),
        displayText: "Hello! I'm VeredaAI, your intelligent assistant for the dashboard. I can help you with user management, plan configurations, transaction reports, and much more. What would you like to know?"
      };
      setAiMessages([welcomeMessage]);
    }
  }, [activeView, aiMessages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      <AnimatePresence mode="wait">
        {activeView === "manual" ? (
          <motion.div
            key="manual"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="p-6 space-y-12 max-w-4xl mx-auto"
          >
            {/* Page Header */}
            <div className="text-center">
              <motion.h1
                className="text-4xl font-bold text-[#FF5E92] tracking-wide"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                User Manual – Complete Dashboard Guide
              </motion.h1>
              
              <motion.p
                className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Comprehensive step-by-step instructions for all dashboard features and analytics
              </motion.p>

              <motion.div
                className="w-24 h-1 mt-4 bg-gradient-to-r from-[#FF5E92] to-pink-400 rounded-full mx-auto"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 
                    focus:outline-none focus:ring-2 focus:ring-[#FF5E92] focus:border-transparent
                    shadow-sm bg-white/80 backdrop-blur text-lg
                    placeholder-gray-400
                  "
                />
              </div>
            </motion.div>

            <section className="space-y-8">
              <motion.h2 
                className="text-3xl font-bold text-gray-800 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Complete Features & Analytics Guide
              </motion.h2>

              {/* FAQ LIST */}
              <motion.div
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.08 },
                  },
                }}
              >
                <AnimatePresence>
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => {
                      const isOpen = openIndex === index;

                      return (
                        <motion.div
                          key={index}
                          variants={{
                            hidden: { opacity: 0, y: 25, scale: 0.95 },
                            visible: { opacity: 1, y: 0, scale: 1 },
                          }}
                          exit={{ opacity: 0, y: -15, scale: 0.95 }}
                          transition={{ duration: 0.4 }}
                        >
                          <motion.div
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: "0 10px 30px -10px rgba(255, 94, 146, 0.3)"
                            }}
                            whileTap={{ scale: 0.995 }}
                            transition={{ duration: 0.3 }}
                            className={`
                              bg-white border-2 rounded-2xl p-6 cursor-pointer
                              transition-all duration-300 relative overflow-hidden
                              ${isOpen ? "border-[#FF5E92] shadow-xl" : "border-gray-200 shadow-lg hover:shadow-xl"}
                            `}
                          >
                            {/* Background gradient effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-pink-50 to-white opacity-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : ''}`} />
                            
                            <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="flex-shrink-0">
                                  {faq.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
                                  {faq.question}
                                </h3>
                              </div>

                              <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.4, type: "spring" }}
                                className="flex-shrink-0 ml-4"
                              >
                                <FiChevronDown className="text-2xl text-[#FF5E92]" />
                              </motion.div>
                            </div>

                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                  animate={{ 
                                    opacity: 1, 
                                    height: "auto", 
                                    marginTop: 24 
                                  }}
                                  exit={{ 
                                    opacity: 0, 
                                    height: 0, 
                                    marginTop: 0 
                                  }}
                                  transition={{ 
                                    duration: 0.4,
                                    ease: "easeInOut"
                                  }}
                                  className="relative z-10"
                                >
                                  {/* Separator */}
                                  <div className="h-0.5 w-full bg-gradient-to-r from-[#FF5E92] via-pink-400 to-pink-200 rounded-full mb-6" />
                                  
                                  {/* Step-by-step content */}
                                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                                   
                                      Step-by-Step Guide:
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed text-base">
                                      {faq.answer}
                                    </p>
                                  </div>
                                  
                                  {/* Additional Tips */}
                                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                                    <h4 className="font-semibold text-pink-800 mb-1 text-sm">
                                       Quick Tip:
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                      {index <= 3 
                                        ? "Use the filter options in the top-right corner of each graph to customize your view and export data if needed."
                                        : index <= 6
                                        ? "Use the Export CSV feature to download user data for external analysis."
                                        : index <= 9
                                        ? "Regularly check the billing overview to monitor subscription renewals and expirations."
                                        : "Save your changes after editing any plan details to ensure they are applied correctly."
                                      }
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="text-gray-400 text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                      <p className="text-gray-500">Try searching with different keywords</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </section>

            {/* Additional Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-r from-[#FF5E92] to-pink-500 rounded-2xl p-8 text-center text-white"
            >
              <h3 className="text-2xl font-bold mb-3">Need More Help?</h3>
              <p className="text-pink-100 mb-6 text-lg">
                Can't find what you're looking for? Get instant help from our AI assistant or contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => setActiveView("ai")}
                  className="bg-white text-[#FF5E92] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 hover:scale-105"
                >
                  <FiMessageCircle className="text-lg" />
                  Ask VeredaAI
                </button>
                <button 
                  onClick={handleContactSupport}
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#FF5E92] transition-all duration-300 shadow-lg flex items-center justify-center gap-2 hover:scale-105"
                >
                  <FiMail className="text-lg" />
                  Contact Support
                </button>
              </div>
            </motion.div>

            {/* Footer with Developer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-center pt-8 border-t border-gray-200"
            >
              <p className="text-gray-500 text-sm">
                Developed by{" "}
                <span className="font-semibold text-[#FF5E92]">Vereda Technologies</span>
                , Patna © 2025
              </p>
              <p className="text-gray-400 text-xs mt-1">
                For technical support: himanshu@vereda.co.in | abhishek@vereda.co.in | sujeet@vereda.co.in
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="ai"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-screen flex flex-col"
          >
            {/* AI Chat Header */}
            <div className="bg-gradient-to-r from-[#FF5E92] to-pink-500 text-white p-6 shadow-lg">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setActiveView("manual")}
                      className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110"
                    >
                      <FiArrowLeft className="text-2xl" />
                    </button>
                    <div className="flex items-center gap-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <FiMessageCircle className="text-[#FF5E92] text-2xl" />
                      </motion.div>
                      <div>
                        <motion.h1
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-2xl font-bold"
                        >
                          VeredaAI
                        </motion.h1>
                        <motion.p
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-pink-100 text-sm"
                        >
                          Your Intelligent Dashboard Assistant
                        </motion.p>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Online</span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* AI Messages Area */}
            <div className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <AnimatePresence>
                    {aiMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="flex items-start gap-3 max-w-[80%]">
                          {message.type === 'ai' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-8 h-8 bg-gradient-to-r from-[#FF5E92] to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                            >
                              <FiMessageCircle className="text-white text-sm" />
                            </motion.div>
                          )}
                          <motion.div
                            className={`rounded-2xl p-4 ${
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-[#FF5E92] to-pink-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-800 border border-gray-200 shadow-sm'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* REMOVED TYPING ANIMATION - Using static text instead */}
                            <p className="text-sm whitespace-pre-wrap">{message.displayText || message.content}</p>
                            <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-pink-200' : 'text-gray-500'}`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </motion.div>
                          {message.type === 'user' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                            >
                              <FiUserCheck className="text-white text-sm" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FF5E92] to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <FiMessageCircle className="text-white text-sm" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
                          <div className="flex space-x-2">
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
                  <form onSubmit={handleAISubmit} className="flex gap-3">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Ask VeredaAI about dashboard features..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5E92] focus:border-transparent shadow-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!userInput.trim() || isTyping}
                      className="bg-gradient-to-r from-[#FF5E92] to-pink-500 text-white p-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <FiSend className="text-lg" />
                    </motion.button>
                  </form>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-gray-500 mt-2 text-center"
                  >
                    VeredaAI is trained on our complete FAQ knowledge base. For complex issues, contact support.
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}