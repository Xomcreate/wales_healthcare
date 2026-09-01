import React from 'react';

function PersonalLast() {
  return (
    // Immersive section featuring the image with a light transparent white overlay, reduced vertical height, centered text, and matching button color
    <section className="relative bg-white py-12 lg:py-16 overflow-hidden font-sans border-b border-slate-100 text-center">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=2000')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Very light transparent white overlay to maintain readability against the image */}
      <div className="absolute inset-0 bg-white/90 z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6">
          
          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
            Get started with personal care today
          </h2>

          {/* Description Text */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Our initial consultations are complimentary and obligation-free. Let’s discuss how we can support your loved one.
          </p>

          {/* Action Button (Background color matched to text-slate-950) */}
          <div className="pt-1">
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-slate-950 hover:bg-slate-800 text-white font-medium py-3 px-7 rounded-full text-sm sm:text-base transition-all shadow-xl hover:shadow-slate-950/20"
            >
              <span>Request A Care Assessment</span>
            </a>
          </div>

          {/* Inline Feature List with Dots */}
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:text-base text-slate-800 font-medium pt-1">
            <li>No Obligation</li>
            <li aria-hidden="true" className="text-slate-400">&bull;</li>
            <li>Confidential</li>
            <li aria-hidden="true" className="text-slate-400">&bull;</li>
            <li>Expert Guidance</li>
          </ul>

        </div>
      </div>
    </section>
  );
}

export default PersonalLast;