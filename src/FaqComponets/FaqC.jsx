import React, { useState } from 'react';

function FaqC() {
  const [openSection, setOpenSection] = useState({ group: 0, index: 0 });

  const categories = [
    {
      category: "In-Home Care",
      faqs: [
        {
          question: "How quickly can support be arranged?",
          answer: "Support can typically be arranged within 24 to 48 hours following your initial assessment and care planning consultation."
        },
        {
          question: "Is this service flexible?",
          answer: "Yes, our in-home care schedules are fully flexible and can be adjusted as your family's needs or routine changes."
        },
        {
          question: "Do you work with facility staff?",
          answer: "Yes, we collaborate closely with existing facility staff and external healthcare providers to ensure seamless, coordinated care."
        },
        {
          question: "What services are included in homecare?",
          answer: "Homecare includes personal daily assistance, companionship, medication reminders, meal preparation, and specialized nursing care."
        }
      ]
    },
    {
      category: "Specialized In-Home Care Services",
      faqs: [
        {
          question: "What conditions do your specialized caregivers support?",
          answer: "We provide tailored support for individuals dealing with Alzheimer's, dementia, stroke recovery, palliative needs, and chronic illnesses."
        },
        {
          question: "Are specialized nurses available around the clock?",
          answer: "Yes, we offer both hourly and 24/7 live-in specialized nursing care options to match medical requirements."
        },
        {
          question: "How do you train caregivers for specialized needs?",
          answer: "Our caregivers undergo rigorous specialized training programs focusing on memory care, safety protocols, and compassionate patient management."
        },
        {
          question: "Can specialized care plans be modified over time?",
          answer: "As medical conditions evolve, our clinical team regularly reviews and updates care plans to ensure optimal health and comfort."
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