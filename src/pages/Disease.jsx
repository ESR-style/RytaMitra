import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Webcam from 'react-webcam';

const Disease = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Treatment suggestions database
  const treatments = {
    'Potato___Early_blight': {
      kn: [
        "ಮ್ಯಾಂಕೋಜೆಬ್ 2 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿನಲ್ಲಿ ಸಿಂಪಡಿಸಿ",
        "ರೋಗಗ್ರಸ್ತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ನಾಶಪಡಿಸಿ",
        "ಬೆಳೆಗಳ ನಡುವೆ ಸಾಕಷ್ಟು ಗಾಳಿ ಸಂಚಾರಕ್ಕೆ ಅವಕಾಶ ಮಾಡಿ"
      ],
      en: [
        "Spray Mancozeb 2g per liter of water",
        "Remove and destroy infected leaves",
        "Ensure proper air circulation between plants"
      ]
    },
    'Potato___Late_blight': {
      kn: [
        "ಮೆಟಾಲಾಕ್ಸಿಲ್ + ಮ್ಯಾಂಕೋಜೆಬ್ ಸಿಂಪಡಿಸಿ",
        "ನೀರಾವರಿಯನ್ನು ನಿಯಂತ್ರಿಸಿ",
        "ರೋಗ ನಿರೋಧಕ ತಳಿಗಳನ್ನು ಬಳಸಿ"
      ],
      en: [
        "Apply Metalaxyl + Mancozeb spray",
        "Control irrigation",
        "Use resistant varieties"
      ]
    },
    'Potato___healthy': {
      kn: [
        "ಆರೋಗ್ಯಕರ ಗಿಡ - ನಿಯಮಿತ ನೀರಾವರಿ ಮುಂದುವರಿಸಿ",
        "ಪೋಷಕಾಂಶಗಳ ನಿರ್ವಹಣೆ ಮಾಡಿ"
      ],
      en: [
        "Healthy plant - Continue regular watering",
        "Maintain nutrient management"
      ]
    },
    'Apple___Apple_scab': {
      kn: [
        "ಸ್ಟ್ರೆಪ್ಟೋಮೈಸಿನ್ ಸಲ್ಫೇಟ್ ಸಿಂಪಡಿಸಿ",
        "ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 0.5 ಗ್ರಾಂ ಕಾಪರ್ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಬೆರೆಸಿ",
        "ರೋಗಗ್ರಸ್ತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ಸುಡಿ"
      ],
      en: [
        "Spray with Streptomycin Sulphate",
        "Mix 0.5g Copper Oxychloride per liter of water",
        "Remove and burn infected leaves"
      ]
    },
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
      kn: [
        "ರೋಗಗ್ರಸ್ತ ಸಸ್ಯಗಳನ್ನು ತೆಗೆದುಹಾಕಿ ನಾಶಪಡಿಸಿ",
        "ಬಿಳ್ಳಿ ನೊಣಗಳನ್ನು ನಿಯಂತ್ರಿಸಲು ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಿ",
        "ನೈಲಾನ್ ಬಲೆಯನ್ನು ಬಳಸಿ ಕೀಟಗಳನ್ನು ತಡೆಯಿರಿ",
        "ರೋಗ ನಿರೋಧಕ ತಳಿಗಳನ್ನು ಬಳಸಿ"
      ],
      en: [
        "Remove and destroy infected plants",
        "Apply insecticide to control whiteflies",
        "Use nylon nets to prevent insect entry",
        "Plant resistant varieties"
      ]
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setShowCamera(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const predictDisease = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(image);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      const result = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await result.json();
      setPrediction({
        english: data.prediction,
        kannada: data.kannada_name,
        treatments: treatments[data.prediction] || {
          kn: ["ಚಿಕಿತ್ಸೆಯ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ"],
          en: ["Treatment information not available"]
        }
      });
    } catch (error) {
      console.error('Error:', error);
      setPrediction({
        english: "Error occurred during prediction",
        kannada: "ರೋಗ ಪತ್ತೆಯಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ",
        treatments: {
          kn: ["ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ"],
          en: ["Please try again"]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t('agriculture.disease.title')}</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="max-w-4xl mx-auto">
          {showCamera ? (
            <div className="relative rounded-lg overflow-hidden">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
              />
              <button
                onClick={captureImage}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                         px-6 py-2 bg-emerald-600 text-white rounded-lg 
                         flex items-center gap-2 hover:bg-emerald-700"
              >
                📸 {t('agriculture.disease.capture')}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {image ? (
                <div className="relative">
                  <img 
                    src={image} 
                    alt="Captured" 
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 
                             text-white rounded-full hover:bg-red-600"
                  >
                    ↺
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-emerald-200 rounded-lg p-8">
                  <div className="text-center">
                    <span className="text-4xl mb-4">🌿</span>
                    <p className="text-gray-600 mb-4">
                      {t('agriculture.disease.upload')}
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setShowCamera(true)}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg 
                                 flex items-center gap-2 hover:bg-emerald-700"
                      >
                        📸 {t('agriculture.disease.useCamera')}
                      </button>
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                                 flex items-center gap-2 hover:bg-blue-700"
                      >
                        📤 {t('agriculture.disease.uploadImage')}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {image && (
                <div className="flex justify-center">
                  <button
                    onClick={predictDisease}
                    disabled={loading}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-lg 
                             flex items-center gap-2 hover:bg-emerald-700
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🔍 {loading ? t('agriculture.disease.analyzing') : t('agriculture.disease.analyze')}
                  </button>
                </div>
              )}

              {prediction && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                    {t('agriculture.disease.results')}:
                  </h3>
                  <p className="text-lg font-medium mb-2">{prediction.kannada}</p>
                  <p className="text-gray-600 mb-4">{prediction.english}</p>

                  <div className="mt-6">
                    <h4 className="font-semibold text-emerald-800 mb-3">
                      {t('agriculture.disease.treatment')}:
                    </h4>
                    <div className="space-y-2">
                      {prediction.treatments.kn.map((treatment, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-emerald-100">
                          <p className="text-emerald-800">{treatment}</p>
                          <p className="text-gray-600 text-sm">{prediction.treatments.en[idx]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Disease;
