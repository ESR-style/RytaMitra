import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const useVoiceCommands = () => {
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const commandMaps = {
    'kn': {
      'ಮುಖ್ಯ ಪುಟ': '/',
      'ಲೆಕ್ಕ ತೋರಿಸು': '/transaction',
      'ಚಿತ್ರ ತೋರಿಸು': '/charts',
      'ದನದ ಲೆಕ್ಕ': '/cow',
      'ಕೋಳಿ ಲೆಕ್ಕ': '/chicken',
      'ಯೋಜನೆಗಳು': '/scheme',
      'ಸಾಲ': '/loan'
    },
    'te': {
      'డాష్‌బోర్డ్': '/',
      'లావాదేవీలు': '/transaction',
      'చార్ట్‌లు': '/charts',
      'ఆవు': '/cow',
      'కోడి': '/chicken',
      'పథకాలు': '/scheme',
      'రుణాలు': '/loan'
    },
    'ta': {
      'டாஷ்போர்டு': '/',
      'பரிவர்த்தனைகள்': '/transaction',
      'விளக்கப்படங்கள்': '/charts',
      'பசு': '/cow',
      'கோழி': '/chicken',
      'திட்டங்கள்': '/scheme',
      'கடன்கள்': '/loan'
    },
    'hi': {
      'डैशबोर्ड': '/',
      'लेनदेन': '/transaction',
      'चार्ट': '/charts',
      'गाय': '/cow',
      'मुर्गी': '/chicken',
      'योजनाएं': '/scheme',
      'ऋण': '/loan'
    }
  };

  const processCommand = (command) => {
    const cmd = command.toLowerCase();
    const currentCommands = commandMaps[i18n.language] || commandMaps['en'];
    
    Object.entries(currentCommands).forEach(([voiceCmd, path]) => {
      if (cmd.includes(voiceCmd.toLowerCase())) {
        navigate(path);
      }
    });
  };

  const startListening = () => {
    try {
      if (!('webkitSpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported');
      }

      recognitionRef.current = new window.webkitSpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = false;
      
      // Update recognition language based on current i18n language
      const langMap = {
        'kn': 'kn-IN',
        'te': 'te-IN',
        'ta': 'ta-IN',
        'hi': 'hi-IN',
        'en': 'en-IN'
      };
      
      recognition.lang = langMap[i18n.language] || 'en-IN';

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        processCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };

      recognition.start();
    } catch (error) {
      console.error('Speech recognition setup failed:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return { isListening, toggleListening };
};

export default useVoiceCommands;