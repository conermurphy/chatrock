import { MessageInput } from '@/components/message-input';
import { getOneConversation } from '../actions/get-one-conversation';
import { MdOutlinePersonOutline, MdOutlineComputer } from 'react-icons/md';

interface IPageProps {
  params: {
    uuid: string;
  };
}

export default async function Page({ params: { uuid } }: IPageProps) {
  const conversation = await getOneConversation(uuid);

  return (
    <main className="flex h-full flex-row w-full items-center justify-center p-12">
      <div className="h-full w-full max-w-3xl flex flex-col justify-between items-start">
        <div className="flex flex-col items-start gap-1">
          {conversation?.conversation.map((message) => (
            <div
              className="flex flex-row gap-4 items-center"
              key={message.content}
            >
              {message.author === conversation.pk ? (
                <div className="bg-violet-400 rounded-sm p-2 text-white">
                  <MdOutlinePersonOutline size={20} />
                </div>
              ) : (
                <div className="bg-green-400 rounded-sm p-2 text-white">
                  <MdOutlineComputer />
                </div>
              )}
              <p key={message.content}>{message.content}</p>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center">
          <MessageInput />
        </div>
      </div>
    </main>
  );
}
