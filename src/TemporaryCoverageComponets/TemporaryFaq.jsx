import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function TemporaryFaq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How quickly can support be arranged?",
      answer: "Staff Relief Healthcare operates 24/7 to ensure timely support of our Clients and Team, however, to meet compliance under Ontario’s Personal Health Information Protection Act permission must first be granted to initiate a service, which can then be actioned within 24 hours of initial inquiry."
    },
    {
      question: "Is this service flexible?",
      answer: "Yes, care can be arranged for short durations as needed."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#eef2f6] font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-teal-50 text-teal-700 font-medium px-3.5 py-1 rounded-full text-xs uppercase tracking-wider mb-3">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Common questions about our temporary care services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Find quick answers regarding our swift deployment timelines, compliance, and service flexibility.
          </p>
        </div>

        {/* FAQ Grid Cards Layout (Set to 2 columns for the 2 items) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {faqData.map((item, index) => (
            <div 
              key={index}
              onClick={() => toggleFAQ(index)}
              className={`group bg-white/80 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
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
              
              {/* Expandable Answer */}
              {activeIndex === index && (
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-fadeIn text-center md:text-left">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer Action Button routed to Contact Page */}
        <div className="flex items-center justify-center">
          <Link 
            to="/faq" 
            className="bg-slate-900 hover:bg-teal-700 text-white font-medium px-7 py-3.5 rounded-xl shadow-sm transition-all duration-200 text-sm sm:text-base flex items-center gap-2.5 group"
          >
            View all FAQ
            <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default TemporaryFaq;