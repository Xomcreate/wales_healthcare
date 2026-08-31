import React, { useState } from 'react';

function FaqD() {
  const [openSection, setOpenSection] = useState({ group: 0, index: 0 });

  const categories = [
    {
      category: "Specialized On-Site Services",
      faqs: [
        {
          question: "How quickly can support be arranged?",
          answer: "On-site and facility support personnel can often be deployed rapidly within 24 hours to cover urgent staffing needs."
        },
        {
          question: "Is this service flexible?",
          answer: "Yes, our facility staffing solutions adapt seamlessly to short-term shifts, emergency coverages, or long-term placements."
        },
        {
          question: "Do you work with facility staff?",
          answer: "Our professionals integrate smoothly with your existing internal teams, administrative leads, and nursing supervisors."
        },
        {
          question: "Is support ongoing?",
          answer: "We offer both temporary relief staffing and continuous, long-term on-site care contracts depending on facility demands."
        },
        {
          question: "How fast can staff be deployed?",
          answer: "For emergency requirements, our rapid response team coordinates immediate shift coverage across Ontario facilities."
        },
        {
          question: "Are caregivers trained for facility environments?",
          answer: "All deployed personnel undergo strict facility protocol training, compliance background checks, and professional credential reviews."
        }
      ]
    },
    {
      category: "On-Site Care",
      faqs: [
        {
          question: "What types of facilities do you support?",
          answer: "We provide qualified staff and support services to long-term care homes, assisted living facilities, and rehabilitation centers."
        },
        {
          question: "How do you ensure quality of care on-site?",
          answer: "We maintain consistent performance evaluations, supervisor check-ins, and open communication lines with facility management."
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