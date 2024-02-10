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
    }
  | undefined
>(undefined);

function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversation, setConversation] = useState<
    z.infer<typeof conversationSchema> | undefined
  >(undefined);

  const value = { conversation, setConversation };

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
