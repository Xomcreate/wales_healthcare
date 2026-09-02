import React from 'react';

function Privacy() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION (Matched to your DevelopmentalSupport style) */}
      <section className="relative bg-slate-900 text-white py-12 lg:py-20 overflow-hidden font-sans border-b border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/1200x/87/17/b3/8717b3f86187d2b5d04d2022b267bbdf.jpg"
            alt="Privacy Policy Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Responsive Overlay */}
          <div className="absolute inset-0 bg-teal-950/40 sm:bg-linear-to-r sm:from-teal-950/60 sm:via-teal-950/20 sm:to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          {/* Centered on mobile, left-aligned from small screens up */}
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            
            {/* Title */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Privacy Policy & Data Security
            </h1>

            {/* Small Writeup */}
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Your trust is our priority. Discover how Wales Healthcare strictly protects, handles, and secures your personal and medical information.
            </p>

          </div>
        </div>
      </section>

      {/* 2. MAIN POLICY CONTENT SECTION */}
      <section className="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Our Commitment */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-700 mx-auto sm:mx-0">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Our Commitment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Safeguarding Your Personal Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Wales Healthcare is deeply dedicated to maintaining the absolute confidentiality and security of all personal and medical information entrusted to us. Our privacy framework complies with the Personal Information Protection and Electronic Documents Act (PIPEDA) alongside all provincial and professional healthcare standards. Every inquiry is handled with the utmost respect and privacy, ensuring your data is used exclusively to deliver exceptional home health care services. Both clients and caregivers can expect the highest standards of privacy regarding their personal details.
          </p>
        </div>

        {/* Accountability */}
        <div className="space-y-4 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Our Organizational Accountability
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every member of the Wales Healthcare team—including coordinators, schedulers, administrators, officers, and directors—is held strictly accountable for keeping your personal data in the strictest confidence. Our team undergoes comprehensive training on current privacy practices to ensure continuous compliance and protection across all operations.
          </p>
        </div>

        {/* What We Collect & Why */}
        <div className="space-y-4 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Information We Collect & Its Purpose
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We only request information that is directly necessary to design, coordinate, and deliver your specialized care. Our nursing coordinators perform thorough health evaluations in alignment with provincial professional licensing standards. We take active measures to keep your records accurate and current. Additionally, our website does not use tracking cookies, and we never sell, rent, or distribute your email address or contact details for unsolicited promotional marketing.
          </p>
        </div>

        {/* Your Rights & Permission */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900">Right to Correct Information</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have the full right to contact us to update or correct any errors or omissions in your personal records, and we will execute updates promptly.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900">Expressed Consent</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When care commences, we ask you to sign a Service Agreement providing clear written consent for assessments and care services, including specifying any restrictions on information sharing.
            </p>
          </div>
        </div>

        {/* Data Usage & Sharing */}
        <div className="space-y-4 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            How Your Data is Used & Shared
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your information is restricted exclusively to your multidisciplinary care team members involved directly in your treatment. Internal reviews and quality improvement audits are conducted securely without referencing specific identities to maintain high performance standards. Information is never shared for commercial purposes. In rare legal scenarios—such as a court order or subpoena—we verify lawful authority and disclose only the absolute minimum required data.
          </p>
        </div>

        {/* Retention & Security Safeguards */}
        <div className="space-y-4 bg-teal-50/50 p-6 sm:p-8 rounded-3xl border border-teal-500/20">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Data Retention and Advanced Security Safeguards
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            In accordance with regulations, we securely retain discontinued client records for a minimum of 7 years. Electronic information is strictly protected by advanced firewalls, strict user authentication, and secure encryption. Physical files are stored securely on-site within restricted-access office areas, featuring alarmed protection during off-hours.
          </p>
        </div>

        {/* Contact & Inquiries Callout */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-3 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">Questions or Privacy Concerns?</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If you have any questions, complaints, or require further information regarding our privacy practices, please reach out directly to the Wales Healthcare office. We are committed to investigating all inquiries thoroughly and working collaboratively with you, including assisting you in contacting your provincial Privacy Commissioner's Office if needed.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Privacy;