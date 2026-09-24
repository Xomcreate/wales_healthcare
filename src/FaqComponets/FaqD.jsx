import React, { useState } from 'react';

function FaqD() {
  const [openSection, setOpenSection] = useState({ group: 0, index: 0 });

  const categories = [
    {
      category: "Specialized On-Site Services",
      faqs: [
        {
          question: "How quickly can your staff be dispatched to a facility?",
          answer: "Our staffing coordinators can mobilize qualified professionals within 24 hours to address urgent short-term coverage gaps."
        },
        {
          question: "Are your facility staffing agreements flexible?",
          answer: "Yes, our workforce solutions accommodate everything from single emergency shift coverages to extended seasonal or long-term contracts."
        },
        {
          question: "How well do your workers integrate with existing internal teams?",
          answer: "Our professionals are trained to collaborate smoothly alongside your core administrative leads, head nurses, and facility personnel."
        },
        {
          question: "Do you offer both temporary relief and long-term placement options?",
          answer: "Yes, we provide flexible arrangements ranging from immediate interim relief staff to stable, long-term on-site staffing partnerships."
        },
        {
          question: "What is your process for handling sudden, urgent scheduling needs?",
          answer: "Our rapid-response task force acts immediately to coordinate emergency shift coverage for healthcare facilities across Ontario."
        },
        {
          question: "Are your caregivers certified and prepared for institutional settings?",
          answer: "Every deployed team member undergoes rigorous orientation for institutional protocols, rigorous background checks, and license verification."
        }
      ]
    },
    {
      category: "On-Site Care",
      faqs: [
        {
          question: "Which types of healthcare facilities do you partner with?",
          answer: "We supply qualified nursing and support personnel to long-term care homes, assisted living communities, and specialized rehabilitation centers."
        },
        {
          question: "How do you maintain high quality standards while staff are on-site?",
          answer: "We uphold consistent performance reviews, regular supervisor touchpoints, and open communication channels with your facility management team."
        }
      ]
    }
  ];

  const toggleAccordion = (groupIndex, itemIndex) => {
    if (openSection.group === groupIndex && openSection.index === itemIndex) {
      setOpenSection({ group: null, index: null });
    } else {
      setOpenSection({ group: groupIndex, index: itemIndex });
    }
  };

  return (
    <section className="bg-slate-900 py-16 lg:py-24 font-sans border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {categories.map((cat, groupIndex) => (
          <div key={groupIndex} className="space-y-6">
            
            {/* Category Heading with Teal Accent / Border Treatment */}
            <div className="border-l-4 border-teal-500 pl-4">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {cat.category}
              </h2>
            </div>

            {/* Pill-shaped accordion list with refined dark slate & teal active styling */}
            <div className="space-y-4">
              {cat.faqs.map((faq, itemIndex) => {
                const isOpen = openSection.group === groupIndex && openSection.index === itemIndex;
                return (
                  <div key={itemIndex} className="transition-all duration-300">
                    <button
                      onClick={() => toggleAccordion(groupIndex, itemIndex)}
                      className={`w-full py-4 px-6 sm:px-8 rounded-full text-left flex items-center justify-between shadow-md transition-all cursor-pointer ${
                        isOpen 
                          ? 'bg-slate-800 text-white shadow-teal-950/20 border border-teal-500/40' 
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-950/20 border border-slate-800'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-semibold tracking-wide pr-4">
                        {faq.question}
                      </span>
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-transform duration-300 ${
                        isOpen ? 'bg-teal-600 text-white rotate-45 shadow-lg shadow-teal-600/30' : 'bg-white/10 text-white'
                      }`}>
                        +
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-6 sm:px-8 py-5 mt-2 bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-2xl text-slate-300 text-sm sm:text-base leading-relaxed shadow-inner animate-fadeIn">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}

export default FaqD;