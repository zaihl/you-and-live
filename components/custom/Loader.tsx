import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <div className='h-full flex flex-col gap-y-4 items-center justify-center'>
        <div className='w-10 h-10 relative animate-spin'>
            <Image
            alt="logo"
            fill
            src="/logo.png"
            className='rounded-full'
            />
        </div>
        <p className='text-center text-muted-foreground'>
            Thinking...
        </p>
    </div>
  )
}

export default Loader