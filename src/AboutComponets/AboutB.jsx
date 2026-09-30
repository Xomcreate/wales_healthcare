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
                src="https://i.pinimg.com/736x/1c/e6/68/1ce66810219cdc6cc5013364a8dcf3b4.jpg"
                alt="Healthcare professional supporting a client at Wales Healthcare Services"
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
                  <p className="text-xs text-slate-600">Canadian Healthcare Partner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content (Centered Text) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-center flex flex-col items-center">
            
            {/* Top Tag */}
            <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-700">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Healthcare. Workforce & Education.</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Wales Healthcare Services Inc.
            </h2>

            {/* Paragraph 1 */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Wales Healthcare Services Inc. is a Canadian healthcare organization committed to providing compassionate, reliable, and person-centred healthcare services while supporting the development of a skilled and capable healthcare workforce.
            </p>

            {/* Paragraph 2 */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              We empower individuals, families, and care facilities by delivering exceptional clinical professionalism, dignity, and uncompromised respect tailored to unique personal and operational requirements.
            </p>

            {/* Paragraph 3 */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Through our core pillars of healthcare delivery and workforce education, we craft customized support solutions that promote safety, comfort, and enduring peace of mind across communities.
            </p>

            {/* Closing Tagline / Accent Box */}
            <div className="pt-2 w-full max-w-xl">
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl shadow-xs">
                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  At <span className="text-teal-600 font-bold">Wales Healthcare Services Inc.</span>, we’re more than a service provider—we’re your reliable partner in care continuity and workforce excellence.
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