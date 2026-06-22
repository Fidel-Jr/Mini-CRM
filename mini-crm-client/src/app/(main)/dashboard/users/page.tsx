import React from 'react'
import { Button } from '@/components/ui/button'
import { SheetForm } from './_components/add-user'
import { CustomersSection } from './_components/customers-section'
import { getUser } from '@/lib/auth';

export default async function Page() {
  const user = await getUser();
  return (
    <>
        <div className="flex justify-between items-center mb-5">
            <div>
                <h1 className='text-2xl font-semibold'>Users</h1>
                <span className='text-muted-foreground text-sm'>Manage your organization members and their access.</span>
            </div>
            
            {user?.roles.includes('Admin') && (
                <SheetForm />
            )}
            {/* <Button className='py-5 px-4'>Add Customer</Button> */}
        </div>
        <CustomersSection/>
    </>
    
  )
}
