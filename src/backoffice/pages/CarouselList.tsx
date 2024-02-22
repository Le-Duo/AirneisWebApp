import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import Table from '../components/Table'
import EditCarouselModal from '../components/EditCarouselModal'
import {
  useGetCarouselItemsQuery,
  useDeleteCarouselItemMutation,
} from '../../hooks/carouselHook' // Step 1: Import useDeleteCarouselItemMutation
import { CarouselItem } from '../../types/Carousel'
import { useQueryClient } from '@tanstack/react-query'

const CarouselList = () => {
  const { data: carouselItems, isLoading, error } = useGetCarouselItemsQuery()
  const [selectedCarouselItems] = useState<string[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentCarouselItem, setCurrentCarouselItem] =
    useState<CarouselItem | null>(null)
  const queryClient = useQueryClient()
  const { mutate: deleteCarouselItem } = useDeleteCarouselItemMutation() // Step 2: Get the mutation function

  const openEditModal = (carouselItem: CarouselItem) => {
    setCurrentCarouselItem(carouselItem)
    setShowEditModal(true)
  }

  const handleCarouselUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['getCarouselItems'] })
  }

  const handleDeleteCarouselItem = (item: CarouselItem) => {
    deleteCarouselItem(item._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getCarouselItems'] })
      },
    })
  }

  const handleDeleteSelectedCarouselItems = () => {
    selectedCarouselItems.forEach((id) => {
      deleteCarouselItem(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['getCarouselItems'] })
        },
      })
    })
  }

  const carouselItemsWithSelection = useMemo(
    () =>
      carouselItems?.map((carouselItem) => ({
        ...carouselItem,
        isSelected: selectedCarouselItems.includes(carouselItem._id),
      })) || [],
    [carouselItems, selectedCarouselItems]
  )

  const columns = useMemo(
    () => [
      { key: '_id' as const, label: 'ID' },
      {
        key: 'src' as const,
        label: 'Image',
        renderer: (item: CarouselItem) => (
          <img
            src={item.src}
            alt={item.alt}
            style={{ width: '500px', height: 'auto' }}
          />
        ),
      },
      { key: 'alt' as const, label: 'Alt Text' },
      { key: 'caption' as const, label: 'Caption' },
    ],
    []
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching carousel items</div>

  return (
    <div>
      <Helmet>
        <title>Carousel List</title>
      </Helmet>
      <h2>Carousel List</h2>
      <Table
        data={carouselItemsWithSelection}
        columns={columns}
        onEdit={openEditModal}
        onDelete={handleDeleteCarouselItem}
      />
      {currentCarouselItem && (
        <EditCarouselModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          carousel={currentCarouselItem}
          onCarouselUpdate={handleCarouselUpdate}
        />
      )}
    </div>
  )
}

export default CarouselList
