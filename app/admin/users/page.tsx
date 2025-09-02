import UsersTable from '@/components/admin/UsersTable';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { grantAdmin, revokeAdmin } from './actions';

const AdminUsersPage = async () => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 50,
  });
  if (error) throw error;
  return (
    <UsersTable
      initialUsers={data.users}
      grantAdmin={grantAdmin}
      revokeAdmin={revokeAdmin}
    />
  );
};

export default AdminUsersPage;
