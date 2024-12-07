import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Ramanna = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const recognition = useRef(null);

  const genAI = new GoogleGenerativeAI('AIzaSyC2hmL7eWNB_TW5qCpFHNrtmJ0LVAaHzIs');
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  useEffect(() => {
    // Initialize speech recognition
    recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.current.lang = 'kn-IN';
    recognition.current.continuous = false;
    recognition.current.interimResults = false;

    recognition.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setMessages(prev => [...prev, { type: 'user', text: transcript }]);
      await getAIResponse(transcript);
    };

    recognition.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setIsListening(true);
    recognition.current.start();
  };

  const getAIResponse = async (userInput) => {
    setLoading(true);
    try {
      const prompt = `You are Ramanna, a helpful assistant who ONLY speaks Kannada. 
                     You must respond in Kannada script (ಕನ್ನಡ) only.
                     User's question: ${userInput}
                     Remember: Only use Kannada script in your response.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let aiResponse = response.text() || 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ.';
      
      // Clean up response to ensure only Kannada text
      aiResponse = aiResponse
        .replace(/[a-zA-Z]/g, '')
        .trim() || 'ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ, ದಯವಿಟ್ಟು ಮತ್ತೆ ಹೇಳಿ.';
      
      setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
      if (chatContainerRef.current) {
        setTimeout(() => {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }, 100);
      }
      speakResponse(aiResponse);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        text: 'ತಾಂತ್ರಿಕ ತೊಂದರೆ ಎದುರಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' 
      }]);
    }
    setLoading(false);
  };

  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'kn-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
      >
        <span>🎤</span>
        <span>ರಮಣ್ಣ</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 w-96 mt-2 bg-white rounded-lg shadow-xl border border-emerald-100 z-50">
          <div className="p-4 border-b border-emerald-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">ರಮಣ್ಣನೊಂದಿಗೆ ಮಾತನಾಡಿ</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
          </div>

          <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-emerald-100">
            <button
              onClick={startListening}
              disabled={isListening}
              className={`w-full px-4 py-2 rounded-lg ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isListening ? 'ಆಲಿಸುತ್ತಿದ್ದೇನೆ...' : 'ಮಾತನಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ramanna;
