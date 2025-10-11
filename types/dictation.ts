// types/dictation.ts

import { Tables } from './supabase';

type UserDb = Tables<'users'>;
type CollectionDb = Tables<'dictation_article_collections'>;
type ArticleDb = Tables<'dictation_articles'>;
type SentenceDb = Tables<'dictation_sentences'>;
type SubmissionDb = Tables<'dictation_submissions'>;
type TagDb = Tables<'dictation_teacher_feedback_tags'>;
type TagMasterDb = Tables<'dictation_tag_master'>;
type JournalDb = Tables<'dictation_journals'>;
type ReleasDb = Tables<'dictation_releases'>;

// 将来的には スネーク を キャメル に
type User = UserDb;
type Tag = TagDb;
type TagMaster = TagMasterDb;

export type Collection = CollectionDb;
export type Article = ArticleDb;
type Sentence = SentenceDb;
type Submission = SubmissionDb;
export type Journal = JournalDb;
export type Release = ReleasDb;

// JOIN 用の外部キーを外したもの
type SubmissionCore = Omit<Submission, 'sentence_id'>;
type SentenceCore = Omit<Sentence, 'article_id'>;
type ReleaseCore = Omit<Release, 'user_id' | 'collection_id' | 'created_at'>;
export type UserCore = Omit<User, 'created_at'>;

export type TagWithLabel = Tag & Pick<TagMaster, 'label'>;
export type SubmissionWithTags = SubmissionCore & {
  tags: TagWithLabel[];
};
export type SentenceWithSubmission = SentenceCore & {
  submission?: SubmissionWithTags | null;
};

export type SubmissionWithSubmissionAndArticle = SentenceWithSubmission & {
  article: Article;
};

export type ArticleWithSentences = Article &
  Pick<Collection, 'user_id' | 'title'> & {
    sentences: SentenceWithSubmission[];
  };

export type SubmissionWithContext = Submission &
  Pick<Collection, 'user_id' | 'title'> &
  Pick<User, 'display'> &
  Pick<Sentence, 'content' | 'seq' | 'article_id'> &
  Pick<Article, 'subtitle'>;

export type ReleaseWithContext = ReleaseCore &
  Pick<User, 'display'> &
  Pick<Collection, 'title'>;

export type ArticleWithTagsAndJournal = Omit<
  Article,
  'audio_full_path' | 'collection_id'
> & {
  tags: string[];
  journal_body: string | null;
  journal_created_at: string | null;
};

export type Weather = {
  tempC?: number;
  desc?: string;
  main?: string; // Clear, Clouds, Rain, etc.
};
