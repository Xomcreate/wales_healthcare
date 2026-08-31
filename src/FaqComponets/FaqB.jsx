import React, { useState } from 'react';

function FaqB() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How quickly can you start providing care?",
      answer: "We can often initiate care services within 24 to 48 hours following an initial assessment. For urgent or emergency facility relief staffing, our team is equipped to respond even sooner."
    },
    {
      question: "What qualifications do your caregivers have?",
      answer: "All our care professionals are fully licensed, certified, reference-checked, and undergo extensive background screenings as well as specialized training in senior care and medical support."
    },
    {
      question: "What are the costs and payment options?",
      answer: "Our care plans are customized based on the level and frequency of support required. We offer transparent pricing structures and can guide you through available private and public funding options in Ontario."
    },
    {
      question: "What type of nursing care is provided at home?",
      answer: "We provide a wide range of professional medical care including chronic disease management, post-operative care, medication administration, wound care, and daily personal support."
    }
  ];

  return (
    <section className="bg-white py-16 lg:py-24 font-sans border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Frequently Asked <span className="text-teal-600">Questions</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Find immediate answers to common questions about our healthcare services and onboarding process.
          </p>
        </div>

        {/* Pill-shaped accordion list updated with navy blue styling */}
        <div className="space-y-4 pt-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`w-full py-4 px-6 sm:px-8 rounded-full text-left flex items-center justify-between shadow-md transition-all cursor-pointer ${
                    isOpen 
                      ? 'bg-slate-800 text-white shadow-slate-950/30' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-950/20'
                  }`}
                >
                  <span className="text-sm sm:text-base font-semibold tracking-wide pr-4">
                    {faq.question}
                  </span>
                  <span className={`w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-lg shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 py-5 mt-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-700 text-sm sm:text-base leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FaqB;