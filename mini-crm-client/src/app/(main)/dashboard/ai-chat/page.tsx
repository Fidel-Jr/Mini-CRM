import React from 'react'
import { Button } from '@/components/ui/button'
import AssistantLayout from './_components/assistant-layout'

const Page = () => {
  return (
    <div className="space-y-5">
        <div>
            <h1 className="text-2xl font-semibold">AI Assistant</h1>
            <p className="text-muted-foreground">
            Your AI powered assistant
            </p>
        </div>

        <AssistantLayout />
    </div>
    
  )
}

export default Page