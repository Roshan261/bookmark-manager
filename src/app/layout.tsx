import { Inter } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/components/SupabaseProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen w-full bg-gray-900 text-gray-100 overflow-x-hidden`}
      >
        <SupabaseProvider>
          <div className="min-h-screen w-full flex flex-col">
            {children}
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
