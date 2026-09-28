import React from 'react';
import { Link } from 'react-router-dom';

// Each program has an `href` that matches the Programs dropdown in Header.jsx
const programsData = [
  {
    id: 'psw',
    href: '/programs/nacc-psw-2022',
    title: 'NACC Personal Support Worker (PSW) Certificate Program',
    duration: '38 Weeks',
    type: 'Online + Classroom • Clinical Placement',
    description: 'Comprehensive training to provide compassionate personal care, safety, and daily support in healthcare facilities.',
    imageUrl: 'https://i.pinimg.com/736x/b5/70/cb/b570cb75b93e8ce58fbc96dcae990eeb.jpg'
  },
  {
    id: 'shelter',
    href: '/programs/shelter-support-worker',
    title: 'Shelter Support Worker Certificate Program',
    duration: '24 Weeks',
    type: 'Online + Classroom',
    description: 'Equip yourself with essential skills to support vulnerable individuals within community shelters and housing programs.',
    imageUrl: 'https://i.pinimg.com/1200x/50/f1/55/50f155bfa9d7d082e227bc306c80bacc.jpg'
  },
  {
    id: 'case-management',
    href: '/programs/intensive-case-management',
    title: 'Intensive Case Management for Addictions and Homelessness Certificate Program',
    duration: '30 Weeks',
    type: 'Online + Classroom • Field Placement',
    description: 'Advanced training in managing complex client cases involving addiction, mental health support, and homelessness.',
    imageUrl: 'https://i.pinimg.com/1200x/06/61/b1/0661b10289aabe5c66f892e04a3b7465.jpg'
  },
  {
    id: 'food-service',
    href: '/programs/food-service-worker',
    title: 'Food Service Worker Certificate Program',
    duration: '16 Weeks',
    type: 'Online + Classroom',
    description: 'Master institutional food preparation, nutrition planning, and sanitation standards for healthcare and care facilities.',
    imageUrl: 'https://i.pinimg.com/736x/fb/38/d6/fb38d6275e79aa3e2877627c45223b33.jpg'
  },
  {
    id: 'mental-health',
    href: '/programs/mental-health-addictions',
    title: 'Mental Health and Addictions Diploma Program',
    duration: '52 Weeks',
    type: 'Online + Classroom • Practicum',
    description: 'In-depth professional diploma focusing on counseling techniques, mental health support, and addiction recovery strategies.',
    imageUrl: 'https://i.pinimg.com/736x/c5/e0/58/c5e05891f6ab6a05ffa1ab2c43934929.jpg'
  },
  {
    id: 'child-youth',
    href: '/programs/child-youth-care',
    title: 'Child and Youth Care Worker Diploma Program',
    duration: '52 Weeks',
    type: 'Classroom + Field Placement',
    description: 'Specialized preparation to guide, support, and advocate for children and youth in residential, school, and community care.',
    imageUrl: 'https://i.pinimg.com/1200x/f8/ec/8e/f8ec8e5291dcad513c7c0b94e188cb1b.jpg'
  },
  {
    id: 'developmental-services',
    href: '/programs/developmental-services',
    title: 'Developmental Services Worker Diploma Program',
    duration: '52 Weeks',
    type: 'Online + Classroom • Clinical Placement',
    description: 'Empower individuals with developmental disabilities to live inclusive, independent, and fulfilling lives.',
    imageUrl: 'https://i.pinimg.com/736x/85/e2/1a/85e21a67f2535ca5bbd1dca256724e6f.jpg'
  }
];

function ProgramsAbout() {
  return (
    <section className="bg-white py-16 lg:py-24 font-sans border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-teal-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>Professional Career Pathways</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Our <span className="text-teal-600">Programs</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Kickstart your new career today at Wales Healthcare with industry-aligned training programs.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programsData.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Card Image Header (links to program page) */}
              <Link
                to={program.href}
                aria-label={`View ${program.title}`}
                className="block h-48 w-full bg-slate-100 relative overflow-hidden"
              >
                <img
                  src={program.imageUrl}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-teal-800 shadow-sm">
                  {program.duration}
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] font-medium tracking-wide text-teal-700 uppercase">
                    {program.type}
                  </p>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                    <Link to={program.href}>{program.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {program.description}
                  </p>
                </div>

                {/* Explore Button */}
                <div className="pt-2">
                  <Link
                    to={program.href}
                    className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 transition-colors shadow-sm"
                  >
                    Explore Program
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ProgramsAbout;