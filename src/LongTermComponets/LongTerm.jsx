import React from 'react'
import LongTermHero from './LongTermHero'
import LongTermAbout from './LongTermAbout'
import LongTermServices from './LongTermServices'
import LongTermMatters from './LongTermMatters'
import LongTermFaq from './LongTermFaq'
import HomeCareD from '../HomeComponets/HomeCareD'
import PersonalLast from '../PersonalComponets/PersonalLast'

function LongTerm() {
  return (
   <>
    <div>
        <LongTermHero/>
        <LongTermAbout/>
        <LongTermServices/>
        <LongTermMatters/>
        <LongTermFaq/>
        <HomeCareD/>
        <PersonalLast/>
      
    </div>
   </>
  )
}

export default LongTerm
