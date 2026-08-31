import React from 'react'
import TestmonialHero from './TestmonialHero'
import TestimonialAbout from './TestimonialAbout'
import TestimonialSection from './TestimonialSection'
import TestimonialReview from './TestimonialReview'
import PersonalLast from '../PersonalComponets/PersonalLast'

function Testimonial() {
  return (
   <>
   
    <div>
      <TestmonialHero/>
      <TestimonialAbout/>
      <TestimonialSection/>
      <TestimonialReview/>
      <PersonalLast/>
    </div>
   </>
  )
}

export default Testimonial
