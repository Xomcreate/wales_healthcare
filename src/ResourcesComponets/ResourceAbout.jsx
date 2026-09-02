import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ResourceAbout() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // All 12 guide articles with their correct routes
  const resources = [
    {
      id: 1,
      slug: "guides/developmental-support",
      title: "Empowering Growth: The Importance of Developmental Support?",
      image: "https://i.pinimg.com/1200x/f2/91/8d/f2918dba9993260327d6b33966a5b786.jpg",
      category: "Memory Care"
    },
    {
      id: 2,
      slug: "guides/personal-support-worker",
      title: "Exploring the Heart of Healthcare: Understanding the Role of a Personal Support Worker?",
      image: "https://i.pinimg.com/1200x/43/a0/a8/43a0a89ee12726845cf8fb46aa27e1fb.jpg",
      category: "Palliative Care"
    },
    {
      id: 3,
      slug: "guides/caregiver-role",
      title: "Understanding the Role of a Live-In Caregiver: Enhancing Quality of Life and Supportive Care?",
      image: "https://i.pinimg.com/1200x/2a/f7/df/2af7dfe113fe7cdc2e9ee9d9e14dddd0.jpg",
      category: "Dementia Support"
    },
    {
      id: 4,
      slug: "guides/alzheimer-guide",
      title: "A Comprehensive Guide to Alzheimer’s Care at Home?",
      image: "https://plus.unsplash.com/premium_photo-1674855780695-b5d5c3e86b88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWx6aGVpbWVyLWd1aWRlJTIwZm9yJTIwYWdlZHxlbnwwfHwwfHx8MA%3D%3D",
      category: "Specialized Nursing"
    },
    {
      id: 5,
      slug: "guides/caregivertips",
      title: "Tips To Creating A Strong Partnership With Your Loved One’s Caregiver",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800",
      category: "Caregiver Advice"
    },
    {
      id: 6,
      slug: "guides/introducing-at-home-care",
      title: "Introducing at Home Care to a Loved One",
      image: "https://i.pinimg.com/736x/89/98/71/899871329cc624b7ee7b17440bf4e20f.jpg",
      category: "Home Care Guide"
    },
    {
      id: 7,
      slug: "guides/funding-options",
      title: "Understanding Home Care Funding Options in Ontario",
      image: "https://i.pinimg.com/1200x/13/af/97/13af97e75d92cd1c1c58832c34991237.jpg",
      category: "Financial Guidance"
    },
    {
      id: 8,
      slug: "guides/memory-loss",
      title: "Recognizing Early Signs of Memory Loss and Cognitive Decline",
      image: "https://i.pinimg.com/736x/b2/59/60/b25960f1a4f07d773f60e56200e3456e.jpg",
      category: "Senior Health"
    },
    {
      id: 9,
      slug: "guides/parentgiver",
      title: "How to Prevent Caregiver Burnout While Supporting Family",
      image: "https://plus.unsplash.com/premium_photo-1663089870095-c231a534ac31?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fG51cnNpbmclMjBob21lfGVufDB8fDB8fHww",
      category: "Caregiver Wellness"
    },
    {
      id: 10,
      slug: "guides/longtime",
      title: "Navigating Long-Term Care Placement vs. Staying at Home",
      image: "https://i.pinimg.com/736x/3a/1c/77/3a1c773fc4626be14f214934eeb1caad.jpg",
      category: "Care Decisions"
    },
    {
      id: 11,

      slug: "guides/safespace",
      title: "Creating a Safe and Accessible Home Environment for Seniors",
      image: "https://images.unsplash.com/photo-1762955911769-d652ceaa94bb?q=80&w=821&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Home Safety"
    },
    {
      id: 12,
      slug: "guides/respitecare",
      title: "The Benefits of Respite Care for Families and Patients",
      image: "https://images.unsplash.com/photo-1765896387403-3e6e0e44d7cc?q=80&w=1421&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Respite Support"
    }
  ];

  // Pagination calculations
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = resources.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <section className="relative bg-white py-12 lg:py-20 font-sans border-b border-slate-100 overflow-hidden">
      
      {/* Background Star / Heart SVG Pattern Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="heart-stars-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 5L36.5 18.5L51.5 20.5T40.5 31.5L43 46.5L30 39.5L17 46.5L19.5 31.5L8.5 20.5L23.5 18.5Z" fill="none" stroke="#14b8a6" strokeWidth="1" strokeOpacity="0.25" transform="scale(0.4) translate(10, 10)" />
              <path d="M30 45C30 45 50 32 50 20C50 12 43 7 36 12C30 17 30 20 30 20C30 20 30 17 24 12C17 7 10 12 10 20C10 32 30 45 30 45Z" fill="none" stroke="#14b8a6" strokeWidth="1" strokeOpacity="0.25" transform="scale(0.35) translate(80, 40)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heart-stars-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Top Intro Section */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-700">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Guidance & Resources Hub</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Navigating Care Decisions with Confidence
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Choosing care for yourself or a loved one can feel overwhelming. Our Guidance & Resources hub is designed to provide helpful, practical information on home care services, funding options, caregiver support, and navigating care decisions in Ontario. Whether you’re just starting your research or looking for specific answers, you’ll find trusted insights to help you move forward with confidence.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((resource) => (
            <Link 
              key={resource.id} 
              to={`/${resource.slug}`}
              className="bg-slate-50 border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Card Image Container */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-200">
                <img 
                  src={resource.image} 
                  alt={resource.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-teal-800 shadow-xs">
                  {resource.category}
                </div>
              </div>

              {/* Card Title Box */}
              <div className="p-6 bg-teal-50/40 flex-1 flex items-center">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                  {resource.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pt-6 flex items-center justify-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
              currentPage === 1 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-700 border border-slate-200'
            }`}
          >
            ← First / Previous
          </button>

          <span className="text-xs sm:text-sm font-medium text-slate-600">
            Page <span className="font-bold text-teal-600">{currentPage}</span> of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
              currentPage === totalPages 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-500/20'
            }`}
          >
            Next Page →
          </button>
        </div>

      </div>
    </section>
  );
}

export default ResourceAbout;