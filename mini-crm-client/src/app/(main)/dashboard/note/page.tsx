// app/opportunities/page.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { SheetForm } from './_components/add-opportunity'
import { Plus } from 'lucide-react'
import { OpportunitiesSection } from './_components/opportunities-section'

const Page = () => {

  return (
    <>
      <div className="flex justify-between items-center mb-5">
          <div>
              <h1 className='text-2xl font-semibold'>Notes</h1>
              <span className='text-muted-foreground text-sm'>Manage customers notes</span>
          </div>
          <SheetForm />
          {/* <Button className='py-5 px-4'>Add Customer</Button> */}
      </div>
      <OpportunitiesSection />
    </>
  )
}

export default Page