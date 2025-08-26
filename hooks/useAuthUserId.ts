'use client';

import { supabase } from '@/lib/supabase/browser';
import { useEffect, useState } from 'react';

export function useAuthUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;
      if (error) {
        console.error(error);
        setUserId(null);
      } else {
        setUserId(data.user?.id ?? null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return userId;
}
