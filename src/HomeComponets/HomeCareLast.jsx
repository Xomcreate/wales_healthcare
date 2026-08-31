import React from 'react';
import { Link } from 'react-router-dom';

function HomeCareLast() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans bg-slate-100">
      
      {/* Background Image Layer with a lighter, transparent white overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS35fQugAPKKKb5zTo9r2I-R7_VZnPyXhSffOZ6HgL8yg&s=10" 
          alt="Professional caregiver smiling with elderly client" 
          className="w-full h-full object-cover"
        />
        {/* Lighter white overlay (bg-white/60) so the image shows through clearly */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
          Get started with homecare today
        </h2>

        {/* Subtext */}
        <p className="text-slate-700 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
          Our initial consultations are complimentary and obligation-free. Let's discuss how we can support your loved one.
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-center">
          <Link 
            to="/contact" 
            className="bg-slate-900 hover:bg-teal-700 text-white font-medium px-8 py-4 rounded-xl shadow-lg transition-all duration-300 text-base flex items-center gap-3 group"
          >
            Request A Care Assessment
            <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default HomeCareLast;