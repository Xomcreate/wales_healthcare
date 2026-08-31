import React from 'react'
import EmergencyHero from './EmergencyHero'
import EmergencyAbout from './EmergencyAbout'
import EmergencyServices from './EmergencyServices'
import EmergencyMatters from './EmergencyMatters'
import EmergencyFaq from './EmergencyFaq'
import HomeCareD from '../HomeComponets/HomeCareD'
import PersonalLast from '../PersonalComponets/PersonalLast'

function Emergency() {
  return (
    <>
    
    <div>
      <EmergencyHero/>
      <EmergencyAbout/>
      <EmergencyServices/>
      <EmergencyMatters/>
      <EmergencyFaq/>
      <HomeCareD/>
      <PersonalLast/>
    </div>
    </>
  )
}

export default Emergency
