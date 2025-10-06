import UsersTable from '@/components/admin/UsersTable';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { grantAdmin, revokeAdmin } from './actions';

const AdminUsersPage = async () => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 50,
  });
  if (error) throw error;
  return (
    <div className='max-w-2xl mx-auto mt-10'>
      <Link
        href='/admin'
        className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-4'
      >
        <ChevronLeft className='h-4 w-4' />
        <span>管理者ページ</span>
      </Link>
      <UsersTable
        initialUsers={data.users}
        grantAdmin={grantAdmin}
        revokeAdmin={revokeAdmin}
      />
    </div>
  );
};

export default AdminUsersPage;
