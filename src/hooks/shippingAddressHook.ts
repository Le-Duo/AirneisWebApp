import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { ShippingAddress } from "../types/shippingAddress";

export const useShippingAddresses = () => {
  return useQuery<ShippingAddress[], Error>({
    queryKey: ["shippingAddresses"],
    queryFn: fetchShippingAddresses,
  });
};

const fetchShippingAddresses = async () => {
  const { data } = await apiClient.get("/api/shippingaddresses");
  return data;
};

export const useCreateShippingAddress = () =>
  useMutation({
    mutationFn: async (shippingAddress: ShippingAddress) => {
      return (await apiClient.post("/api/shippingaddresses", shippingAddress))
        .data;
    },
  });
