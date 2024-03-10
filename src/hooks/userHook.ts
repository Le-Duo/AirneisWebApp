import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import apiClient from '../apiClient'
import { UserAddress, UserInfo } from '../types/UserInfo'

// ici on utilise useMutation de react-query pour faire des requetes post signup et signin, mutation est un hook qui permet de faire des requetes post, put, delete (CRUD)
export const userSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) =>
      (await apiClient.post<UserInfo>(`api/users/signin`, { email, password }))
        .data,
  })

//même principe que pour la requete post signin mais ici on ajoute name dans les parametres de la fonction
export const userSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signup`, {
          name,
          email,
          password,
        })
      ).data,
  })
export const usePasswordResetRequestMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return (
        await apiClient.post('api/users/password-reset-request', { email })
      ).data
    },
  })
}

export const usePasswordResetMutation = (): UseMutationResult<
  unknown,
  Error,
  { token: string; newPassword: string },
  unknown
> => {
  return useMutation({
    mutationFn: async ({
      token,
      newPassword,
    }: {
      token: string
      newPassword: string
    }) => {
      return (
        await apiClient.post('api/users/password-reset', { token, newPassword })
      ).data
    },
  })
}

export const useGetUsersQuery = (): UseQueryResult<UserInfo[], Error> => {
  return useQuery({
    queryKey: ['getUsers'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('api/users')
        return response.data
      } catch (error) {
        // Handle or throw the error appropriately
        throw new Error('Failed to fetch users')
      }
    },
  })
}

export const useGetUserByIdQuery = (userId: string): UseQueryResult<UserInfo, Error> => {
  return useQuery({
    queryKey: ['getUser', userId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`api/users/${userId}`)
        return response.data
      } catch (error) {

        throw new Error('Failed to fetch user')
      }
    },
  })
}

export const useUpdateUserMutation = (userId: string) => 
useMutation({
  mutationFn: async (user: {
    name: string
    email:string
    address:UserAddress
  }) =>
  (
    await apiClient.put<{ user: UserInfo }>(
      `api/users/${userId}`,
      user
    )
  ).data,
})
