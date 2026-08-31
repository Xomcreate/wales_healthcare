import React from 'react'
import NursingHero from './NursingHero'
import NursingAbout from './NursingAbout'
import NursingService from './NursingService'
import NursingMatters from './NursingMatters'
import NursingFaq from './NursingFaq'
import HomeCareD from '../HomeComponets/HomeCareD'
import PersonalLast from '../PersonalComponets/PersonalLast'

function Nursing() {
  return (
   <>
    <div>
      <NursingHero/>
      <NursingAbout/>
      <NursingService/>
      <NursingMatters/>
      <NursingFaq/>
      <HomeCareD/>
      <PersonalLast/>

    


    </div>
   </>
  )
}

export default Nursing
