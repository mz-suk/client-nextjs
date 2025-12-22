export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoSearchParams {
  userId?: number;
  completed?: boolean;
}
