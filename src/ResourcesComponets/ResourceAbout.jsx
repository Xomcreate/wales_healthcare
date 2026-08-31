import React, { useState } from 'react';

function ResourceAbout() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 12 total resource articles matching your style (showing 6 per page for 2 pages pagination)
  const resources = [
    {
      id: 1,
      title: "What Causes Alzheimer’s?",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
      category: "Memory Care"
    },
    {
      id: 2,
      title: "How Long Can a Person Live in Palliative Care?",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      category: "Palliative Care"
    },
    {
      id: 3,
      title: "Is Dementia Hereditary?",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
      category: "Dementia Support"
    },
    {
      id: 4,
      title: "What is Palliative Care?",
      image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800",
      category: "Specialized Nursing"
    },
    {
      id: 5,
      title: "Tips To Creating A Strong Partnership With Your Loved One’s Caregiver",
      image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=800",
      category: "Caregiver Advice"
    },
    {
      id: 6,
      title: "Introducing at Home Care to a Loved One",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
      category: "Home Care Guide"
    },
    {
      id: 7,
      title: "Understanding Home Care Funding Options in Ontario",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      category: "Financial Guidance"
    },
    {
      id: 8,
      title: "Recognizing Early Signs of Memory Loss and Cognitive Decline",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      category: "Senior Health"
    },
    {
      id: 9,
      title: "How to Prevent Caregiver Burnout While Supporting Family",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800",
      category: "Caregiver Wellness"
    },
    {
      id: 10,
      title: "Navigating Long-Term Care Placement vs. Staying at Home",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
      category: "Care Decisions"
    },
    {
      id: 11,
      title: "Creating a Safe and Accessible Home Environment for Seniors",
      image: "https://images.unsplash.com/photo-1586772713824-9b7726543b5a?auto=format&fit=crop&q=80&w=800",
      category: "Home Safety"
    },
    {
      id: 12,
      title: "The Benefits of Respite Care for Families and Patients",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
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

        {/* Resources Grid matching your exact style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((resource) => (
            <div 
              key={resource.id} 
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

              {/* Card Title Box matching your screenshot style */}
              <div className="p-6 bg-teal-50/40 flex-1 flex items-center">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                  {resource.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls (First / Next style) */}
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