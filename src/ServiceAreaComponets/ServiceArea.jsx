import React from 'react';
import { Link } from 'react-router-dom';

function ServiceArea() {
  const regions = [
    {
      title: "Toronto & GTA",
      description: "Comprehensive home care, facility support, and senior care services across Toronto and surrounding Greater Toronto Area communities.",
      cities: ["North York", "Oshawa", "Pickering", "Richmond Hill", "Scarborough", "Stouffville", "Thornhill", "Toronto", "Vaughan", "Whitby"]
    },
    {
      title: "Peel Region & Surrounds",
      description: "Extensive care coverage and professional support throughout Southwestern Ontario communities.",
      cities: ["Brampton", "Caledon", "Etobicoke", "Mississauga"]
    },
    {
      title: "Southwestern & Central Ontario",
      description: "Reliable personal care, nursing, and relief staffing solutions spanning major regional hubs.",
      cities: ["Hamilton", "Ingersoll", "Kitchener", "Leamington", "London", "Sarnia", "St. Thomas", "Stratford", "Strathroy", "Tillsonburg", "Waterloo", "Windsor", "Woodstock"]
    },
    {
      title: "Niagara & Eastern Ontario",
      description: "Compassionate home care and resource support for families and organizations in the Niagara region and Ottawa area.",
      cities: ["Niagara Region", "Ottawa", "Surrounding Communities"]
    }
  ];

  return (
    <section className="bg-white py-16 lg:py-24 font-sans border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header - Text center on mobile, left-aligned on desktop */}
        <div className="text-center lg:text-left max-w-3xl mx-auto lg:mx-0 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Ontario-Wide Healthcare Coverage</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Where We <span className="text-teal-600">Provide Care</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Wales Healthcare is proud to deliver dependable personal care, home support, and emergency facility staffing across communities throughout Ontario.
          </p>
        </div>

        {/* Content Layout: Interactive Styled Grid & Real Interactive Map embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Real Map iframe embed */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 shadow-sm overflow-hidden relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-center lg:text-left">
                <h3 className="text-sm font-bold text-slate-900 flex items-center justify-center lg:justify-start space-x-2 w-full lg:w-auto">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                  <span>Interactive Coverage Map</span>
                </h3>
              </div>
              
              {/* Real Embedded Map iframe */}
              <div className="relative w-full h-90 sm:h-105 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                <iframe 
                  title="Ontario Coverage Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.463046757088!2d-79.38318432346985!3d43.65322595294371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34d681d18a3b%3A0x545c85344474773!2sToronto%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-25 contrast-105"
                ></iframe>
                
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-800 shadow-md">
                  📍 Windsor to Ottawa & Surrounding Regions
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Region City Lists Grid - Responsive text alignment */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {regions.map((region, index) => (
              <div 
                key={index} 
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-300 flex flex-col justify-between text-center lg:text-left"
              >
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-center lg:justify-start space-x-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    <span>{region.title}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {region.description}
                  </p>
                  <ul className="flex flex-wrap justify-center lg:justify-start gap-1.5 pt-2">
                    {region.cities.map((city, cIdx) => (
                      <li key={cIdx}>
                        <Link 
                          to="/contact"
                          className="inline-block bg-white border border-slate-200 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg shadow-2xs hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 transition-colors"
                        >
                          {city}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

export default ServiceArea;