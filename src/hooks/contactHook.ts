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