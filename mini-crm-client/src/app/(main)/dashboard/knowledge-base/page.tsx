import React from 'react'
import { Button } from '@/components/ui/button'
import { SheetForm } from './_components/upload-file'
import { DocumentSection } from './_components/documents-section'

const Page = () => {
  return (
    <>
        <div className="flex justify-between items-center mb-5">
            <div>
                <h1 className='text-2xl font-semibold'>Knowledge Base</h1>
                <span className='text-muted-foreground text-sm'>Manage your company documents</span>
            </div>
            <SheetForm />
            {/* <Button className='py-5 px-4'>Add Customer</Button> */}
        </div>
        <DocumentSection />
    </>
    
  )
}

export default Page