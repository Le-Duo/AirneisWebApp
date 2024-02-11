import { useState, useEffect, useCallback } from 'react'
import apiClient from '../apiClient'
import { CarouselItem } from '../types/Carousel'

const useCarousel = () => {
  const [items, setItems] = useState<CarouselItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await apiClient.get<CarouselItem[]>('/api/carousel')
      setItems(data)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Unexpected Error!')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = async (item: CarouselItem) => {
    try {
      const { data } = await apiClient.post<CarouselItem>('/api/carousel', item)
      setItems((prev) => [...prev, data])
    } catch (error: any) {
      setError(error.response?.data?.message || 'Unexpected Error!')
    }
  }

  const updateItem = async (id: string, item: Partial<CarouselItem>) => {
    try {
      const { data } = await apiClient.put<CarouselItem>(
        `/api/carousel/${id}`,
        item
      )
      setItems((prev) => prev.map((i) => (i._id === id ? data : i)))
    } catch (error: any) {
      setError(error.response?.data?.message || 'Unexpected Error!')
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await apiClient.delete(`/api/carousel/${id}`)
      setItems((prev) => prev.filter((i) => i._id !== id))
    } catch (error: any) {
      setError(error.response?.data?.message || 'Unexpected Error!')
    }
  }

  return { items, loading, error, addItem, updateItem, deleteItem }
}

export default useCarousel
