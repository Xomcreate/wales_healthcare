import React from 'react'
import HospiceHero from './HospiceHero'
import HospiceAbout from './HospiceAbout'
import HospiceServices from './HospiceServices'
import HospiceMatters from './HospiceMatters'
import HospiceFaq from './HospiceFaq'
import HomeCareD from '../HomeComponets/HomeCareD'
import PersonalLast from '../PersonalComponets/PersonalLast'

function Hospice() {
  return (
   <>
    <div>
      <HospiceHero/>
      <HospiceAbout/>
      <HospiceServices/>
      <HospiceMatters/>
      <HospiceFaq/>
      <HomeCareD/>
      <PersonalLast/>
    </div>
   </>
  )
}

export default Hospice
