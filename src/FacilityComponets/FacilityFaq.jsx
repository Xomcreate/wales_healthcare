import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FacilityFaq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "Are your facility support services structured on an ongoing basis?",
      answer: "Yes, our support services are fully customizable for long-term consistency and seamless continuity of care. We maintain flexible arrangements with absolutely zero cancellation fees or penalties, operating 7 days a week including weekends and holidays."
    },
    {
      question: "How rapidly can care professionals be deployed?",
      answer: "We mobilize with maximum urgency depending on clinical skill sets and immediate care facility availability. Establishing proactive contingency plans with our team further streamlines rapid response times when sudden needs arise."
    },
    {
      question: "Are caregivers specifically certified for institutional care environments?",
      answer: "Absolutely. Every member of our care team meets or exceeds strict Ministry of Long-Term Care standards—rigorously trained in resident rights, rigorous infection control protocols, professional licensing, and specialized institutional safety."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-teal-50 text-teal-700 font-medium px-3.5 py-1 rounded-full text-xs uppercase tracking-wider mb-3">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Common questions about our specialized facility care
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Find transparent answers regarding care continuity, rapid staffing deployment, and our rigorous professional training standards.
          </p>
        </div>

        {/* FAQ Grid Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {faqData.map((item, index) => (
            <div 
              key={index}
              onClick={() => toggleFAQ(index)}
              className={`group bg-slate-50/50 rounded-xl p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                activeIndex === index 
                  ? 'bg-white border-teal-300 shadow-md ring-2 ring-teal-50' 
                  : 'border-slate-200/60 hover:bg-white hover:border-teal-200 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 md:gap-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  {item.question}
                </h3>
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${
                  activeIndex === index 
                    ? 'bg-teal-600 text-white rotate-45' 
                    : 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white'
                }`}>
                  +
                </span>
              </div>
              
              {/* Expandable Answer with Responsive Text Alignment */}
              {activeIndex === index && (
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-fadeIn text-center md:text-left">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer Action Button routed to FAQ Page */}
        <div className="flex items-center justify-center">
          <Link 
            to="/faq" 
            className="bg-slate-900 hover:bg-teal-700 text-white font-medium px-7 py-3.5 rounded-xl shadow-sm transition-all duration-200 text-sm sm:text-base flex items-center gap-2.5 group"
          >
            Explore Complete FAQ Hub
            <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FacilityFaq;