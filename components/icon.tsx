import { IoMdChatbubbles } from 'react-icons/io';

export function Icon() {
  return (
    <div className="flex flex-row gap-3 items-center">
      <div className="bg-stone-50 p-2 rounded-lg shadow-md">
        <IoMdChatbubbles className="text-4xl text-violet-500" size={24} />
      </div>
    </div>
  );
}
