import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}