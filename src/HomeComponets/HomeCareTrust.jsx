import React from 'react';

function HomeCareTrust() {
  const trustPoints = [
    {
      title: "Certified & Experienced Caregivers",
      description: "Trained professionals with extensive backgrounds in personal support, specialized health needs, and elder care."
    },
    {
      title: "Safety & Compliance Standards",
      description: "Rigorous protocols, comprehensive background checks, and adherence to top healthcare regulatory frameworks."
    },
    {
      title: "Personalized & Flexible Care Plans",
      description: "Tailored schedules and customized care strategies designed to match each unique client and family situation."
    },
    {
      title: "Emotional Support",
      description: "Compassionate companionship and dedicated care focused on preserving client dignity, comfort, and happiness."
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Outer Container using HomeCareC background color (#f3ecf7) and exact original layout design */}
        <div className="bg-[#f3ecf7] rounded-3xl py-12 px-6 sm:px-10 lg:px-16 shadow-inner relative overflow-hidden">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1b2a4e]">
              Why Families Trust Staff Relief
            </h2>
          </div>

          {/* 2x2 Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {trustPoints.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#1b2a4e] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeCareTrust;