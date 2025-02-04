export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          name: string;
          title: string;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          title: string;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string;
          image_url?: string | null;
          created_at?: string;
        };
      };
      employee_technology: {
        Row: {
          id: string;
          employee_id: string;
          technology_id: string;
          proficiency: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          technology_id: string;
          proficiency: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          technology_id?: string;
          proficiency?: number;
          created_at?: string;
        };
      };
      category_of_improvement: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      employee_category_of_improvement: {
        Row: {
          id: string;
          employee_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          category_id?: string;
          created_at?: string;
        };
      };
      technologies: {
        Row: {
          id: string;
          name: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          created_at?: string;
        };
      };
    };
  };
}
