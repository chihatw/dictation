// types/dictation.ts

import { Database, Tables } from './supabase';

type UserDb = Tables<'users'>;
type AssignmentDb = Tables<'dictation_assignments'>;
type ArticleDb = Tables<'dictation_articles'>;
type SentenceDb = Tables<'dictation_sentences'>;
type SubmissionDb = Tables<'dictation_submissions'>;
type TagDb = Tables<'dictation_teacher_feedback_tags'>;
type TagMasterDb = Tables<'dictation_tag_master'>;
type JournalDb = Tables<'dictation_journals'> & { cloze_spans: ClozeSpan[] };
type MVJDb = Tables<'dictation_mvjs'>;

type JournalViewDb =
  Database['public']['Views']['dictation_journals_view']['Row'];
type ArticleViewDb =
  Database['public']['Views']['dictation_article_journal_status_view']['Row'];

export type SelfAward = Database['public']['Enums']['self_award_t'];
export type MVJScope = Database['public']['Enums']['mvj_scope_t'];
export type PIState =
  Database['public']['Enums']['dictation_power_index_state_t'];

// 将来的には スネーク を キャメル に
type User = UserDb;
type Tag = TagDb;
type TagMaster = TagMasterDb;

export type Assignment = AssignmentDb;
export type Article = ArticleDb;
type Sentence = SentenceDb;
type Submission = SubmissionDb;
export type Journal = JournalDb;
export type MVJ = MVJDb;

export type JournalView = JournalViewDb;
export type ArticleView = ArticleViewDb;

// JOIN 用の外部キーを外したもの
type SubmissionCore = Omit<Submission, 'sentence_id'>;
type SentenceCore = Omit<Sentence, 'article_id'>;
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
  Pick<Assignment, 'user_id' | 'title'> & {
    sentences: SentenceWithSubmission[];
  };

export type SubmissionWithContext = Submission &
  Pick<Assignment, 'user_id' | 'title'> &
  Pick<User, 'display'> &
  Pick<Sentence, 'content' | 'seq' | 'article_id'> &
  Pick<Article, 'subtitle'>;

export type ArticleWithTagsAndJournal = Omit<
  Article,
  'audio_full_path' | 'assignment_id'
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

export type JournalPage = {
  items: Journal[];
  next_before: string | null;
  has_more: boolean;
};

export type ClozeObj = { t: 'text' | 'blank'; v: string };

export type ClozeObjLine = ClozeObj[];

export type ClozeSpan = [number, number];
