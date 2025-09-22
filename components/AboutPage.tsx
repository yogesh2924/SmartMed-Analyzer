
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-brand-blue mb-6 text-center">About MediScan ℹ️</h2>
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="text-8xl">👵👴</div>
        <p className="text-lg text-gray-700">
          We know that reading small print on prescriptions and medicine boxes can be tough. 
          This application was created with our beloved seniors in mind, to make healthcare easier and safer.
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-brand-green mb-2">📄 Scan Prescription</h3>
          <p className="text-gray-600">
            Simply take a picture of your prescription. The app saves it and shows you the medicine name, dosage, and when to take it in a clear, large format.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-brand-yellow mb-2">💊 Verify Medicine</h3>
          <p className="text-gray-600">
            After scanning your prescription, you can scan any of your medicine boxes. We'll check if it matches what your doctor prescribed, helping you avoid mistakes.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-orange-500 mb-2">🥗 Check Your Food</h3>
          <p className="text-gray-600">
              Curious about your meal? Scan your food to get a simple breakdown of its nutritional content, like sugar, fat, and protein.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-brand-blue mb-2">🔊 Voice Assistant</h3>
          <p className="text-gray-600">
            For extra help, press the voice button! A clear, slow voice will read all the information aloud, so you don't have to strain your eyes.
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-center text-lg font-semibold text-brand-dark">
        Your health is important. We're here to help you manage it with confidence and ease.
      </p>
    </div>
  );
};

export default AboutPage;
