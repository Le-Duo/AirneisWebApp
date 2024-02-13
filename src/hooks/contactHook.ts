import apiClient from '../apiClient'
import { Contact } from '../types/Contact'
import { useMutation } from '@tanstack/react-query'

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