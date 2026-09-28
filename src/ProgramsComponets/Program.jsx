import React from 'react'
import ProgramHero from './ProgramHero'
import ProgramsAbout from './ProgramsAbout'
import ProgramAchieve from './ProgramAchieve'
import HomeCareB from '../HomeComponets/HomeCareB'
import ProgramLast from './ProgramLast'

function Program() {
  return (
   <>
    <div>
      <ProgramHero/>
      <HomeCareB/>
      <ProgramsAbout/>
      <ProgramAchieve/>
      <ProgramLast/>
    </div>
   </>
  )
}

export default Program
