import React from 'react'
import ProfileSection from './_components/profile-section'
import PersonalInfo from './_components/personal-info'
import Password from './_components/password'

const Page = () => {
  return (
    <div className='w-full py-8'>
      <div className='mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8'>
        <PersonalInfo/>
        {/* <Password/> */}
      </div>
    </div>
  )
}

export default Page