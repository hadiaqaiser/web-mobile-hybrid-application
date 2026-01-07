export type MediaType = 'none' | 'image' | 'video';

export type Post = {
  id: number;
  title: string;
  description: string;
  author: string;

  mediaType?: MediaType;
  mediaSrc?: string;

  isFavourite?: boolean;
};