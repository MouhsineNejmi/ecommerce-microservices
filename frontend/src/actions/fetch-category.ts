import { Category } from '@/types/category';

export async function fetchCategory(categoryId: string): Promise<{
  data: Category[];
}> {
  try {
    const res = await fetch(
      `http://localhost:4000/api/categories/${categoryId}`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch categories: ', error);
    throw error;
  }
}
