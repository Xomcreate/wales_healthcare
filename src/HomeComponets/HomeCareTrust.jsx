import React from 'react';

function HomeCareTrust() {
  const trustPoints = [
    {
      title: "Certified & Experiences Caregivers",
      description: "Trained professionals with extensive backgrounds in personal care, dementia support, and specialized health needs."
    },
    {
      title: "Safety & Compliance Standards",
      description: "Recovery support following surgery, including wound care and mobility assistance."
    },
    {
      title: "Personalized & Flexible Care Plans",
      description: "Specialized support for memory loss, behavioral changes, and cognitive decline."
    },
    {
      title: "Emotional Support",
      description: "Compassionate care focused on comfort, dignity, and emotional support."
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