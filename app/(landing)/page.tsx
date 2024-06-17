import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const LandingPage = () => {
  const { userId } = auth();
  if (userId) {
    redirect('/dashboard');
    return null;
  }
  return (
    <div>
      Landing Page (unprotected)
      <div>
        <Link href="/sign-in">
          <Button>
            Sign in
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button>
            Sign up
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default LandingPage