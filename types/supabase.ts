export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      article_marks: {
        Row: {
          articleId: number
          created_at: string
          end: number
          id: number
          line: number
          start: number
        }
        Insert: {
          articleId: number
          created_at?: string
          end: number
          id?: number
          line: number
          start: number
        }
        Update: {
          articleId?: number
          created_at?: string
          end?: number
          id?: number
          line?: number
          start?: number
        }
        Relationships: [
          {
            foreignKeyName: "article_marks_articleid_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["articleId"]
          },
          {
            foreignKeyName: "article_marks_articleid_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_marks_articleid_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      article_pitch_quiz_answer_rows: {
        Row: {
          answerId: number
          created_at: string
          id: number
          line: number
          pitchStr: string
        }
        Insert: {
          answerId: number
          created_at?: string
          id?: number
          line: number
          pitchStr: string
        }
        Update: {
          answerId?: number
          created_at?: string
          id?: number
          line?: number
          pitchStr?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_article_pitch_quiz_answer_rows_answerId_fkey"
            columns: ["answerId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_rows_view"
            referencedColumns: ["answerId"]
          },
          {
            foreignKeyName: "public_article_pitch_quiz_answer_rows_answerId_fkey"
            columns: ["answerId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_article_pitch_quiz_answer_rows_answerId_fkey"
            columns: ["answerId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answers"
            referencedColumns: ["id"]
          },
        ]
      }
      article_pitch_quiz_answers: {
        Row: {
          created_at: string
          id: number
          quizId: number
        }
        Insert: {
          created_at?: string
          id?: number
          quizId: number
        }
        Update: {
          created_at?: string
          id?: number
          quizId?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_article_pitch_quiz_answers_quizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["quizId"]
          },
          {
            foreignKeyName: "public_article_pitch_quiz_answers_quizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_article_pitch_quiz_answers_quizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quizzes_view"
            referencedColumns: ["id"]
          },
        ]
      }
      article_pitch_quiz_questions: {
        Row: {
          created_at: string
          id: number
          line: number
          lockedIndexes: number[]
          quizId: number
        }
        Insert: {
          created_at?: string
          id?: number
          line: number
          lockedIndexes: number[]
          quizId: number
        }
        Update: {
          created_at?: string
          id?: number
          line?: number
          lockedIndexes?: number[]
          quizId?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_article_pitch_questions_articlePitchQuizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["quizId"]
          },
          {
            foreignKeyName: "public_article_pitch_questions_articlePitchQuizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_article_pitch_questions_articlePitchQuizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quizzes_view"
            referencedColumns: ["id"]
          },
        ]
      }
      article_pitch_quizzes: {
        Row: {
          articleId: number
          created_at: string
          hasAudio: boolean
          id: number
          isDev: boolean
          title: string
        }
        Insert: {
          articleId: number
          created_at?: string
          hasAudio?: boolean
          id?: number
          isDev?: boolean
          title: string
        }
        Update: {
          articleId?: number
          created_at?: string
          hasAudio?: boolean
          id?: number
          isDev?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_article_pitch_quizzes_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["articleId"]
          },
          {
            foreignKeyName: "public_article_pitch_quizzes_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_article_pitch_quizzes_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      article_recorded_assignments: {
        Row: {
          articleId: number
          audioPath: string
          created_at: string
          id: number
          line: number
        }
        Insert: {
          articleId: number
          audioPath: string
          created_at?: string
          id?: number
          line: number
        }
        Update: {
          articleId?: number
          audioPath?: string
          created_at?: string
          id?: number
          line?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_article_recorded_assinments_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["articleId"]
          },
          {
            foreignKeyName: "public_article_recorded_assinments_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_article_recorded_assinments_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          audioPath: string
          created_at: string
          date: string
          id: number
          isArchived: boolean
          isShowAccents: boolean
          title: string
          uid: string
        }
        Insert: {
          audioPath: string
          created_at?: string
          date: string
          id?: number
          isArchived?: boolean
          isShowAccents?: boolean
          title: string
          uid: string
        }
        Update: {
          audioPath?: string
          created_at?: string
          date?: string
          id?: number
          isArchived?: boolean
          isShowAccents?: boolean
          title?: string
          uid?: string
        }
        Relationships: []
      }
      betterread: {
        Row: {
          articleId: number
          created_at: string
          id: number
          uid: string
        }
        Insert: {
          articleId: number
          created_at?: string
          id?: number
          uid: string
        }
        Update: {
          articleId?: number
          created_at?: string
          id?: number
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "betterread_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["articleId"]
          },
          {
            foreignKeyName: "betterread_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "betterread_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      betterread_item_questions: {
        Row: {
          betterread_item_id: number
          created_at: string
          id: number
          question: string
          view_point: string
        }
        Insert: {
          betterread_item_id: number
          created_at?: string
          id?: number
          question: string
          view_point?: string
        }
        Update: {
          betterread_item_id?: number
          created_at?: string
          id?: number
          question?: string
          view_point?: string
        }
        Relationships: [
          {
            foreignKeyName: "betterread_item_questions_betterread_item_id_fkey"
            columns: ["betterread_item_id"]
            isOneToOne: false
            referencedRelation: "betterread_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "betterread_item_questions_betterread_item_id_fkey"
            columns: ["betterread_item_id"]
            isOneToOne: false
            referencedRelation: "betterread_items_view"
            referencedColumns: ["id"]
          },
        ]
      }
      betterread_items: {
        Row: {
          betterread_id: number
          created_at: string
          id: number
          image_url: string
        }
        Insert: {
          betterread_id: number
          created_at?: string
          id?: number
          image_url: string
        }
        Update: {
          betterread_id?: number
          created_at?: string
          id?: number
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "betterread_items_betterread_id_fkey"
            columns: ["betterread_id"]
            isOneToOne: false
            referencedRelation: "betterread"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "betterread_items_betterread_id_fkey"
            columns: ["betterread_id"]
            isOneToOne: false
            referencedRelation: "betterread_items_view"
            referencedColumns: ["betterread_id"]
          },
          {
            foreignKeyName: "betterread_items_betterread_id_fkey"
            columns: ["betterread_id"]
            isOneToOne: false
            referencedRelation: "betterread_view"
            referencedColumns: ["id"]
          },
        ]
      }
      betterread_toggle: {
        Row: {
          betterread_id: number | null
          id: number
          questions: number[]
          view_points: number[]
        }
        Insert: {
          betterread_id?: number | null
          id?: number
          questions?: number[]
          view_points?: number[]
        }
        Update: {
          betterread_id?: number | null
          id?: number
          questions?: number[]
          view_points?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "betterread_toggle_betterread_id_fkey"
            columns: ["betterread_id"]
            isOneToOne: false
            referencedRelation: "betterread"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "betterread_toggle_betterread_id_fkey"
            columns: ["betterread_id"]
            isOneToOne: false
            referencedRelation: "betterread_items_view"
            referencedColumns: ["betterread_id"]
          },
          {
            foreignKeyName: "betterread_toggle_betterread_id_fkey"
            columns: ["betterread_id"]
            isOneToOne: false
            referencedRelation: "betterread_view"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_boxes: {
        Row: {
          highlights: number[]
          id: number
          isHidden: boolean
          label: string
          splitBy: number
          x: number
          y: number
        }
        Insert: {
          highlights: number[]
          id?: number
          isHidden: boolean
          label: string
          splitBy: number
          x: number
          y: number
        }
        Update: {
          highlights?: number[]
          id?: number
          isHidden?: boolean
          label?: string
          splitBy?: number
          x?: number
          y?: number
        }
        Relationships: []
      }
      canvas_field: {
        Row: {
          connectedObjSets: string[]
          expandObjId: number | null
          expandStartObjId: number | null
          id: number
        }
        Insert: {
          connectedObjSets?: string[]
          expandObjId?: number | null
          expandStartObjId?: number | null
          id?: number
        }
        Update: {
          connectedObjSets?: string[]
          expandObjId?: number | null
          expandStartObjId?: number | null
          id?: number
        }
        Relationships: []
      }
      dictation_articles: {
        Row: {
          audio_path_full: string | null
          created_at: string
          id: string
          speaking_rate: number
          title: string
          tts_voice_name: string
          uid: string
        }
        Insert: {
          audio_path_full?: string | null
          created_at?: string
          id?: string
          speaking_rate?: number
          title?: string
          tts_voice_name?: string
          uid: string
        }
        Update: {
          audio_path_full?: string | null
          created_at?: string
          id?: string
          speaking_rate?: number
          title?: string
          tts_voice_name?: string
          uid?: string
        }
        Relationships: []
      }
      dictation_journals: {
        Row: {
          article_id: string
          body: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          body: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          body?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dictation_journals_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "dictation_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dictation_journals_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "dictation_articles_recent10"
            referencedColumns: ["id"]
          },
        ]
      }
      dictation_release_items: {
        Row: {
          article_id: string
          id: string
          pos: number
          release_id: string
        }
        Insert: {
          article_id: string
          id?: string
          pos: number
          release_id: string
        }
        Update: {
          article_id?: string
          id?: string
          pos?: number
          release_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dictation_release_items_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "dictation_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dictation_release_items_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "dictation_articles_recent10"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dictation_release_items_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "dictation_releases"
            referencedColumns: ["id"]
          },
        ]
      }
      dictation_releases: {
        Row: {
          created_at: string
          due_at: string | null
          id: string
          published_at: string | null
          uid: string
        }
        Insert: {
          created_at?: string
          due_at?: string | null
          id?: string
          published_at?: string | null
          uid: string
        }
        Update: {
          created_at?: string
          due_at?: string | null
          id?: string
          published_at?: string | null
          uid?: string
        }
        Relationships: []
      }
      dictation_sentences: {
        Row: {
          article_id: string
          audio_path: string | null
          content: string
          created_at: string
          id: string
          seq: number
        }
        Insert: {
          article_id: string
          audio_path?: string | null
          content: string
          created_at?: string
          id?: string
          seq: number
        }
        Update: {
          article_id?: string
          audio_path?: string | null
          content?: string
          created_at?: string
          id?: string
          seq?: number
        }
        Relationships: [
          {
            foreignKeyName: "dictation_sentences_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "dictation_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dictation_sentences_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "dictation_articles_recent10"
            referencedColumns: ["id"]
          },
        ]
      }
      dictation_submission_logs: {
        Row: {
          answer: string | null
          created_at: string
          elapsed_ms_since_first_play: number
          elapsed_ms_since_item_view: number
          id: string
          listened_full_count: number
          plays_count: number
          self_assessed_comprehension: number
          sentence_id: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          created_at?: string
          elapsed_ms_since_first_play: number
          elapsed_ms_since_item_view: number
          id?: string
          listened_full_count?: number
          plays_count?: number
          self_assessed_comprehension: number
          sentence_id: string
          user_id: string
        }
        Update: {
          answer?: string | null
          created_at?: string
          elapsed_ms_since_first_play?: number
          elapsed_ms_since_item_view?: number
          id?: string
          listened_full_count?: number
          plays_count?: number
          self_assessed_comprehension?: number
          sentence_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dictation_submission_logs_sentence_id_fkey"
            columns: ["sentence_id"]
            isOneToOne: false
            referencedRelation: "dictation_sentences"
            referencedColumns: ["id"]
          },
        ]
      }
      dictation_submissions: {
        Row: {
          answer: string
          created_at: string
          feedback_md: string | null
          id: string
          sentence_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          feedback_md?: string | null
          id?: string
          sentence_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          feedback_md?: string | null
          id?: string
          sentence_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dictation_submissions_sentence_id_fkey"
            columns: ["sentence_id"]
            isOneToOne: false
            referencedRelation: "dictation_sentences"
            referencedColumns: ["id"]
          },
        ]
      }
      dictation_tag_master: {
        Row: {
          created_at: string
          id: string
          label: string
          norm_label: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          norm_label?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          norm_label?: string | null
        }
        Relationships: []
      }
      dictation_teacher_feedback: {
        Row: {
          created_at: string
          id: string
          note_md: string
          sentence_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note_md: string
          sentence_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note_md?: string
          sentence_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dictation_teacher_feedback_sentence_id_fkey"
            columns: ["sentence_id"]
            isOneToOne: false
            referencedRelation: "dictation_sentences"
            referencedColumns: ["id"]
          },
        ]
      }
      dictation_teacher_feedback_tags: {
        Row: {
          created_at: string
          id: string
          tag_master_id: string | null
          teacher_feedback_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag_master_id?: string | null
          teacher_feedback_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tag_master_id?: string | null
          teacher_feedback_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dictation_teacher_feedback_tags_teacher_feedback_id_fkey"
            columns: ["teacher_feedback_id"]
            isOneToOne: false
            referencedRelation: "dictation_teacher_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dtft_tag_master_fkey"
            columns: ["tag_master_id"]
            isOneToOne: false
            referencedRelation: "dictation_tag_master"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_infos: {
        Row: {
          created_at: string
          id: number
          image_url: string | null
          text: string
          uid: string
        }
        Insert: {
          created_at?: string
          id?: number
          image_url?: string | null
          text?: string
          uid: string
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string | null
          text?: string
          uid?: string
        }
        Relationships: []
      }
      mirror_workout_realtime: {
        Row: {
          id: number
          isMirror: boolean
          selectedId: string
        }
        Insert: {
          id?: number
          isMirror?: boolean
          selectedId: string
        }
        Update: {
          id?: number
          isMirror?: boolean
          selectedId?: string
        }
        Relationships: []
      }
      mirror_workout_results: {
        Row: {
          correctRatio: number
          created_at: string
          id: number
          items: string
          laps: number[]
          selectedNumbers: number[]
          totalTime: number
          uid: string
        }
        Insert: {
          correctRatio: number
          created_at?: string
          id?: number
          items: string
          laps: number[]
          selectedNumbers: number[]
          totalTime: number
          uid: string
        }
        Update: {
          correctRatio?: number
          created_at?: string
          id?: number
          items?: string
          laps?: number[]
          selectedNumbers?: number[]
          totalTime?: number
          uid?: string
        }
        Relationships: []
      }
      note: {
        Row: {
          id: number
          text: string
        }
        Insert: {
          id?: number
          text: string
        }
        Update: {
          id?: number
          text?: string
        }
        Relationships: []
      }
      note_audio_paths: {
        Row: {
          audioPath: string
          id: number
          index: number
        }
        Insert: {
          audioPath: string
          id?: number
          index: number
        }
        Update: {
          audioPath?: string
          id?: number
          index?: number
        }
        Relationships: []
      }
      page_states: {
        Row: {
          pageState: string
          uid: string
        }
        Insert: {
          pageState: string
          uid: string
        }
        Update: {
          pageState?: string
          uid?: string
        }
        Relationships: []
      }
      paper_cup_params: {
        Row: {
          created_at: string
          cue: string
          id: number
          params: string
        }
        Insert: {
          created_at?: string
          cue?: string
          id?: number
          params?: string
        }
        Update: {
          created_at?: string
          cue?: string
          id?: number
          params?: string
        }
        Relationships: []
      }
      pin_comment_admin_state: {
        Row: {
          blur: number | null
          gradient: number | null
          id: string
          position_y: number | null
          selected_ellipse_ids: string[] | null
          selected_image_meta_id: string | null
          updated_at: string | null
        }
        Insert: {
          blur?: number | null
          gradient?: number | null
          id?: string
          position_y?: number | null
          selected_ellipse_ids?: string[] | null
          selected_image_meta_id?: string | null
          updated_at?: string | null
        }
        Update: {
          blur?: number | null
          gradient?: number | null
          id?: string
          position_y?: number | null
          selected_ellipse_ids?: string[] | null
          selected_image_meta_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pin_comment_ellipses: {
        Row: {
          center_x: number
          center_y: number
          comment: string
          created_at: string
          id: string
          image_meta_id: string
          index: number
          rx: number
          ry: number
          updated_at: string
        }
        Insert: {
          center_x: number
          center_y: number
          comment?: string
          created_at: string
          id: string
          image_meta_id: string
          index: number
          rx: number
          ry: number
          updated_at: string
        }
        Update: {
          center_x?: number
          center_y?: number
          comment?: string
          created_at?: string
          id?: string
          image_meta_id?: string
          index?: number
          rx?: number
          ry?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pin_comment_ellipses_image_meta_id_fkey"
            columns: ["image_meta_id"]
            isOneToOne: false
            referencedRelation: "pin_comment_image_metas"
            referencedColumns: ["id"]
          },
        ]
      }
      pin_comment_image_metas: {
        Row: {
          created_at: string
          file_name: string
          height: number
          id: string
          mime_type: string
          size: number
          storage_path: string
          thumbnail_url: string
          updated_at: string
          width: number
        }
        Insert: {
          created_at?: string
          file_name: string
          height: number
          id?: string
          mime_type: string
          size: number
          storage_path: string
          thumbnail_url: string
          updated_at?: string
          width: number
        }
        Update: {
          created_at?: string
          file_name?: string
          height?: number
          id?: string
          mime_type?: string
          size?: number
          storage_path?: string
          thumbnail_url?: string
          updated_at?: string
          width?: number
        }
        Relationships: []
      }
      pin_comment_image_thumbnails: {
        Row: {
          created_at: string | null
          id: string
          image_meta_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_meta_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_meta_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pin_comment_image_thumbnails_image_meta_id_fkey"
            columns: ["image_meta_id"]
            isOneToOne: false
            referencedRelation: "pin_comment_image_metas"
            referencedColumns: ["id"]
          },
        ]
      }
      pitches: {
        Row: {
          id: number
          japanese: string
          pitchStr: string
        }
        Insert: {
          id?: number
          japanese: string
          pitchStr: string
        }
        Update: {
          id?: number
          japanese?: string
          pitchStr?: string
        }
        Relationships: []
      }
      pitches_user: {
        Row: {
          id: number
          pitchStr: string
        }
        Insert: {
          id?: number
          pitchStr: string
        }
        Update: {
          id?: number
          pitchStr?: string
        }
        Relationships: []
      }
      postit_items: {
        Row: {
          id: number
          image_url: string | null
          index: number
          japanese: string
          postit_id: number
        }
        Insert: {
          id?: number
          image_url?: string | null
          index: number
          japanese: string
          postit_id: number
        }
        Update: {
          id?: number
          image_url?: string | null
          index?: number
          japanese?: string
          postit_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "postit_items_postit_id_fkey"
            columns: ["postit_id"]
            isOneToOne: false
            referencedRelation: "postits"
            referencedColumns: ["id"]
          },
        ]
      }
      postit_note_items: {
        Row: {
          created_at: string
          id: number
          image_url: string
          postit_note_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          image_url: string
          postit_note_id: number
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string
          postit_note_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "postit_note_items_postit_note_id_fkey"
            columns: ["postit_note_id"]
            isOneToOne: false
            referencedRelation: "postit_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      postit_notes: {
        Row: {
          id: number
          uid: string
        }
        Insert: {
          id?: number
          uid: string
        }
        Update: {
          id?: number
          uid?: string
        }
        Relationships: []
      }
      postit_workouts: {
        Row: {
          checked: number[]
          descriptions: string[]
          id: number
          japanese: string
          japanese_passed: boolean
          one_sentence_image_url: string
          one_sentence_passed: boolean
          one_topic_image_url: string
          one_topic_passed: boolean
          ordered_image_url: string
          ordered_passed: boolean
          three_topics_image_urls: string[]
          three_topics_passed: boolean
          topic: string
          uid: string
        }
        Insert: {
          checked?: number[]
          descriptions?: string[]
          id?: number
          japanese?: string
          japanese_passed?: boolean
          one_sentence_image_url?: string
          one_sentence_passed?: boolean
          one_topic_image_url?: string
          one_topic_passed?: boolean
          ordered_image_url?: string
          ordered_passed?: boolean
          three_topics_image_urls?: string[]
          three_topics_passed?: boolean
          topic?: string
          uid: string
        }
        Update: {
          checked?: number[]
          descriptions?: string[]
          id?: number
          japanese?: string
          japanese_passed?: boolean
          one_sentence_image_url?: string
          one_sentence_passed?: boolean
          one_topic_image_url?: string
          one_topic_passed?: boolean
          ordered_image_url?: string
          ordered_passed?: boolean
          three_topics_image_urls?: string[]
          three_topics_passed?: boolean
          topic?: string
          uid?: string
        }
        Relationships: []
      }
      postits: {
        Row: {
          id: number
          uid: string
        }
        Insert: {
          id?: number
          uid: string
        }
        Update: {
          id?: number
          uid?: string
        }
        Relationships: []
      }
      record_params: {
        Row: {
          created_at: string
          id: number
          pitchStr: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          pitchStr: string
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          pitchStr?: string
          title?: string
        }
        Relationships: []
      }
      records: {
        Row: {
          created_at: string
          id: number
          path: string
          pitchStr: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          path: string
          pitchStr: string
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          path?: string
          pitchStr?: string
          title?: string
        }
        Relationships: []
      }
      redirect_tos: {
        Row: {
          id: number
          redirect_to: string
          uid: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          redirect_to: string
          uid?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          redirect_to?: string
          uid?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sentences: {
        Row: {
          articleId: number
          chinese: string
          created_at: string
          id: number
          japanese: string
          line: number
          original: string
          pitchStr: string
        }
        Insert: {
          articleId: number
          chinese: string
          created_at?: string
          id?: number
          japanese: string
          line: number
          original: string
          pitchStr: string
        }
        Update: {
          articleId?: number
          chinese?: string
          created_at?: string
          id?: number
          japanese?: string
          line?: number
          original?: string
          pitchStr?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_sentences_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["articleId"]
          },
          {
            foreignKeyName: "public_sentences_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_sentences_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      speed_workout: {
        Row: {
          id: number
          isOpen: boolean
          isRunning: boolean
          selectedId: number | null
          selectedItemId: number | null
        }
        Insert: {
          id?: number
          isOpen?: boolean
          isRunning?: boolean
          selectedId?: number | null
          selectedItemId?: number | null
        }
        Update: {
          id?: number
          isOpen?: boolean
          isRunning?: boolean
          selectedId?: number | null
          selectedItemId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "speed_workout_selectedid_fkey"
            columns: ["selectedId"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speed_workout_selectedid_fkey"
            columns: ["selectedId"]
            isOneToOne: false
            referencedRelation: "workouts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speed_workout_selectedItemId_fkey"
            columns: ["selectedItemId"]
            isOneToOne: false
            referencedRelation: "workout_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speed_workout_selectedItemId_fkey"
            columns: ["selectedItemId"]
            isOneToOne: false
            referencedRelation: "workout_items_view"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          display: string
          uid: string
        }
        Insert: {
          created_at?: string
          display: string
          uid: string
        }
        Update: {
          created_at?: string
          display?: string
          uid?: string
        }
        Relationships: []
      }
      workout_items: {
        Row: {
          chinese: string
          created_at: string
          id: number
          index: number
          japanese: string
          pitchStr: string
          workoutId: number
        }
        Insert: {
          chinese: string
          created_at?: string
          id?: number
          index: number
          japanese: string
          pitchStr: string
          workoutId: number
        }
        Update: {
          chinese?: string
          created_at?: string
          id?: number
          index?: number
          japanese?: string
          pitchStr?: string
          workoutId?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_workout_items_workoutId_fkey"
            columns: ["workoutId"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_workout_items_workoutId_fkey"
            columns: ["workoutId"]
            isOneToOne: false
            referencedRelation: "workouts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_record_rows: {
        Row: {
          created_at: string
          id: number
          index: number
          workoutItemId: number
          workoutRecordId: number
        }
        Insert: {
          created_at?: string
          id?: number
          index: number
          workoutItemId: number
          workoutRecordId: number
        }
        Update: {
          created_at?: string
          id?: number
          index?: number
          workoutItemId?: number
          workoutRecordId?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_workout_record_rows_workoutItemId_fkey"
            columns: ["workoutItemId"]
            isOneToOne: false
            referencedRelation: "workout_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_workout_record_rows_workoutItemId_fkey"
            columns: ["workoutItemId"]
            isOneToOne: false
            referencedRelation: "workout_items_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_workout_record_rows_workoutRecordId_fkey"
            columns: ["workoutRecordId"]
            isOneToOne: false
            referencedRelation: "workout_records"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_records: {
        Row: {
          audioPath: string
          bpm: number
          created_at: string
          id: number
          workoutId: number
        }
        Insert: {
          audioPath: string
          bpm: number
          created_at?: string
          id?: number
          workoutId: number
        }
        Update: {
          audioPath?: string
          bpm?: number
          created_at?: string
          id?: number
          workoutId?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_workout_records_workoutId_fkey"
            columns: ["workoutId"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_workout_records_workoutId_fkey"
            columns: ["workoutId"]
            isOneToOne: false
            referencedRelation: "workouts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          created_at: string
          id: number
          isDev: boolean
          isReview: boolean
          targetBPM: number
          title: string
          uid: string
        }
        Insert: {
          created_at?: string
          id?: number
          isDev?: boolean
          isReview?: boolean
          targetBPM: number
          title: string
          uid?: string
        }
        Update: {
          created_at?: string
          id?: number
          isDev?: boolean
          isReview?: boolean
          targetBPM?: number
          title?: string
          uid?: string
        }
        Relationships: []
      }
    }
    Views: {
      article_pitch_quiz_answer_rows_view: {
        Row: {
          answer: string | null
          answerId: number | null
          audioPath: string | null
          created_at: string | null
          end: number | null
          hasAudio: boolean | null
          id: number | null
          line: number | null
          lockedIndexes: number[] | null
          pitchStr: string | null
          quizId: number | null
          start: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_article_pitch_quiz_answers_quizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["quizId"]
          },
          {
            foreignKeyName: "public_article_pitch_quiz_answers_quizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_article_pitch_quiz_answers_quizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quizzes_view"
            referencedColumns: ["id"]
          },
        ]
      }
      article_pitch_quiz_answer_view: {
        Row: {
          articleId: number | null
          audioPath: string | null
          created_at: string | null
          display: string | null
          hasAudio: boolean | null
          id: number | null
          quizId: number | null
          title: string | null
        }
        Relationships: []
      }
      article_pitch_quiz_questions_view: {
        Row: {
          articleId: number | null
          audioPath: string | null
          end: number | null
          hasAudio: boolean | null
          id: number | null
          isDev: boolean | null
          japanese: string | null
          line: number | null
          lockedIndexes: number[] | null
          pitchStr: string | null
          quizId: number | null
          start: number | null
          title: string | null
          uid: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_article_pitch_questions_articlePitchQuizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["quizId"]
          },
          {
            foreignKeyName: "public_article_pitch_questions_articlePitchQuizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_article_pitch_questions_articlePitchQuizId_fkey"
            columns: ["quizId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quizzes_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_article_pitch_quizzes_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["articleId"]
          },
          {
            foreignKeyName: "public_article_pitch_quizzes_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_article_pitch_quizzes_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      article_pitch_quizzes_view: {
        Row: {
          articleId: number | null
          audioPath: string | null
          created_at: string | null
          display: string | null
          hasAudio: boolean | null
          id: number | null
          isDev: boolean | null
          title: string | null
          uid: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_article_pitch_quizzes_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["articleId"]
          },
          {
            foreignKeyName: "public_article_pitch_quizzes_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_article_pitch_quizzes_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      articles_view: {
        Row: {
          audioPath: string | null
          created_at: string | null
          date: string | null
          display: string | null
          id: number | null
          isArchived: boolean | null
          isShowAccents: boolean | null
          title: string | null
          uid: string | null
        }
        Relationships: []
      }
      betterread_items_view: {
        Row: {
          betterread_id: number | null
          id: number | null
          image_url: string | null
          item_created_at: string | null
          question: string | null
          question_created_at: string | null
          question_id: number | null
          title: string | null
          view_point: string | null
        }
        Relationships: []
      }
      betterread_view: {
        Row: {
          auther: string | null
          display: string | null
          id: number | null
          title: string | null
        }
        Relationships: []
      }
      dictation_articles_recent10: {
        Row: {
          created_at: string | null
          id: string | null
          title: string | null
          uid: string | null
        }
        Relationships: []
      }
      dictation_submission_latest_view: {
        Row: {
          answer: string | null
          article_id: string | null
          content: string | null
          created_at: string | null
          display: string | null
          elapsed_ms_since_first_play: number | null
          elapsed_ms_since_item_view: number | null
          id: string | null
          listened_full_count: number | null
          self_assessed_comprehension: number | null
          sentence_id: string | null
          seq: number | null
          title: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dictation_sentences_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "dictation_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dictation_sentences_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "dictation_articles_recent10"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dictation_submission_logs_sentence_id_fkey"
            columns: ["sentence_id"]
            isOneToOne: false
            referencedRelation: "dictation_sentences"
            referencedColumns: ["id"]
          },
        ]
      }
      page_states_view: {
        Row: {
          display: string | null
          pageState: string | null
          uid: string | null
        }
        Relationships: []
      }
      redirect_tos_view: {
        Row: {
          display: string | null
          id: number | null
          redirect_to: string | null
          uid: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      sentences_view: {
        Row: {
          articleId: number | null
          articleRecordedAssignmentId: number | null
          audioPath: string | null
          chinese: string | null
          created_at: string | null
          date: string | null
          end: number | null
          id: number | null
          isArchived: boolean | null
          isShowAccents: boolean | null
          japanese: string | null
          line: number | null
          original: string | null
          pitchStr: string | null
          recorded_audioPath: string | null
          start: number | null
          title: string | null
          uid: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_sentences_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "article_pitch_quiz_answer_view"
            referencedColumns: ["articleId"]
          },
          {
            foreignKeyName: "public_sentences_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_sentences_articleId_fkey"
            columns: ["articleId"]
            isOneToOne: false
            referencedRelation: "articles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_items_view: {
        Row: {
          chinese: string | null
          created_at: string | null
          display: string | null
          id: number | null
          index: number | null
          isReview: boolean | null
          japanese: string | null
          pitchStr: string | null
          targetBPM: number | null
          title: string | null
          uid: string | null
          workoutId: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_workout_items_workoutId_fkey"
            columns: ["workoutId"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_workout_items_workoutId_fkey"
            columns: ["workoutId"]
            isOneToOne: false
            referencedRelation: "workouts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_record_rows_view: {
        Row: {
          audioPath: string | null
          bpm: number | null
          chinese: string | null
          created_at: string | null
          display: string | null
          id: number | null
          index: number | null
          isDev: boolean | null
          isReview: boolean | null
          japanese: string | null
          pitchStr: string | null
          targetBPM: number | null
          title: string | null
          uid: string | null
          workoutId: number | null
          workoutItemId: number | null
          workoutRecordId: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_workout_items_workoutId_fkey"
            columns: ["workoutId"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_workout_items_workoutId_fkey"
            columns: ["workoutId"]
            isOneToOne: false
            referencedRelation: "workouts_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_workout_record_rows_workoutItemId_fkey"
            columns: ["workoutItemId"]
            isOneToOne: false
            referencedRelation: "workout_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_workout_record_rows_workoutItemId_fkey"
            columns: ["workoutItemId"]
            isOneToOne: false
            referencedRelation: "workout_items_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_workout_record_rows_workoutRecordId_fkey"
            columns: ["workoutRecordId"]
            isOneToOne: false
            referencedRelation: "workout_records"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts_view: {
        Row: {
          created_at: string | null
          display: string | null
          id: number | null
          isDev: boolean | null
          isReview: boolean | null
          targetBPM: number | null
          title: string | null
          uid: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_feedback_and_log: {
        Args: {
          p_answer: string
          p_elapsed_ms_since_first_play: number
          p_elapsed_ms_since_item_view: number
          p_feedback_md: string
          p_listened_full_count: number
          p_plays_count: number
          p_self_comp: number
          p_sentence_id: string
          p_user_id: string
        }
        Returns: {
          article_id: string
          completed: boolean
          logged: boolean
          saved: boolean
        }[]
      }
      delete_thumbnail_and_image: {
        Args: { p_image_id: string }
        Returns: undefined
      }
      get_article_answers_for_modal: {
        Args: { p_article_id: string; p_user_id?: string }
        Returns: {
          answer: string
          content: string
          seq: number
        }[]
      }
      get_or_create_dictation_tag: {
        Args: { p_label: string }
        Returns: string
      }
      get_release_article_tags: {
        Args: { p_uid: string }
        Returns: {
          created_at: string
          id: string
          journal_body: string
          journal_created_at: string
          pos: number
          tags: string[]
          title: string
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      immutable_unaccent: {
        Args: { "": string }
        Returns: string
      }
      insert_thumbnail_with_image: {
        Args: { p_file_name: string; p_storage_path: string; p_user_id: string }
        Returns: {
          image_id: string
        }[]
      }
      publish_release: {
        Args: { p_release_id: string; p_user_id: string }
        Returns: undefined
      }
      save_dictation_journal: {
        Args: { p_article_id: string; p_body: string; p_user_id?: string }
        Returns: undefined
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      chat_role: "system" | "user" | "assistant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      chat_role: ["system", "user", "assistant"],
    },
  },
} as const
