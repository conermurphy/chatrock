// This code was based on an article from Kent C. Dodds (https://kentcdodds.com/blog/how-to-use-react-context-effectively)

import { conversationSchema } from '@/schema';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { z } from 'zod';

const ConversationContext = createContext<
  | {
      conversation: z.infer<typeof conversationSchema> | undefined;
      setConversation: Dispatch<
        SetStateAction<z.infer<typeof conversationSchema> | undefined>
      >;
      isGenerating: boolean;
      setIsGenerating: Dispatch<SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversation, setConversation] = useState<
    z.infer<typeof conversationSchema> | undefined
  >(undefined);
  const [isGenerating, setIsGenerating] = useState(false);

  const value = {
    conversation,
    setConversation,
    isGenerating,
    setIsGenerating,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

function useConversation() {
  const context = useContext(ConversationContext);

  if (context === undefined) {
    throw new Error(
      'useConversation must be used within a ConversationProvider'
    );
  }

  return context;
}

export { ConversationProvider, useConversation };
