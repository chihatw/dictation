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
      dictation_article_collections: {
        Row: {
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      dictation_articles: {
        Row: {
          audio_path_full: string | null
          collection_id: string
          created_at: string
          id: string
          seq: number
          subtitle: string
        }
        Insert: {
          audio_path_full?: string | null
          collection_id: string
          created_at?: string
          id?: string
          seq: number
          subtitle?: string
        }
        Update: {
          audio_path_full?: string | null
          collection_id?: string
          created_at?: string
          id?: string
          seq?: number
          subtitle?: string
        }
        Relationships: [
          {
            foreignKeyName: "dictation_articles_collection_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "dictation_article_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      dictation_journals: {
        Row: {
          article_id: string
          body: string
          created_at: string
          id: string
          rating_score: number
        }
        Insert: {
          article_id: string
          body: string
          created_at?: string
          id?: string
          rating_score?: number
        }
        Update: {
          article_id?: string
          body?: string
          created_at?: string
          id?: string
          rating_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "dictation_journals_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: true
            referencedRelation: "dictation_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      dictation_releases: {
        Row: {
          collection_id: string
          created_at: string
          due_at: string
          id: string
          published_at: string | null
          user_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          due_at: string
          id?: string
          published_at?: string | null
          user_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          due_at?: string
          id?: string
          published_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dictation_releases_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "dictation_article_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dictation_releases_user_id_users_uid_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uid"]
          },
        ]
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
        ]
      }
      dictation_submissions: {
        Row: {
          answer: string
          created_at: string
          elapsed_ms_since_first_play: number
          elapsed_ms_since_item_view: number
          feedback_md: string | null
          id: string
          plays_count: number
          self_assessed_comprehension: number
          sentence_id: string
          teacher_feedback: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          elapsed_ms_since_first_play?: number
          elapsed_ms_since_item_view?: number
          feedback_md?: string | null
          id?: string
          plays_count?: number
          self_assessed_comprehension?: number
          sentence_id: string
          teacher_feedback?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          elapsed_ms_since_first_play?: number
          elapsed_ms_since_item_view?: number
          feedback_md?: string | null
          id?: string
          plays_count?: number
          self_assessed_comprehension?: number
          sentence_id?: string
          teacher_feedback?: string | null
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
      dictation_teacher_feedback_tags: {
        Row: {
          created_at: string
          id: string
          submission_id: string
          tag_master_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          submission_id: string
          tag_master_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          submission_id?: string
          tag_master_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dictation_teacher_feedback_tags_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "dictation_submissions"
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
    }
    Views: {
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
    }
    Functions: {
      create_feedback_and_log: {
        Args: {
          p_answer: string
          p_elapsed_ms_since_first_play: number
          p_elapsed_ms_since_item_view: number
          p_feedback_md: string
          p_plays_count: number
          p_self_comp: number
          p_sentence_id: string
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
      get_admin_releases_by_user: {
        Args: { p_user_id: string }
        Returns: {
          collection_id: string
          collection_title: string
          created_at: string
          due_at: string
          id: string
          published_at: string
          user_display: string
          user_id: string
        }[]
      }
      get_article_answers_for_modal: {
        Args: { p_article_id: string }
        Returns: {
          answer: string
          content: string
          seq: number
        }[]
      }
      get_article_page: {
        Args: { p_article_id: string }
        Returns: Json
      }
      get_collection_article_tags: {
        Args: { p_collection_id: string }
        Returns: {
          created_at: string
          id: string
          journal_body: string
          journal_created_at: string
          seq: number
          subtitle: string
          tags: string[]
        }[]
      }
      get_home_next_task: {
        Args: { p_uid: string }
        Returns: {
          collection_id: string
          collection_title: string
          done_count: number
          due_at: string
          end_at: string
          journals: Json
          next_article_id: string
          next_sentence_id: string
          sentence_seq: number
          start_at: string
          subtitle: string
          time_progress_pct: number
          total_count: number
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
          subtitle: string
          tags: string[]
          title: string
        }[]
      }
      get_submission_admin: {
        Args: { p_submission_id: string }
        Returns: Json
      }
      get_submission_latest: {
        Args: {
          p_article_id?: string
          p_limit?: number
          p_offset?: number
          p_user_id?: string
        }
        Returns: {
          answer: string
          article_id: string
          content: string
          created_at: string
          display: string
          elapsed_ms_since_first_play: number
          elapsed_ms_since_item_view: number
          id: string
          plays_count: number
          self_assessed_comprehension: number
          sentence_id: string
          seq: number
          subtitle: string
          title: string
          user_id: string
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
      insert_article_with_next_seq: {
        Args: { p_collection_id: string; p_subtitle: string }
        Returns: {
          id: string
          seq: number
        }[]
      }
      insert_thumbnail_with_image: {
        Args: { p_file_name: string; p_storage_path: string; p_user_id: string }
        Returns: {
          image_id: string
        }[]
      }
      journal_vote: {
        Args: { p_delta: number; p_id: string }
        Returns: undefined
      }
      list_journals_for_me: {
        Args: Record<PropertyKey, never>
        Returns: {
          article_id: string
          body: string
          created_at: string
          id: string
          rating_score: number
        }[]
      }
      save_dictation_journal: {
        Args: { p_article_id: string; p_body: string }
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
