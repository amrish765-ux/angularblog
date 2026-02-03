export interface Post {
  postId: number;
  title: string;
  content: string;
  imageName: string;
  addedDate: string;
  categoryDto: {
    categoriesId: number;
    categoriesTitle: string;
    categoryDescription: string;
  };
  userDto: {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
  };
  comments: { id: number; content: string }[];
}

