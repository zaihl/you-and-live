import React from 'react'
import { LandingNavbar } from '@/components/custom/LandingNavbar'
import { LandingContent } from "@/components/custom/LandingContent";
import LandingHero from '@/components/custom/LandingHero'

const LandingPage = () => {
  return (
    <div>
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  )
}

export default LandingPage