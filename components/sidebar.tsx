import { UserButton, currentUser } from '@clerk/nextjs';
import { Icon } from './icon';
import Link from 'next/link';
import PromptList from './prompt-list';

export async function Sidebar() {
  const currentUserData = await currentUser();

  if (!currentUserData) {
    return null;
  }

  return (
    <aside className="flex flex-col justify-start min-h-screen w-full py-6 px-8 max-w-60 bg-slate-300 border-r-2 border-r-slate-500 gap-12">
      <header>
        <Link href="/" className="flex flex-row gap-2 items-center">
          <Icon />
          <p className="text-gray-700 font-bold">Chatrock</p>
        </Link>
      </header>
      <PromptList />
      <footer className="w-full flex flex-row justify-center">
        <UserButton afterSignOutUrl="/sign-in" />
      </footer>
    </aside>
  );
}
