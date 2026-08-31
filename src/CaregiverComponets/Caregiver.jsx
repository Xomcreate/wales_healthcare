import React from 'react'
import CaregiverHero from './CaregiverHero'
import CaregiverAbout from './CaregiverAbout'
import HomeCareStories from '../HomeComponets/HomeCareStories'
import PersonalLast from '../PersonalComponets/PersonalLast'

function Caregiver() {
  return (
    <>
    <div>
      <CaregiverHero/>
      <CaregiverAbout/>
      <HomeCareStories/>
      <PersonalLast/>
    </div>
    </>
  )
}

export default Caregiver
