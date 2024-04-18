import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Table from "../components/Table";
import EditCategoryModal from "../components/EditCategoryModal";
import CreateCategoryModal from "../components/CreateCategoryModal";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../hooks/categoryHook";
import { Category } from "../../types/Category";
import { useQueryClient } from "@tanstack/react-query";

const CategoryList = () => {
  const {
    data: categories,
    isLoading,
    error,
    refetch: refetchCategories,
  } = useGetCategoriesQuery();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<Category | null>(null);
  const queryClient = useQueryClient();
  const { mutate: deleteCategory } = useDeleteCategoryMutation();

  const openEditModal = (category: Category) => {
    setCurrentCategory(category);
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCategoryUpdate = () => {
    queryClient.refetchQueries({ queryKey: ["getCategories"] });
  };

  const handleCategoryCreate = () => {
    queryClient.refetchQueries({ queryKey: ["getCategories"] });
  };

  const handleDelete = (item: {
    _id: string;
    name: string;
    description: string;
  }) => {
    deleteCategory(item._id, {
      onSuccess: () => {
        refetchCategories();
      },
      onError: (error) => {
        console.error("Error deleting category:", error);
      },
    });
  };

  const categoriesProcessed = useMemo(
    () =>
      categories?.map((category) => ({
        ...category,
      })) || [],
    [categories]
  );

  const columns = useMemo(
    () => [
      {
        _id: "nameColumn",
        key: "name" as const,
        label: "Name",
      },
      {
        _id: "slugColumn",
        key: "slug" as const,
        label: "Slug",
      },
      {
        _id: "descriptionColumn",
        key: "description" as const,
        label: "Description",
      },
      {
        _id: "imageColumn",
        key: "urlImage" as const,
        label: "Image",
      },
    ],
    []
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching categories</div>;

  return (
    <div>
      <Helmet>
        <title>Category List</title>
      </Helmet>
      <h2>Category List</h2>
      <Table
        data={categoriesProcessed}
        columns={columns}
        onAdd={openCreateModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />
      {showCreateModal && (
        <CreateCategoryModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onCategoryCreate={handleCategoryCreate}
        />
      )}
      {currentCategory && (
        <EditCategoryModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          category={currentCategory}
          onCategoryUpdate={handleCategoryUpdate}
        />
      )}
    </div>
  );
};

export default CategoryList;
