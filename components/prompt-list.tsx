'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllConversations } from '@/app/actions/db/get-all-conversations';
import { z } from 'zod';
import { conversationSchema } from '@/schema';
import { usePathname, useRouter } from 'next/navigation';
import { IoTrashBin } from 'react-icons/io5';
import { deprecateConversation } from '@/app/actions/db/deprecate-conversation';

export default function PromptList() {
  const pathname = usePathname();
  const router = useRouter();
  const [deleteing, setDeleting] = useState(false);

  const [prompts, setPrompts] = useState<
    z.infer<typeof conversationSchema>[] | null
  >();

  useEffect(() => {
    const fetchPrompts = async () => {
      setPrompts(await getAllConversations());
      setDeleting(false);
    };

    fetchPrompts();
  }, [pathname, deleteing]);

  return (
    <div className="flex flex-col gap-2 grow">
      {prompts?.map((prompt) => {
        const uuid = prompt.sk.split('#')[1];

        return (
          <div
            className="relative flex flex-row justify-start items-center group bg-slate-200 p-2 py-2.5 rounded-sm text-sm hover:bg-slate-100 transiiton-all ease-in-out duration-300"
            key={prompt.sk}
          >
            <Link href={`/${uuid}`}>
              <span className="w-24 overflow-hidden whitespace-nowrap">
                {prompt.title}
              </span>
            </Link>
            <button className="absolute right-0 mr-2 opacity-0 group-hover:opacity-100 bg-red-400 p-2 rounded-sm transition-all ease-in-out duration-300">
              <IoTrashBin
                onClick={async () => {
                  await deprecateConversation(uuid);
                  setDeleting(true);

                  router.push('/');
                }}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
