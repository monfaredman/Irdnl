'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { usePathname } from 'next/navigation';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Login page should render without the admin sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

