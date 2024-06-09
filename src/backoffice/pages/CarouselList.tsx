import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Table from "../components/Table";
import EditCarouselModal from "../components/EditCarouselModal";
import CreateCarouselModal from "../components/CreateCarouselModal";
import {
  useGetCarouselItemsQuery,
  useDeleteCarouselItemMutation,
} from "../../hooks/carouselHook";
import { CarouselItem } from "../../types/Carousel";
import { useQueryClient } from "@tanstack/react-query";

const CarouselList = () => {
  const {
    data: carouselItems,
    isLoading,
    error,
    refetch: refetchCarouselItems,
  } = useGetCarouselItemsQuery();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentCarouselItem, setCurrentCarouselItem] =
    useState<CarouselItem | null>(null);
  const queryClient = useQueryClient();
  const { mutate: deleteCarouselItem } = useDeleteCarouselItemMutation();

  const openEditModal = (carouselItem: CarouselItem) => {
    setCurrentCarouselItem(carouselItem);
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCarouselUpdate = () => {
    queryClient.refetchQueries({ queryKey: ["getCarouselItems"] });
  };

  const handleCarouselCreate = () => {
    queryClient.refetchQueries({ queryKey: ["getCarouselItems"] });
  };

  const handleDelete = (item: {
    _id: string;
    src: string;
    alt: string;
    caption: string;
  }) => {
    deleteCarouselItem(item._id, {
      onSuccess: () => {
        refetchCarouselItems();
      },
      onError: (error) => {
        console.error("Error deleting carousel item:", error);
      },
    });
  };

  const carouselItemsProcessed = useMemo(
    () =>
      carouselItems?.map((carouselItem) => ({
        ...carouselItem,
      })) || [],
    [carouselItems]
  );

  const columns = useMemo(
    () => [
      {
        _id: "srcColumn", 
        key: "src" as const,
        label: "Image",
        renderer: (item: CarouselItem) => (
          <img
            src={item.src}
            alt={item.alt}
            style={{ width: "500px", height: "auto" }}
          />
        ),
      },
      {
        _id: "altColumn", 
        key: "alt" as const,
        label: "Alt Text",
      },
      {
        _id: "captionColumn", 
        key: "caption" as const,
        label: "Caption",
      },
    ],
    []
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching carousel items</div>;

  return (
    <div>
      <Helmet>
        <title>Carousel List</title>
      </Helmet>
      <h2>Carousel List</h2>
      <Table
        data={carouselItemsProcessed}
        columns={columns}
        onAdd={openCreateModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />
      {showCreateModal && (
        <CreateCarouselModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onCarouselItemCreate={handleCarouselCreate}
        />
      )}
      {currentCarouselItem && (
        <EditCarouselModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          carousel={currentCarouselItem}
          onCarouselUpdate={handleCarouselUpdate}
        />
      )}
    </div>
  );
};

export default CarouselList;
