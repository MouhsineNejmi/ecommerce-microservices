import { Navbar } from '@/components/navbar';

export default function FrontOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='container mx-auto'>
      <Navbar />
      <main className='pt-24 pb-20'>{children}</main>
    </div>
  );
}
