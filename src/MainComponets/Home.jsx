import React from 'react'
import HomeHero from '../MainHomeComponets/HomeHero'
import HomeAbout from '../MainHomeComponets/HomeAbout'
import HomeLogo from '../MainHomeComponets/HomeLogo'
import HomeServices from '../MainHomeComponets/HomeServices'
import HomeChoose from '../MainHomeComponets/HomeChoose'
import HomeWork from '../MainHomeComponets/HomeWork'
import HomeServe from '../MainHomeComponets/HomeServe'
import HomeCareFaq from '../HomeComponets/HomeCareFaq'
import HomeTestimonials from '../MainHomeComponets/HomeTestimonials'
import HomeLast from '../MainHomeComponets/HomeLast'

function Home() {
  return (
    <>
    <div>
      <HomeHero/>
      <HomeAbout/>
      <HomeLogo/>
      <HomeServices/>
      <HomeChoose/>
      <HomeWork/>
      <HomeServe/>
      <HomeCareFaq/>
      <HomeTestimonials/>
      <HomeLast/>
    </div>
    </>
  )
}

export default Home
