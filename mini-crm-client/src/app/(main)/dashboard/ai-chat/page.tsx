import React from 'react'
import { Button } from '@/components/ui/button'
import AssistantLayout from './_components/assistant-layout'
import { ChatProvider } from '../../../../../contexts/chat-context'

const Page = () => {
  return (
    <div className="space-y-5">
        <div>
            <h1 className="text-2xl font-semibold">AI Assistant</h1>
            <p className="text-muted-foreground">
            Your AI powered assistant
            </p>
        </div>
        <ChatProvider>
        <AssistantLayout />
        </ChatProvider>
    </div>
    
  )
}

export default Page