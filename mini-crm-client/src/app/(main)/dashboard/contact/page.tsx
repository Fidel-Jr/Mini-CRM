import React from 'react'
import { ContactsSection } from './_components/contacts-section'
import { Button } from '@/components/ui/button'
import { SheetForm } from './_components/add-contact'

const Page = () => {
  return (
    <>
        <div className="flex justify-between items-center mb-5">
            <div>
                <h1 className='text-2xl font-semibold'>Contacts</h1>
                <span className='text-muted-foreground text-sm'>Manage customers contacts</span>
            </div>
            <SheetForm />
            {/* <Button className='py-5 px-4'>Add Customer</Button> */}
        </div>
        <ContactsSection />
    </>
    
  )
}

export default Page