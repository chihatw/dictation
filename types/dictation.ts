// types/dictation.ts

import { Tables } from './supabase';

type UserDb = Tables<'users'>;
type ArticleDb = Tables<'dictation_articles'>;
type SentenceDb = Tables<'dictation_sentences'>;
type SubmissionDb = Tables<'dictation_submissions'>;
type TagDb = Tables<'dictation_teacher_feedback_tags'>;
type TagMasterDb = Tables<'dictation_tag_master'>;
type JournalDb = Tables<'dictation_journals'>;

type User = UserDb;
type Article = ArticleDb;
export type Journal = JournalDb;

export type UserInput = Omit<User, 'created_at'>;

type Tag = TagDb & Pick<TagMasterDb, 'label'>;

type Submission = Omit<SubmissionDb, 'sentence_id'> & {
  tags: Tag[];
};

type Sentence = Omit<SentenceDb, 'article_id'> & {
  submission?: Submission | null;
};

export type RpcArticle = Omit<Article, 'seq'> &
  Pick<UserDb, 'uid'> & {
    // title: string; // todo title -> subtitle
    sentences: Sentence[];
  };

export type SubmissionAdminData = Omit<Sentence, 'created_at'> & {
  article: Pick<RpcArticle, 'id' | 'audio_path_full'> & { subtitle: string };
} & { submission: Submission };
