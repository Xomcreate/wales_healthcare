import React, { useState, useEffect } from 'react';

function TestimonialSection() {
  const testimonials = [
    {
      quote: "Thank you so much for assigning Aminat and Miriam to my Mother care. Both of these women are outstanding caregivers. If Miriam hadn’t been able to get my Mom up and ready, and if Aminat hadn’t been able to assist her in getting in and out of the wheelchair, taxis, etc., we would not have been able to get Mom to the medical appointment today. I am not exaggerating. I would not have been able to manage on my own, and Mom would have missed extremely important medical attention. They were also able to provide very valuable feedback regarding how she has been recently, which contributed to the validity of the assessment.",
      author: "Claudia T."
    },
    {
      quote: "The level of professionalism and genuine warmth shown by the Wales Healthcare team has been life-changing for our family. Knowing that dependable, certified caregivers are there to support my father gives us ultimate peace of mind every single day.",
      author: "Robert M."
    },
    {
      quote: "Finding consistent, long-term support for a relative in a care facility used to feel overwhelming. Wales Healthcare bridged that gap seamlessly, providing wonderful advocacy and personalized attention that makes all the difference.",
      author: "Susan L."
    },
    {
      quote: "When we faced unexpected staffing shortages at our facility, Wales Healthcare responded immediately. Their deployed personnel integrated seamlessly with our existing team and maintained exceptional care quality without skipping a beat.",
      author: "Director of Care, Long-Term Care Facility"
    },
    {
      quote: "The 24/7 on-call support and compassionate approach truly sets them apart. Every caregiver who has visited our home treats my mother with the utmost dignity, respect, and kindness.",
      author: "David & Eleanor K."
    },
    {
      quote: "From Windsor to Ottawa, their commitment to reliable, high-standard healthcare is evident in everything they do. We are deeply grateful for their ongoing partnership and dedication.",
      author: "Administrator, Care Community"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section className="relative bg-[#1e293b] py-12 lg:py-16 overflow-hidden font-sans border-b border-slate-800">
      
      {/* Background Decorative Heart Outline SVG matching the visual style */}
      <div className="absolute -right-20 -top-20 pointer-events-none opacity-15">
        <svg className="w-100 h-100 sm:w-137.5 sm:h-137.5 text-teal-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Testimonial Card Container */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 relative border border-slate-100 transition-all duration-500">
          
          {/* Left Arrow Button */}
          <button 
            onClick={handlePrev}
            aria-label="Previous Testimonial"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-50 hover:bg-teal-50 border border-slate-200 text-teal-600 flex items-center justify-center transition-all shadow-sm hover:scale-105 z-20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button 
            onClick={handleNext}
            aria-label="Next Testimonial"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-50 hover:bg-teal-50 border border-slate-200 text-teal-600 flex items-center justify-center transition-all shadow-sm hover:scale-105 z-20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {/* Card Content Area */}
          <div className="max-w-3xl mx-auto text-center space-y-4 px-6 sm:px-10">
            
            {/* Quote Icon */}
            <div className="flex justify-center text-teal-600/40">
              <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Testimonial Quote */}
            <p className="text-slate-700 text-xs sm:text-sm lg:text-base leading-relaxed font-normal min-h-27.5 sm:min-h-23.75 flex items-center justify-center">
              "{testimonials[currentIndex].quote}"
            </p>

            {/* Author Name */}
            <div className="pt-1">
              <span className="inline-block font-bold text-slate-900 text-sm sm:text-base tracking-wide border-b-2 border-teal-500 pb-0.5">
                {testimonials[currentIndex].author}
              </span>
            </div>

          </div>

          {/* Pagination Indicators / Dots */}
          <div className="flex justify-center items-center space-x-2 pt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index 
                    ? 'w-5 h-2 bg-teal-600' 
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

export default TestimonialSection;