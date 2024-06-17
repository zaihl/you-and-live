import { Button } from '@/components/ui/button';
import Link from 'next/link'
import React from 'react'

const DeletePage = () => {
  return (
    <div className='relative w-screen h-screen flex justify-center items-center'>
      <div>
        <Link href="/" prefetch={false}>
          <Button>Homepage</Button>
        </Link>
      </div>
    </div>
  );
}

export default DeletePage