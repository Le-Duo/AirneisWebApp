import apiClient from '../apiClient'
import { Contact } from '../types/Contact'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateContactMutation = () =>
  useMutation({
    mutationFn: async (contact: Contact) => { 
      console.log('Sending contact:', contact);
      const response = await apiClient.post<{ contact: Contact }>(
        'api/contact',
        {
          ...contact,
          userId: contact.user,
        }
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
export const useDeleteContactMutation = () =>
  useMutation({
    mutationFn: async (contactId: string) => {
      console.log('Deleting contact with ID:', contactId);
      const response = await apiClient.delete(`api/contact/${contactId}`);
      console.log('Contact deleted:', response.data);
      return response.data;
    },
  })
