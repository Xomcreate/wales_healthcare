import React from 'react';

function ContactC() {
  return (
    <section className="relative bg-slate-900 py-12 lg:py-16 border-b border-slate-800 overflow-hidden font-sans">
      {/* Background Decorative Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] bg-size:16px_16px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full text-xs font-semibold text-teal-400">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Regional Coverage</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Serving Communities Across Ontario
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Wales Healthcare provides home care and relief staffing services across Ontario including the Greater Toronto Area, Peel Region, York Region, Hamilton, Southwestern Ontario, and surrounding communities.
          </p>
        </div>

        {/* Map Container Match Reference Style */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-800 p-2.5 sm:p-3 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative">
            
            {/* Map Frame / iframe Container - Height reduced to ~70% (approx 260px - 380px) */}
            <div className="relative w-full h-65 sm:h-80 lg:h-92.5 rounded-xl overflow-hidden bg-slate-900">
              <iframe
                title="Ontario Service Areas Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.4678833190117!2d-79.38318422346985!3d43.65322595293409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d2667d8d21%3A0x3563914588e360b3!2sToronto%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                className="w-full h-full border-0 filter contrast-105"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

          {/* Bottom Action Button matching the reference layout */}
          <div className="text-center mt-8">
            <a
              href="tel:09076084515"
              className="inline-flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-7 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-teal-500/20"
            >
              <span>View All Service Areas</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ContactC;