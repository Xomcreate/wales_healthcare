import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="relative bg-[#f0f9ff] text-slate-700 font-sans border-t border-slate-200/80 overflow-hidden">
      
      {/* Background Subtle Hand-Drawn Heart Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="footer-clean-heart" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M40 25 C35 15, 20 15, 15 25 C10 35, 20 45, 40 60 C60 45, 70 35, 65 25 C60 15, 45 15, 40 25 Z"
                fill="none"
                stroke="#0d9488"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.3"
                transform="scale(0.55) translate(20, 20)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-clean-heart)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        
        {/* Main 5-Column Grid Layout matching the reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 text-left">
          
          {/* Column 1: Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
              Contact
            </h3>
            
            <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-slate-800">Wales Healthcare Services Inc.</p>
              <p>220 Duncan Mill Rd, Suite 520</p>
              <p>North York, ON M3B 2V1</p>
            </div>

            <div className="pt-1 text-xs text-slate-600">
              <p>Hours: Open 24 hours</p>
            </div>

            <div className="pt-2 text-xs space-y-1">
              <p>
                <a href="tel:9057091767" className="text-slate-700 hover:text-teal-600 font-medium">
                  905-709-1767
                </a>
              </p>
              <p>
                <a href="mailto:info@waleshealthcare.ca" className="text-slate-700 hover:text-teal-600 font-medium">
                  info@waleshealthcare.ca
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
              Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/homecare/personal-care" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Personal Care
                </Link>
              </li>
              <li>
                <Link to="/homecare/nursing" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Nursing Support
                </Link>
              </li>
              <li>
                <Link to="/homecare/dementia-care" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Dementia Care
                </Link>
              </li>
              <li>
                <Link to="/homecare/hospice-care" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Hospice / End-of-Life Care
                </Link>
              </li>
              <li>
                <Link to="/homecare/companionship" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Companionship / Daily Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Facility Care */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
              Facility Care
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/facility/temporary-coverage" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Temporary and Short-Term Coverage
                </Link>
              </li>
              <li>
                <Link to="/facility/long-term-placement" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Long-Term Placement Support
                </Link>
              </li>
              <li>
                <Link to="/facility/emergency-staffing" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Emergency Staffing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
              Resources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/resources/guidance" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Guidance Hub
                </Link>
              </li>
              <li>
                <Link to="/about/stories" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Caregiver Stories
                </Link>
              </li>
              <li>
                <Link to="/resources/faq" className="text-slate-600 hover:text-teal-600 transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Company */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
              Company
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="text-slate-600 hover:text-teal-600 transition-colors">
                  About Wales Healthcare
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-600 hover:text-teal-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider Line */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-3 sm:space-y-0">
          <p>Serving Communities Across Ontario, From Windsor to Ottawa</p>
          <p>© Wales Healthcare. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  )
}

export default Footer