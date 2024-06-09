import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { Category } from '../types/Category';

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],

    queryFn: async () => (await apiClient.get<Category[]>(`api/categories`)).data,
  });

export const useGetCategoryDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['categories', slug],

    queryFn: async () => (await apiClient.get<Category>(`api/categories/slug/${slug}`)).data,
  });

export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationFn: async (category: Category) => (await apiClient.post<Category>(`api/categories`, category)).data,
  });
};

export const useUpdateCategoryMutation = () => {
  return useMutation({
    mutationFn: async (category: Category) => (await apiClient.put<Category>(`api/categories/${category._id}`, category)).data,
  });
};

export const useDeleteCategoryMutation = () => {
  return useMutation({
    mutationFn: async (categoryId: string) => (await apiClient.delete(`api/categories/${categoryId}`)).data,
  });
};
