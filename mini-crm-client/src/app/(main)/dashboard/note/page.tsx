// app/opportunities/page.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { SheetForm } from './_components/add-note'
import { Plus } from 'lucide-react'
import { NotesSection } from './_components/notes-section'

const Page = () => {

  return (
    <>
      <div className="flex justify-between items-center mb-5">
          <div>
              <h1 className='text-2xl font-semibold'>Notes</h1>
              <span className='text-muted-foreground text-sm'>Manage customers notes</span>
          </div>
          <SheetForm />
      </div>
      <NotesSection />
    </>
  )
}

export default Page