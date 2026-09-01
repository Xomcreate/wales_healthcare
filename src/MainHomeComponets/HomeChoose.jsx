import React from 'react';

function HomeChoose() {
  const features = [
    {
      title: "No Long Term Contracts",
      description: "No obligations or commitments. Start, pause, or adjust services whenever you need.",
      icon: (
        <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Complete Flexibility",
      description: "Customize your care schedule and services to fit your unique lifestyle and needs.",
      icon: (
        <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      title: "Professional Excellence",
      description: "Highly trained, certified caregivers committed to the highest standards of care.",
      icon: (
        <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "24/7 Availability",
      description: "Round-the-clock support and care coordination, whenever you need us most.",
      icon: (
        <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-slate-50/50 py-10 font-sans w-full">
      <div className="w-full max-w-325 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unique Layout with Centered Text */}
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Compact Image */}
            <div className="lg:col-span-4 relative h-80 sm:h-95 w-full overflow-hidden rounded-2xl shadow-md">
              <img 
                src="https://i.pinimg.com/736x/08/04/a7/0804a745798454281d5623c0758a2806.jpg" 
                alt="Caregiver holding senior client's hand" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-5">
                <p className="text-white text-xs font-medium tracking-wide">
                  Trusted by hundreds of families nationwide
                </p>
              </div>
            </div>

            {/* Right Column: Text and Features Centered */}
            <div className="lg:col-span-8 flex flex-col justify-center text-center">
              
              {/* Header Elements (Centered) */}
              <div className="mb-6 flex flex-col items-center">
                <div className="inline-block bg-teal-50 border border-teal-200 px-3 py-1 rounded-full text-teal-700 font-bold text-[11px] uppercase tracking-wider mb-2">
                  Why Choose Us
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Flexible care on your terms
                </h2>
              </div>

              {/* Compact 2x2 Feature Grid with text centered */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-center">
                {features.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-sky-50/50 hover:bg-sky-50 rounded-xl p-4 border border-sky-100/80 transition-colors flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeChoose;