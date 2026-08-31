import React, { useState } from 'react';

function HomeTestimonials() {
  const testimonials = [
    {
      text: "The caregivers assigned to my mother were truly outstanding, professional, and compassionate. They ensured she never missed her essential medical appointments and kept us well-informed throughout.",
      author: "Claudia T"
    },
    {
      text: "The care and compassion shown by the entire team have been nothing short of extraordinary. They treated our family like their own and gave us complete peace of mind.",
      author: "David M"
    },
    {
      text: "Finding reliable and professional care seemed impossible until we connected with this agency. The caregivers are punctual, warm, and highly skilled.",
      author: "Sarah L"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative bg-[#EBF4FA] py-12 lg:py-16 font-sans overflow-hidden w-full">
      
      {/* Background Decorative Outline Heart Shape */}
      <div className="absolute right-10 -bottom-10 pointer-events-none opacity-15 text-purple-400">
        <svg className="w-87.5 h-87.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>

      <div className="relative w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-teal-700 uppercase block mb-2">
          Family Testimonials
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-8">
          Hear from families we've helped
        </h2>

        {/* Testimonial Card Wrapper with Navigation Arrows */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/60 mb-8">
          
          {/* Left Arrow Button */}
          <button 
            onClick={prevSlide}
            className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-sky-600 hover:text-sky-800 p-2 focus:outline-none transition-colors"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button 
            onClick={nextSlide}
            className="absolute right-3 sm:right-5 top-1/2 transform -translate-y-1/2 text-sky-600 hover:text-sky-800 p-2 focus:outline-none transition-colors"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Quote Content Area */}
          <div className="max-w-3xl mx-auto px-6 sm:px-10">
            
            {/* Quote Icon */}
            <div className="text-purple-300 flex justify-center mb-4">
              <svg className="w-8 h-8 transform rotate-180" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Testimonial Text */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed mb-6">
              {testimonials[currentIndex].text}
            </p>

            {/* Author */}
            <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {testimonials[currentIndex].author}
            </h4>

          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? 'bg-sky-600 w-5' : 'bg-slate-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>

        {/* Action Button */}
        <div>
          <button className="bg-[#132A3E] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-700">
            Read More Family Stories
          </button>
        </div>

      </div>
    </section>
  );
}

export default HomeTestimonials;