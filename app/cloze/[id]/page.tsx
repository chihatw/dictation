import { createClient } from '@/lib/supabase/server';
import ClozeMaker from './ClozeMaker';

type Props = {
  params: Promise<{ id: string }>;
};

const Page = async (props: Props) => {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dictation_journals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) console.log(error.message);

  if (!data) return <div>no data</div>;

  return (
    <div className='max-w-2xl mx-auto my-10 mb-96'>
      <ClozeMaker journal={data} />
    </div>
  );
};

export default Page;
