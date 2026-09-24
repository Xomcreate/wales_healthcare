import React from 'react';

function HomeCareD() {
  const services = [
    {
      title: "Personal Care",
      description: "Compassionate, hands-on help with daily hygiene, mobility, and safety in the comfort of home.",
      icon: "🤝"
    },
    {
      title: "Nursing Support",
      description: "Skilled care from licensed nurses, including medication management and regular health monitoring.",
      icon: "🩺"
    },
    {
      title: "Dementia Care",
      description: "Patient-centered support designed around the unique needs of those living with memory loss.",
      icon: "🧠"
    },
    {
      title: "Hospice / End-of-Life Care",
      description: "Gentle palliative care focused on comfort, dignity, and support for the whole family.",
      icon: "🕊️"
    },
    {
      title: "Companionship / Daily Support",
      description: "Friendly, consistent support that encourages independence, connection, and everyday wellbeing.",
      icon: "☀️"
    }
  ];

  return (
    <section className="bg-slate-50/50 py-16 lg:py-24 font-sans border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Care Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Care Tailored to <span className="text-teal-600">Every Need</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            From everyday support to specialized medical care, we're here for your family every step of the way.
          </p>
        </div>

        {/* 5-Column Straight Line Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white hover:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-5 group"
            >
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-12 h-12 bg-teal-50 group-hover:bg-teal-900/80 text-teal-600 group-hover:text-teal-400 rounded-xl flex items-center justify-center text-xl border border-teal-100 group-hover:border-teal-700/50 transition-colors duration-300 shadow-inner">
                  {service.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 group-hover:text-slate-300 text-xs sm:text-[13px] leading-relaxed transition-colors">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HomeCareD;