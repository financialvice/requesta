---
lastUpdated: 10-04-2025
source: https://ai-sdk.dev/elements/components/actions
---

# Actions

The `Actions` component provides a flexible row of action buttons for AI responses with common actions like retry, like, dislike, copy, and share.

## Usage

```tsx
import { Actions, Action } from "@/components/ai-elements/actions";
import { ThumbsUpIcon } from "lucide-react";
```

```tsx
<Actions className="mt-2">
  <Action label="Like">
    <ThumbsUpIcon className="size-4" />
  </Action>
</Actions>
```

## Usage with AI SDK

```tsx filename="app/page.tsx"
"use client";

import { useState } from "react";
import { Actions, Action } from "@/components/ai-elements/actions";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Input,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { RefreshCcwIcon, CopyIcon } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { Fragment } from "react";

const ActionsDemo = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, regenerate } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message, messageIndex) => (
              <Fragment key={message.id}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      const isLastMessage =
                        messageIndex === messages.length - 1;

                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" && isLastMessage && (
                            <Actions>
                              <Action
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </Action>
                              <Action
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </Action>
                            </Actions>
                          )}
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </Fragment>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <Input
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.currentTarget.value)}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </Input>
      </div>
    </div>
  );
};

export default ActionsDemo;
```

## Features

- Row of composable action buttons with consistent styling
- Support for custom actions with tooltips
- State management for toggle actions (like, dislike, favorite)
- Keyboard accessible with proper ARIA labels
- Clipboard and Web Share API integration
- TypeScript support with proper type definitions
- Consistent with design system styling

## Props

### `<Actions />`

<PropertiesTable
content={[
{
name: '[...props]',
type: 'React.HTMLAttributes<HTMLDivElement>',
description: 'HTML attributes to spread to the root div.',
},
]}
/>

### `<Action />`

<PropertiesTable
content={[
{
name: 'tooltip',
type: 'string',
description: 'Optional tooltip text shown on hover.',
isOptional: true,
},
{
name: 'label',
type: 'string',
description:
'Accessible label for screen readers. Also used as fallback if tooltip is not provided.',
isOptional: true,
},
{
name: '[...props]',
type: 'React.ComponentProps<typeof Button>',
description:
'Any other props are spread to the underlying shadcn/ui Button component.',
},
]}
/>
