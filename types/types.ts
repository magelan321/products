export interface Product {
  id: number | string;
  title: string;
  description: string;
  category?: string;
  image?: string;
  liked?: boolean;
  created?: boolean;
  deleted?: boolean;
}

export interface DrinkResponse {
  idDrink: string;
  strDrink: string;
  strInstructions: string | null;
  strCategory: string | null;
  strDrinkThumb: string | null;
  [key: string]: string | null;
}

export interface ProductsState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  filter: "all" | "favorites";
  search: string;
  page: number;
  pageSize: number;
  editingProduct: Product | null;
}
