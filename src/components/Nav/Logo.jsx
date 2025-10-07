import Link from 'next/link';
import { tinaField } from 'tinacms/dist/react';

export default function Logo({ logo }) {
  return (
    <div className="pl-4 lg:pl-0" data-tina-field={tinaField(logo, 'logo')}>
      <Link href="/">
        <img style={{height:logo.height}} className="cursor-pointer" src={logo.logo} alt="logo" />
      </Link>
    </div>
  );
}