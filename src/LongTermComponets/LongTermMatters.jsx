import React from 'react'

function LongTermMatters() {
  return (
    <section className="relative bg-slate-900 py-12 lg:py-16 overflow-hidden font-sans border-b border-slate-800 text-center">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-50 pointer-events-none" 
        style={{
          backgroundImage: "url('https://i.pinimg.com/1200x/92/e8/c9/92e8c9a1b6e7017c9b0b4d5f30b16928.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Lighter semi-transparent slate overlay tint */}
      <div className="absolute inset-0 bg-slate-900/50 z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6">
          
          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Why It Matters
          </h2>

          {/* Description Text */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed max-w-3xl mx-auto font-normal drop-shadow">
            Long-term support enhances quality of life by ensuring residents receive consistent, personalized care and connection.
          </p>

          {/* Action Button styled in Teal */}
          <div className="pt-1">
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 px-7 rounded-full text-sm sm:text-base transition-all shadow-xl hover:shadow-teal-600/20"
            >
              <span>Learn more about long-term support options</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}

export default LongTermMatters