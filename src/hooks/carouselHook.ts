import {
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import apiClient from '../apiClient';
import { CarouselItem } from '../types/Carousel';

export const useGetCarouselItemsQuery = (): UseQueryResult<CarouselItem[], Error> => {
  return useQuery({
    queryKey: ['carouselItems'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('api/carousel');
        return response.data;
      }
      catch (error) {
        throw new Error('Failed to fetch carousel items');
      }
    },
    staleTime: 5 * 60 * 1000, // Adding stale while revalidate strategy
  });
};

export const useCreateCarouselItemMutation = () => {
  return useMutation({
    mutationFn: async (item: Partial<CarouselItem>) => {
      try {
        const response = await apiClient.post('api/carousel', item);
        return response.data;
      }
      catch (error) {
        throw new Error('Failed to create carousel item');
      }
    },
  });
};

export const useUpdateCarouselItemMutation = () => {
  return useMutation({
    mutationFn: async (item: CarouselItem) => {
      try {
        const response = await apiClient.put(`api/carousel/${item._id}`, item);
        return response.data;
      }
      catch (error) {
        throw new Error('Failed to update carousel item');
      }
    },
  });
};

export const useDeleteCarouselItemMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await apiClient.delete(`api/carousel/${id}`);
        return response.data;
      }
      catch (error) {
        throw new Error('Failed to delete carousel item');
      }
    },
  });
};