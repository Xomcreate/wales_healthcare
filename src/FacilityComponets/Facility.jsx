import React from 'react'
import FacilityHero from './FacilityHero'
import HomeCareB from '../HomeComponets/HomeCareB'
import HomeCareC from '../HomeComponets/HomeCareC'
import HomeCareD from '../HomeComponets/HomeCareD'
import FacilityMatters from './FacilityMatters'
import FacilitySupport from './FacilitySupport'
import HomeCareTrust from '../HomeComponets/HomeCareTrust'
import HomeCareService from '../HomeComponets/HomeCareService'
import FacilityFaq from './FacilityFaq'
import HomeCareStories from '../HomeComponets/HomeCareStories'
import HomeCareGuide from '../HomeComponets/HomeCareGuide'
import HomeCareLast from '../HomeComponets/HomeCareLast'

function Facility() {
  return (
   <>
    <div>
      <FacilityHero/>
      <HomeCareB/>
      <HomeCareC/>
      <HomeCareD/>
      <FacilityMatters/>
      <FacilitySupport/>
      <HomeCareTrust/>
      <HomeCareService/>
      <FacilityFaq/>
      <HomeCareStories/>
      <HomeCareGuide/>
      <HomeCareLast/>
    </div>
   </>
  )
}

export default Facility
