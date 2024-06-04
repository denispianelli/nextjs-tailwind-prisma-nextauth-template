import Image from 'next/image';
import { Button } from './ui/button';
import { GitHubSignIn, GoogleSignIn } from '@/app/login/_actions/login';

export default function OAuthProviders() {
  return (
    <>
      <form action={GoogleSignIn}>
        <Button type="submit" variant="outline" className="w-full gap-3">
          <Image
            src="/icons/Google__G__logo.svg"
            alt="Google"
            width="24"
            height="24"
            priority
          />
          Login with Google
        </Button>
      </form>{' '}
      <form action={GitHubSignIn}>
        <Button variant="outline" className="w-full gap-3">
          <Image
            src={'/icons/github-mark-white.svg'}
            alt="Google"
            width="24"
            height="24"
            className="hidden dark:block"
          />
          <Image
            src={'/icons/github-mark.svg'}
            alt="Google"
            width="24"
            height="24"
            className="dark:hidden"
          />
          Login with Github
        </Button>
      </form>
    </>
  );
}
