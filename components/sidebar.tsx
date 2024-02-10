import { UserButton, currentUser } from '@clerk/nextjs';
import { Icon } from './icon';
import Link from 'next/link';
import PromptList from './prompt-list';
import { IoAddOutline } from 'react-icons/io5';

export async function Sidebar() {
  const currentUserData = await currentUser();

  if (!currentUserData) {
    return null;
  }

  const hasUserGivenName =
    currentUserData.firstName && currentUserData.lastName;

  return (
    <aside className="flex flex-col justify-start min-h-screen w-full py-6 px-8 max-w-60 bg-slate-300 border-r-2 border-r-slate-500 gap-12">
      <header className="flex flex-row gap-2 justify-between items-center">
        <Link href="/" className="flex flex-row gap-2 items-center">
          <Icon />
          <p className="text-gray-700 font-bold">Chatrock</p>
        </Link>
        <Link
          href="/"
          className='flex flex-row justify-start items-center group bg-slate-200 p-2 h-max rounded-sm hover:bg-slate-100 transiiton-all ease-in-out duration-300"'
        >
          <IoAddOutline />
        </Link>
      </header>

      <PromptList />
      <footer
        className={`w-full flex flex-row ${!hasUserGivenName && 'justify-center'}`}
      >
        <UserButton
          afterSignOutUrl="/sign-in"
          showName={Boolean(hasUserGivenName)}
          appearance={{
            elements: { userButtonBox: 'flex-row-reverse' },
          }}
        />
      </footer>
    </aside>
  );
}
