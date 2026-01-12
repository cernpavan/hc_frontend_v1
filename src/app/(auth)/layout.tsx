'use client';

import { ReactNode } from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';

interface AuthRouteLayoutProps {
  children: ReactNode;
}

export default function AuthRouteLayout({ children }: AuthRouteLayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
