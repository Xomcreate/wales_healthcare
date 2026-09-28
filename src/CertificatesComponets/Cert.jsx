import React from 'react'
import HomeCareB from '../HomeComponets/HomeCareB'
import CertHero from '../CertificatesComponets/CertHero'
import CertAbout from '../CertificatesComponets/CertAbout'
import ProgramLast from '../ProgramsComponets/ProgramLast'
import HomeCareC from '../HomeComponets/HomeCareC'

function Cert() {
  return (
    <>
    <div>
      <CertHero/>
      <HomeCareB/>
      <HomeCareC/>
      <CertAbout/>
      <ProgramLast/>
    </div>
    </>
  )
}

export default Cert
