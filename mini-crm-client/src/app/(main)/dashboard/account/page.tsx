import React from 'react'
import PersonalInfo from './_components/personal-info'

const Page = () => {
  return (
    <div className='w-full py-8'>
      <div className='mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8'>
        <PersonalInfo/>
      </div>
    </div>
  )
}

export default Page