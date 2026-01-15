export type ResourceFormData = {
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'article' | 'worksheet' | 'link';
  category: string;
  fileUrl: string;
  fileSize: string;
  global: boolean;
};

export type ResourceTypeFilter = 'all' | ResourceFormData['type'];


