import React from 'react';
import { Link } from 'react-router-dom';

// Each card has an image property. If left empty, a placeholder background image is used.
// To use your own real photos, provide paths like '/images/asist.jpg' or external URLs.
const trainings = [
  {
    title: 'A.S.I.S.T. \u2013 Suicide Intervention',
    description:
      'Learn to spot the signs that someone may be thinking about suicide and respond with confidence, care, and a clear, proven approach.',
    image: 'https://i.pinimg.com/1200x/da/fc/fa/dafcfa7b27d405d40a1e07e12bb8542d.jpg',
    to: '/certificates/asist',
  },
  {
    title: 'First Aid & CPR',
    description:
      'Build the life-saving skills to act quickly in a medical emergency, whether at home, at work, or out in the community.',
    image: 'https://i.pinimg.com/736x/05/3d/81/053d81260551dfcdc1a8f20450ddef4d.jpg',
    to: '/certificates/first-aid-cpr',
  },
  {
    title: 'De-escalation, Crisis Intervention & Conflict Resolution',
    description:
      'Gain the confidence to calm tense moments, support people in crisis, and work through conflict respectfully and professionally.',
    image: 'https://i.pinimg.com/736x/f7/b2/f8/f7b2f84f3c0737a48aadc5eb6099b9b8.jpg',
    to: '/certificates/crisis-intervention',
  },
  {
    title: 'Harm Reduction',
    description:
      'Explore practical, non-judgmental ways to support people who use substances, centred on safety, dignity, and access to help.',
    image: 'https://i.pinimg.com/236x/77/5b/78/775b78b22b184f95a3140a475e2f4507.jpg',
    to: '/certificates/harm-reduction',
  },
];

function CertAbout() {
  return (
    <section className="bg-white font-sans py-10 lg:py-14 border-b border-slate-100">
      {/* Intro */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-center">
          Training & Professional Development
        </h2>

        <div className="mt-5 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            At <span className="font-bold text-teal-600">Wales Healthcare</span>, we prepare learners, staff, and community partners to support others with confidence, respect, and care.
          </p>
          <p>
            Every training is hands-on, built around real scenarios, and guided by trauma-informed, person-centred principles.
          </p>
          <p>Explore some of our specialized trainings:</p>

          <ul className="space-y-1.5 text-slate-800 font-semibold">
            {trainings.map((t) => (
              <li key={t.title} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>{t.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Training cards with images */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trainings.map((t) => (
          <div
            key={t.title}
            className="relative h-72 sm:h-80 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group"
          >
            {/* Background Image with zoom on hover */}
            <img
              src={t.image}
              alt={t.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark gradient overlay so the text stays fully readable over any photo */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/50 to-slate-950/20" />

            {/* Content positioned at the bottom */}
            <div className="absolute inset-x-0 bottom-0 p-4 text-center space-y-2 z-10">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white">{t.title}</h3>
              <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">{t.description}</p>
              <Link
                to={t.to}
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold uppercase px-4 py-1.5 rounded transition-colors shadow-md"
              >
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CertAbout;