import React from 'react'
import DailyHero from './DailyHero'
import DailyAbout from './DailyAbout'
import DailyServices from './DailyServices'
import DailyMatters from './DailyMatters'
import DailyFaq from './DailyFaq'
import HomeCareD from '../HomeComponets/HomeCareD'
import PersonalLast from '../PersonalComponets/PersonalLast'

function Daily() {
  return (
   <>
    <div>
      <DailyHero/>
      <DailyAbout/>
      <DailyServices/>
      <DailyMatters/>
      <DailyFaq/>
      <HomeCareD/>
      <PersonalLast/>
    </div>
   </>
  )
}

export default Daily
