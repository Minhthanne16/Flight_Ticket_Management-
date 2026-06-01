import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

// Hook để GET danh sách chuyến bay
export const useFlights = () => {
  return useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      const response = await axiosInstance.get('/flights');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Cache giữ trong 5 phút
  });
};

// Hook để GET chuyến bay theo ID
export const useFlight = (id) => {
  return useQuery({
    queryKey: ['flights', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/flights/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook để STAFF/ADMIN cập nhật chuyến bay
export const useUpdateFlight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put(`/flights/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Quan trọng: Khi update thành công, ép React Query fetch lại danh sách mới nhất
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['flights', variables.id] });
    },
  });
};
