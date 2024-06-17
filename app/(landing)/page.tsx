import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { LandingNavbar } from '@/components/custom/LandingNavbar'
import { LandingContent } from "@/components/custom/LandingContent";
import LandingHero from '@/components/custom/LandingHero'

const LandingPage = () => {
  const { userId } = auth();
  if (userId) {
    redirect('/dashboard');
    return null;
  }
  return (
    <div>
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
  )
}

export default LandingPage