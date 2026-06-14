import React from 'react'
import { CustomersSection } from './_components/customers-section'
import { Button } from '@/components/ui/button'
import { SheetForm } from './_components/add-customer'

const Page = () => {
  return (
    <>
        <div className="flex justify-between items-center mb-5">
            <div>
                <h1 className='text-2xl font-semibold'>Customers</h1>
                <span className='text-muted-foreground text-sm'>Manage customers and their information</span>
            </div>
            <SheetForm/>
            {/* <Button className='py-5 px-4'>Add Customer</Button> */}
        </div>
        <CustomersSection />
    </>
    
  )
}

export default Page