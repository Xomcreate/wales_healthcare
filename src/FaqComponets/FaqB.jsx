import React, { useState } from 'react';

function FaqB() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How soon can we arrange care services to begin?",
      answer: "We can typically start care within 24 to 48 hours following your initial consultation. If you need urgent or emergency assistance, our team is prepared to mobilize even faster."
    },
    {
      question: "What background checks and training do your caregivers undergo?",
      answer: "Every caregiver on our team is fully licensed, rigorously reference-checked, and cleared through comprehensive background screenings. They also complete specialized training in elder care, safety protocols, and personalized health support."
    },
    {
      question: "How do your care plans and pricing structures work?",
      answer: "Our care plans are entirely customized based on your family's exact requirements and schedule. We provide clear, transparent pricing and will help you explore all available private insurance or public funding options."
    },
    {
      question: "What kinds of specialized medical care can be delivered at home?",
      answer: "We offer comprehensive professional nursing services, including chronic condition management, post-surgery recovery, medication tracking, wound care, and everyday personal assistance."
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