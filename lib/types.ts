export interface Course {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  price: number;
  duration: string;
  level: string;
  image_url: string | null;
  category_id: string;
  admin_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  rating?: number;
  students_count?: number;
  category?: {
    name: string;
    description: string | null;
  };
  admin?: {
    full_name: string;
  };
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  video_url: string | null;
  pdf_url: string | null;
  order_index: number;
  created_at: string;
  isCompleted?: boolean;
}

export interface CourseWithLessons extends Course {
  lessons: Lesson[];
}
