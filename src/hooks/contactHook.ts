import apiClient from '../apiClient'
import { Contact } from '../types/Contact'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateContactMutation = () =>
  useMutation({
    mutationFn: async (contact: {
      mail: string
      subject: string
      message: string
    }) => {
      console.log('Sending contact:', contact);
      const response = await apiClient.post<{ contact: Contact }>(
        'api/contact',
        contact
      );
      console.log('Contact sent:', response.data);
      return response.data;
    },
  })

export const useContactsQuery = () =>
  useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      console.log('Fetching contacts');
      const response = await apiClient.get<{ contacts: Contact[] }>('api/contact');
      console.log('Contacts fetched:', response.data);
      return response.data;
    },
  })
