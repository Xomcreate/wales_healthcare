import React from 'react'
import PersonalCareHero from './PersonalCareHero'
import PersonalCareAbout from './PersonalCareAbout'
import PersonalServices from './PersonalServices'
import PersonalMatters from './PersonalMatters'
import PersonalFaq from './PersonalFaq'
import HomeCareD from '../HomeComponets/HomeCareD'
import PersonalLast from './PersonalLast'

function PersonalCare() {
  return (
   <>
    <div>
      <PersonalCareHero/>
      <PersonalCareAbout/>
      <PersonalServices/>
      <PersonalMatters/>
      <PersonalFaq/>
      <HomeCareD/>
      <PersonalLast/>
    </div>
   </>
  )
}

export default PersonalCare
