import { createClient } from '@/lib/supabase/server';

type Props = {
  params: Promise<{ id: string }>;
};

const Page = async (props: Props) => {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dictation_journals')
    .select('*')
    .eq('id', id);

  if (error) console.log(error.message);

  return (
    <div className='max-w-2xl mx-auto my-10'>
      <pre className='text-sm font-light'>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Page;
