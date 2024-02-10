'use client';

import { ConversationProvider } from '@/context/conversation-context';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <ConversationProvider>{children}</ConversationProvider>;
}
