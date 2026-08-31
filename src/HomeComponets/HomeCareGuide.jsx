import React from 'react';
import { Link } from 'react-router-dom';

function HomeCareGuide() {
  const guides = [
    {
      title: "Empowering Growth: The Importance of Developmental Support",
      description: "In the journey of life, growth is not just a physical process but also a mental, emotional, and social one. Developmental support plays a crucial role in nurturing individuals...",
      readTime: "2-3 minutes",
      link: "/guides/developmental-support"
    },
    {
      title: "Exploring the Heart of Healthcare: Understanding the Role of a Personal Support Worker",
      description: "In the realm of healthcare, there are many unsung heroes whose contributions often go unnoticed despite their profound impact on the lives of individuals in need. Among these dedicated...",
      readTime: "3-4 minutes",
      link: "/guides/personal-support-worker"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid Layout: Left Title & Right Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 text-center lg:text-left">
            <span className="inline-block bg-teal-50 text-teal-700 font-medium px-3.5 py-1 rounded-full text-xs uppercase tracking-wider mb-3">
              Guidance Hub
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Helpful guides & resources
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
              Explore expert advice, articles, and educational insights to help you navigate your home care journey with confidence.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <Link 
                to="/resources" 
                className="bg-slate-900 hover:bg-teal-700 text-white font-medium px-7 py-3.5 rounded-xl shadow-sm transition-all duration-200 text-sm sm:text-base flex items-center gap-2.5 group"
              >
                Browse All Resources
                <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Column: Guide Cards */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {guides.map((guide, index) => (
              <Link 
                key={index}
                to={guide.link}
                className="group bg-slate-50/50 rounded-2xl p-6 sm:p-8 border border-slate-200/60 transition-all duration-300 hover:bg-white hover:border-teal-300 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 group-hover:text-teal-700 transition-colors mb-3">
                    {guide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {guide.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Read Time: <span className="text-slate-700 font-semibold">{guide.readTime}</span>
                  </span>
                  <span className="text-teal-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Article 
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

export default HomeCareGuide;