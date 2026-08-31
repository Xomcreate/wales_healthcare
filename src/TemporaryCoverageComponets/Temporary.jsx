import React from 'react'
import TemporaryHero from './TemporaryHero'
import TemporaryAbout from './TemporaryAbout'
import TemporaryServices from './TemporaryServices'
import TemporaryMatters from './TemporaryMatters'
import TemporaryFaq from './TemporaryFaq'
import HomeCareD from '../HomeComponets/HomeCareD'
import PersonalLast from '../PersonalComponets/PersonalLast'

function Temporary() {
  return (
   <>
    <div>
      <TemporaryHero/>
      <TemporaryAbout/>
      <TemporaryServices/>
      <TemporaryMatters/>
      <TemporaryFaq/>
      <HomeCareD/>
      <PersonalLast/>
    </div>
   </>
  )
}

export default Temporary
