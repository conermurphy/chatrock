import { MessageInput } from '@/components/message-input';

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-12">
      <div className="flex flex-col items-center gap-1 my-auto">
        <h1 className="font-bold text-2xl">What would you like to ask?</h1>
        <p>Ask me anything!</p>
      </div>
      <MessageInput />
    </main>
  );
}
