import { LandingPage } from '@/components/landing/LandingPage';
import { notFound } from 'next/navigation';

export default function DevLandingPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return <LandingPage />;
}
