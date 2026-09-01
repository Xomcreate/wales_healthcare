import React from 'react';

function CareerD() {
  return (
    <section className="py-16 lg:py-24 bg-white font-sans border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Two-Column Grid Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image */}
          <div className="relative w-full">
            <img
              // Using a high-quality relevant Unsplash image 
              src="https://i.pinimg.com/736x/1d/c5/da/1dc5dae45b5c254b053be333e87f7246.jpg"
              alt="Compassionate caregiver smiling with a senior patient"
              className="w-full h-auto max-h-125 object-cover rounded-3xl shadow-lg"
            />
          </div>

          {/* Right Column: Text Content & Actions */}
          <div className="space-y-6 text-left">
            
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Join A Team You Can Be Proud Of
            </h2>
            
            <p className="text-base text-slate-700 leading-relaxed">
              With decades of experience and a strong reputation across Ontario, Wales Healthcare offers stability, professionalism, and meaningful career opportunities. When you join our team, you become part of an organization known for quality standards, strong leadership, and a commitment to doing care the right way.
            </p>
            
            {/* Bulleted List */}
            <ul className="list-disc pl-5 space-y-3 text-slate-700 text-sm sm:text-base font-medium marker:text-teal-600">
              <li>25+ years serving Ontario communities</li>
              <li>700+ caregivers across the province</li>
              <li>Established relationships with families and healthcare organizations</li>
              <li>Commitment to respectful, professional care environments</li>
            </ul>
            
            {/* Action Buttons (Pill shape to match screenshot) */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#about"
                className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-7 py-3 rounded-full text-sm transition-all shadow-md hover:shadow-teal-500/25"
              >
                Learn More About Wales Healthcare
              </a>
              <a
                href="#service-areas"
                className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-900 text-white font-semibold px-7 py-3 rounded-full text-sm transition-all shadow-md"
              >
                View Service Areas
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default CareerD;