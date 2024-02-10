import { Icon } from '@/components/icon';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 min-w-full">
      <Icon />
      <h2 className="text-2xl font-semibold text-gray-800">
        Sign in to your account
      </h2>
      <SignIn
        appearance={{
          elements: { footer: 'hidden', formButtonPrimary: 'bg-violet-700' },
        }}
      />
      <div className="flex flex-row gap-1 text-sm">
        <p>Not a user?</p>
        <Link
          href="/sign-up"
          className="text-violet-700 underline font-semibold"
        >
          Sign up here.
        </Link>
      </div>
    </div>
  );
}
