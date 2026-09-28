import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const trainingInfo = {
  dates: ['September 26, 2026', 'October 31, 2026', 'November 28, 2026'],
  time: '10:00 AM \u2013 4:30 PM',
  delivery: 'In-Person',
  cost: '$150',
  location: '25 Tangiers Road, Unit 1, North York, ON M3J 2B1',
};

const modules = [
  {
    id: 1,
    title: 'Roles & Responsibilities of the First Aider',
    content:
      'Understand your role in an emergency, how to check the scene for safety, when to call 911, and the legal and ethical duties of a first aider, including consent and staying within your training.',
  },
  {
    id: 2,
    title: 'CPR & AED Basics',
    content:
      'Learn and practise chest compressions and rescue breaths on adults, children, and infants, and how to use an AED safely and confidently until paramedics arrive.',
  },
  {
    id: 3,
    title: 'Breathing Emergencies',
    content:
      'Recognize and respond to choking, asthma attacks, allergic reactions, and other situations where a person is struggling to breathe.',
  },
  {
    id: 4,
    title: 'Circulatory & Medical Emergencies',
    content:
      'Learn the signs of heart attack, stroke, shock, diabetic emergencies, and seizures, and the steps to take while waiting for professional help.',
  },
  {
    id: 5,
    title: 'Injuries & Environmental Emergencies',
    content:
      'Manage bleeding, wounds, fractures, burns, and head or spinal injuries, along with heat- and cold-related emergencies such as heat stroke and hypothermia.',
  },
];

const whyMatters = [
  'Maintain breathing and circulation',
  'Prevent a situation from getting worse',
  'Provide comfort and reassurance until paramedics arrive',
];

const participantRequirements = [
  'Comfort taking part in light physical activity (e.g., practising CPR on a mannequin).',
  'Ability to kneel, bend, and perform compressions, where possible.',
  'Willingness to complete both theory and practical components.',
];

const audience = [
  'PSW, DSW, FSW, ICM and other healthcare or community students',
  'Staff in community agencies, shelters, group homes, and long-term care',
  'Workplace teams that need First Aid & CPR for safety compliance',
  'Parents, caregivers, and anyone who wants to be prepared in an emergency',
];

const settings = [
  'Long-term care and retirement homes',
  'Group homes and supportive housing',
  'Shelters, drop-in centres, and outreach settings',
  'Schools, offices, factories, and community centres',
  'At home, with family, children, or older adults',
  'Faith communities and peer support spaces',
];

function Bullet({ children }) {
  return (
    <li className="flex items-start space-x-2">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function FirstAidAll() {
  const [openModule, setOpenModule] = useState(1);

  return (
    <div className="font-sans bg-white text-slate-800">
      {/* 1. Introduction, why it matters & requirements */}
      <section className="py-12 lg:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-slate-100">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            First Aid & CPR Training
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Emergencies can happen anywhere: at home, at work, in transit, and within healthcare or community settings.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            First Aid & CPR Training at Alpha Career College gives you clear, practical skills to respond quickly and calmly during medical emergencies. You'll practise step-by-step actions that can help save a life before professional help arrives.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Why this training matters</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            In many emergencies, the first person on the scene is not a doctor or nurse. It's a family member, a co-worker, a PSW, a shelter worker, or a passerby. Immediate, effective first aid and CPR can:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {whyMatters.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            This training supports safer workplaces, homes, and communities.
          </p>
        </div>

        <div className="bg-teal-50/50 border border-teal-200/60 rounded-2xl p-6 space-y-3">
          <h4 className="text-base font-bold text-teal-900">Participant requirements</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {participantRequirements.map((req) => (
              <Bullet key={req}>{req}</Bullet>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Training outline accordion */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Training Outline</h2>
            <div className="w-12 h-0.5 bg-teal-500 mx-auto mt-2 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              Five focused sessions combining theory and hands-on practice
            </p>
          </div>

          <div className="space-y-3">
            {modules.map((mod) => {
              const isOpen = openModule === mod.id;
              return (
                <div key={mod.id} className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setOpenModule(isOpen ? null : mod.id)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4 text-left font-semibold text-sm sm:text-base flex justify-between items-center gap-4 hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-teal-300">
                      Part {mod.id}: {mod.title}
                    </span>
                    <span className="text-slate-400 text-lg shrink-0">{isOpen ? '\u2212' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-700/60 pt-3 bg-slate-900/40">
                      {mod.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Training details */}
      <section className="relative py-16 bg-slate-950 text-white border-y border-slate-800">
        <div
          className="absolute inset-0 z-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2000')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-3">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Session Dates</h4>
                <div className="space-y-1 mt-1">
                  {trainingInfo.dates.map((d) => (
                    <p key={d} className="text-base font-bold text-white">{d}</p>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Time</h4>
                <p className="text-sm font-bold text-teal-300">{trainingInfo.time}</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-3">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Training Delivery</h4>
                <p className="text-base font-bold text-white">{trainingInfo.delivery}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Location</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{trainingInfo.location}</p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-center shadow-lg space-y-4">
              <div>
                <h4 className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase">Cost</h4>
                <p className="text-teal-400 font-bold text-2xl">{trainingInfo.cost}</p>
              </div>
              <Link
                to="/apply"
                className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-teal-500/20"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Who it is for & where to use it */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-slate-100 h-80">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
              alt="Participants taking part in First Aid & CPR training"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Who Is This Training For?
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                {audience.map((item) => (
                  <Bullet key={item}>{item}</Bullet>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-slate-900">Where you can use these skills</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                {settings.map((place) => (
                  <Bullet key={place}>{place}</Bullet>
                ))}
              </ul>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                These are transferable skills that are valued in many roles and settings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FirstAidAll;