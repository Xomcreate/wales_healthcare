import React, { useState } from 'react';

function FaqC() {
  const [openSection, setOpenSection] = useState({ group: 0, index: 0 });

  const categories = [
    {
      category: "In-Home Care Essentials",
      faqs: [
        {
          question: "How soon can care services be set up?",
          answer: "We can usually get care started within 24 to 48 hours following your initial consultation and personalized care assessment."
        },
        {
          question: "Are your care schedules adaptable?",
          answer: "Yes, our in-home schedules are completely flexible and can be modified at any time as your family's routines or needs evolve."
        },
        {
          question: "Can your team coordinate with other facility staff?",
          answer: "Yes, we work closely alongside existing facility staff and outside medical practitioners to ensure clear communication and cohesive support."
        },
        {
          question: "What types of tasks are covered under standard home care?",
          answer: "Our standard home care covers everyday support like personal hygiene, friendly companionship, medication prompts, meal preparation, and general nursing assistance."
        }
      ]
    },
    {
      category: "Specialized Support Services",
      faqs: [
        {
          question: "What specific medical conditions do your specialized caregivers support?",
          answer: "We provide dedicated care plans customized for individuals managing Alzheimer's, various forms of dementia, stroke recovery, palliative care needs, and chronic illnesses."
        },
        {
          question: "Are 24/7 or live-in nursing professionals available?",
          answer: "Yes, we provide flexible options ranging from periodic hourly visits to full round-the-clock live-in nursing care depending on your medical situation."
        },
        {
          question: "How do you prepare and train your care team for complex needs?",
          answer: "Our care professionals undergo specialized education programs focusing heavily on memory support, advanced safety protocols, and compassionate patient management."
        },
        {
          question: "Can our specialized care plan change if health needs progress?",
          answer: "As health conditions shift, our clinical coordinators routinely evaluate and update your care framework to guarantee ongoing safety and comfort."
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
    <section className="bg-sky-50/60 py-16 lg:py-24 font-sans border-b border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {categories.map((cat, groupIndex) => (
          <div key={groupIndex} className="space-y-6">
            
            {/* Category Heading with Navy Blue color */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {cat.category}
            </h2>

            {/* Pill-shaped accordion list */}
            <div className="space-y-4">
              {cat.faqs.map((faq, itemIndex) => {
                const isOpen = openSection.group === groupIndex && openSection.index === itemIndex;
                return (
                  <div key={itemIndex} className="transition-all duration-300">
                    <button
                      onClick={() => toggleAccordion(groupIndex, itemIndex)}
                      className="w-full py-4 px-6 sm:px-8 rounded-full text-left flex items-center justify-between bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-950/20 transition-all cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-semibold tracking-wide pr-4">
                        {faq.question}
                      </span>
                      <span className={`w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-lg shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                        +
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-6 sm:px-8 py-5 mt-2 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm sm:text-base leading-relaxed shadow-sm animate-fadeIn">
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

export default FaqC;