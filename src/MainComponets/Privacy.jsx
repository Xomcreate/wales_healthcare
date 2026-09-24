import React from 'react';

function Privacy() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HERO SECTION */}
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
          <div className="max-w-xl mx-auto sm:mx-0 text-center sm:text-left space-y-4">
            
            {/* Title */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Privacy Policy & Information Security
            </h1>

            {/* Small Writeup */}
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              Your trust means everything to us. Learn how Wales Healthcare upholds rigorous confidentiality standards to protect and manage your personal and medical information.
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
            Protecting Your Confidential Information
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            At Wales Healthcare, we are deeply committed to maintaining absolute security and privacy across all personal and medical records entrusted to our care. Our privacy program strictly adheres to the Personal Information Protection and Electronic Documents Act (PIPEDA) alongside all applicable provincial and healthcare sector standards. Every inquiry is handled with the utmost discretion, ensuring that your details are utilized solely to provide exceptional home health and support services. Both our clients and care staff can rely on complete confidentiality.
          </p>
        </div>

        {/* Accountability */}
        <div className="space-y-4 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Team Accountability & Compliance
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every member of the Wales Healthcare team—including our care coordinators, field supervisors, administrative personnel, and executive leadership—is held strictly responsible for safeguarding your personal data. Our team regularly participates in privacy education sessions to guarantee continuous adherence to data protection guidelines across all regional operations.
          </p>
        </div>

        {/* What We Collect & Why */}
        <div className="space-y-4 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            What Data We Collect and Why We Need It
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We collect only the information necessary to plan, coordinate, and deliver customized support services safely. Our clinical coordinators conduct detailed health assessments in strict alignment with professional practice standards. We maintain proactive measures to ensure your files remain accurate and up to date. Furthermore, our website does not utilize invasive tracking cookies, and we never sell, lease, or distribute your email or contact information for external commercial marketing.
          </p>
        </div>

        {/* Your Rights & Permission */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900">Right to Access and Correct</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              You maintain the right to review your personal records and request updates or corrections for any inaccuracies, which our team will address promptly.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900">Informed Consent</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When onboarding begins, we provide a transparent Service Agreement detailing our assessment procedures and care delivery, giving you full control over shared information.
            </p>
          </div>
        </div>

        {/* Data Usage & Sharing */}
        <div className="space-y-4 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            How Information Is Used and Shared
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your personal details are restricted exclusively to the professional team members directly involved in your care plan. Internal evaluations and quality assurance reviews are conducted securely with anonymized records to uphold our high performance standards. We never disclose data for commercial profit. In exceptional legal situations, such as a formal court order or subpoena, we verify proper legal jurisdiction and share only the minimum required information.
          </p>
        </div>

        {/* Retention & Security Safeguards */}
        <div className="space-y-4 bg-teal-50/50 p-6 sm:p-8 rounded-3xl border border-teal-500/20">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Data Retention Periods and Security Safeguards
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            In compliance with healthcare regulations, we securely maintain archived client files for a minimum period of 7 years. Digital records are protected using robust firewalls, multi-factor authentication, and modern encryption technologies. Physical documentation is securely stored in on-site locked storage rooms equipped with alarm systems during non-business hours.
          </p>
        </div>

        {/* Contact & Inquiries Callout */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-3 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">Have Questions or Privacy Concerns?</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If you have questions, feedback, or concerns regarding our privacy practices, please contact the Wales Healthcare administrative team directly. We are dedicated to addressing all inquiries thoroughly and assisting you with any further guidance you may require.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Privacy;