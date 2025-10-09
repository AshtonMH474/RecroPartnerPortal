import { useAuth } from '@/context/auth';
import Link from 'next/link';
import { tinaField } from 'tinacms/dist/react';

export default function Logo({ logo }) {
  const { user } = useAuth();

  return (
    <div
      className="flex justify-center items-center pt-12 mb-10"
      data-tina-field={tinaField(logo, 'logo')}
    >
      <Link href={user?.email ? '/dashboard' : '/'} className="inline-block">
        <img
          src={logo?.logo}
          alt="logo"
          style={{
            height: logo?.height || '60px',
            width: 'auto',
          }}
          className="cursor-pointer object-contain"
        />
      </Link>
    </div>
  );
}
