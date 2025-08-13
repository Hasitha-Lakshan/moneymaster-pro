// inside your categoriesSlice or types file
export interface Category {
  id: string;
  name: string;
  type?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  category_id: string;
}
