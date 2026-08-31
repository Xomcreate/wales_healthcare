import React from 'react';

function AboutB() {
  return (
    <section className="py-16 lg:py-24 bg-linear-to-b from-slate-50/50 to-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image with Modern Overlay Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 aspect-4/3 sm:aspect-16/11 group">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200"
                alt="Compassionate caregiver supporting a client at Wales Healthcare"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Trust Badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md border border-slate-200/60 p-4 rounded-2xl shadow-lg flex items-center space-x-3 text-left">
                <div className="w-10 h-10 bg-teal-50 border border-teal-500/20 rounded-xl flex items-center justify-center text-teal-600 font-bold text-lg">
                  ✦
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Committed Care</h4>
                  <p className="text-xs text-slate-600">Ontario-Wide Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content (Centered Text) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-center flex flex-col items-center">
            
            {/* Top Tag */}
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-700">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Dedicated Healthcare Excellence</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Compassionate Care Tailored to Your Unique Needs
            </h2>

            {/* Paragraph 1 */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Wales Healthcare is a trusted healthcare partner proudly serving families, communities, and care facilities across Ontario, from Windsor to Ottawa. 
            </p>

            {/* Paragraph 2 */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              We were founded with a simple yet powerful goal: to help people care for the ones they love with dignity, professionalism, and uncompromised respect. Our certified caregivers and healthcare professionals are dedicated to supporting clients and facilities every single day.
            </p>

            {/* Paragraph 3 */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              We believe that exceptional care is deeply personal. By taking the time to understand individual requirements and facility standards, we create customized solutions that promote safety, comfort, and peace of mind.
            </p>

            {/* Closing Tagline / Accent Box */}
            <div className="pt-2 w-full max-w-xl">
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl shadow-xs">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  At <span className="text-teal-600 font-bold">Wales Healthcare</span>, we’re more than a service provider—we’re your reliable partner in care.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutB;