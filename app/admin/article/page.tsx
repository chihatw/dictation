'use client';

import { ArticleCreateForm } from '@/components/articles/ArticleCreateForm';

const CreateArticlePage = () => {
  return (
    <main className='mx-auto max-w-2xl p-6 space-y-6'>
      <h1 className='text-2xl font-semibold'>Article 作成（管理者）</h1>
      <ArticleCreateForm />
    </main>
  );
};

export default CreateArticlePage;
