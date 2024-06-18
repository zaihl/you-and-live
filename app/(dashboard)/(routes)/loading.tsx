import React from 'react'

const loading = () => {
  return (
    <div className='relative w-full h-[36rem]'>
      <div className='h-full w-full grid place-content-center absolute top-0 left-0'>
        <div className='bg-zinc-500/25 w-12 h-12 rounded-full grid place-content-center animate-ping'>
          <div className='bg-white w-10 h-10 rounded-full'>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default loading