import React from 'react'
import DementiaHero from './DementiaHero'
import DementiaAbout from './DementiaAbout'
import DementiaService from './DementiaService'
import DementiaMatters from './DementiaMatters'
import DementiaFaq from './DementiaFaq'
import HomeCareD from '../HomeComponets/HomeCareD'
import PersonalLast from '../PersonalComponets/PersonalLast'

function Dementia() {
  return (
   <>
    <div>
      <DementiaHero/>
      <DementiaAbout/>
      <DementiaService/>
      <DementiaMatters/>
      <DementiaFaq/>
      <HomeCareD/>
      <PersonalLast/>
    </div>
   </>
  )
}

export default Dementia
