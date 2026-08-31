import React from 'react';
import { Link } from 'react-router-dom';

function TestimonialReview() {
  const reviews = [
    {
      name: "Claudia T.",
      role: "Family Member",
      avatarBg: "bg-teal-600",
      initial: "C",
      text: "The caregivers assigned to my mother were absolute professionals. They ensured she made it to her medical appointments safely and provided us with incredible peace of mind."
    },
    {
      name: "Robert M.",
      role: "Family Caregiver",
      avatarBg: "bg-slate-700",
      initial: "R",
      text: "Knowing that certified, dependable caregivers are there to support my father has been life-changing. The level of genuine warmth and reliability is unmatched."
    },
    {
      name: "Susan L.",
      role: "Facility Partner",
      avatarBg: "bg-teal-700",
      initial: "S",
      text: "When our facility faced staffing shortages, Wales Healthcare stepped in immediately. Their personnel integrated seamlessly and maintained our high standard of care."
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-linear-to-b from-white to-slate-50 font-sans border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Client Feedback & Experiences</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Trusted by Families and Care Facilities
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Read how our dedicated support and professional caregiving services make a meaningful difference every single day.
          </p>
        </div>

        {/* Clean Modern Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col justify-between hover:shadow-2xl hover:border-teal-200 transition-all duration-300 relative group"
            >
              <div className="space-y-4">
                
                {/* Star Ratings */}
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center space-x-3">
                <div className={`w-11 h-11 rounded-2xl ${review.avatarBg} text-white font-bold flex items-center justify-center shadow-md text-base`}>
                  {review.initial}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                  <p className="text-xs text-teal-600 font-medium">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Button routed to Contact Page */}
        <div className="flex justify-center">
          <Link
            to="/contact"
            className="bg-slate-900 hover:bg-teal-700 text-white font-medium px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-teal-500/25 transition-all duration-200 text-sm flex items-center space-x-2 group"
          >
            <span>Share Your Experience</span>
            <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default TestimonialReview;