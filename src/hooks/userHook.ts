import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import apiClient from '../apiClient'
import { UserAddress, UserInfo } from '../types/UserInfo'
import { CreditCard } from '../types/CreditCard'

// ici on utilise useMutation de react-query pour faire des requetes post signup et signin, mutation est un hook qui permet de faire des requetes post, put, delete (CRUD)
export const useUserSigninMutation = () =>
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

export const useUserSignupMutation = () =>
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

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      return (await apiClient.delete(`api/users/${userId}`)).data
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

// update user
export const useUpdateUserMutation = (userId: string) => 
useMutation({
  mutationFn: async (user: {
    name: string
    email:string
    phoneNumber: string
  }) =>
  (
    await apiClient.put<{ user: UserInfo }>(
      `api/users/${userId}`,
      user
    )
  ).data,
})

// change default card for a user
export const useUpdateDefaultCardMutation = (userId: string) => 
useMutation({
  mutationFn: async (cardId: string) => {
    const response = await apiClient.put<{}>(`api/users/${userId}/payment/card/${cardId}/default`);
    return response.data;
}
})

// add credit card
export const useAddPaymentCardMutation = (userId: string) => 
useMutation({
  mutationFn: async (card: {
    bankName: string;
    number: string;
    fullName: string;
    monthExpiration: number;
    yearExpiration: number;
  }) => {
    const response = await apiClient.post<{ card: CreditCard }>(
        `api/users/${userId}/payment/card/add`,
        card
    );
    return response.data.card;
}
})

// add address to user
export const useAddAddressMutation = (userId: string) => 
useMutation({
  mutationFn: async (address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    const response = await apiClient.post<{ address: UserAddress }>(
        `api/users/${userId}/address/add`,
        address
    );
    return response.data.address;
}
})

// change default address for user
export const useUpdateDefaultAddressMutation = (userId: string) => 
useMutation({
  mutationFn: async (addressId: string) => {
    const response = await apiClient.put<{}>(`api/users/${userId}/address/${addressId}/default`);
    return response.data;
}
})

// update address
export const useUpdateAddressMutation = (userId: string, addressId: string) => 
useMutation({
  mutationFn: async (address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    const response = await apiClient.put<{ address: UserAddress }>(
        `api/users/${userId}/address/${addressId}`,
        address
    );
    return response.data.address;
}
})


