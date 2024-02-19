import { useQuery } from '@tanstack/react-query';
import apiClient from '../apiClient';
import { ShippingAddress } from '../types/shippingAdress';

//get from /api/shippingAdress

export const useShippingAddresses = () => {
    return useQuery<ShippingAddress[], Error>({
      queryKey: ['shippingAddresses'],
      queryFn: fetchShippingAddresses
    });
  };

    const fetchShippingAddresses = async () => {
        const { data } = await apiClient.get('/api/shippingAddress');
        return data;
    };
