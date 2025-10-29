import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useQuerySync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setQuery = (next: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined) sp.delete(k);
      else sp.set(k, v);
    });
    // 履歴を増やしたくないなら replace。戻る対応が必要なら push。
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };
  return { setQuery };
}
