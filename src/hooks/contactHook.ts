import apiClient from '../apiClient'
import { Contact } from '../types/Contact'
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query'

//Création d'un message par formulaire de contact
export const useCreateContactMutation = () =>
  useMutation({
    mutationFn: async (contact: {
      mail: string
      subject: string
      message: string
    }) =>
      (
        await apiClient.post<{ contact: Contact }>(
          'api/contact',
          contact
        )
      ).data,
  })

export const useGetContactQuery = (): UseQueryResult<Contact[], Error> => {
  return useQuery({
    queryKey : ['getContacts'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('api/contact')
        return response.data.reverse()
      }catch(error) {
        throw new Error('Failed to fetch contact')
      }
    },
  })
}

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
