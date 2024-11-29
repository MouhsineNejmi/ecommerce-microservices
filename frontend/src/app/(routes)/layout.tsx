import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../globals.css';

import { Toaster } from '@/components/ui/toaster';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'ElevateX Project',
  description: 'ElevateX Project',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en'>
      <body className={`${poppins.className}`}>
        <>{children}</>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
