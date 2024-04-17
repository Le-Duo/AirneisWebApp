import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Table from "../components/Table";
import EditProductModal from "../components/EditProductModal";
import CreateProductModal from "../components/CreateProductModal";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../hooks/productHook";
import { useGetCategoriesQuery } from "../../hooks/categoryHook";
import { Product } from "../../types/Product";
import { useQueryClient } from "@tanstack/react-query";

const ProductsList = () => {
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
    refetch,
  } = useGetProductsQuery(null);
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  const { mutate: deleteProduct } = useDeleteProductMutation();

  const handleEdit = async (product: Product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  }

  const handleProductUpdate = () => {
    queryClient.refetchQueries({ queryKey: ["getProducts"] });
  };

  const handleProductCreate = () => {
    queryClient.refetchQueries({ queryKey: ["getProducts"] });
  }

  const handleDelete = async (product: Product) => {
    if (typeof product._id === 'string') {
      deleteProduct(product._id, {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          console.error("Error deleting product:", error);
        },
      });
    } else {
      console.error("Product ID is undefined, cannot delete product.");
    }
  };

  const adjustedProducts = useMemo(
    () =>
      products?.map((product) => ({
        ...product,
        categoryName: product.category?.name,
        URLimages: product.URLimages,
      })) || [],
    [products]
  );

  const columns = useMemo(
    () => [
      {
        _id: "image",
        key: "URLimages" as const,
        label: "Image",
        renderer: (item: Product) => (
          <img
            src={item.URLimages[0]}
            alt={item.name}
            style={{ width: "100px", height: "auto" }}
          />
        ),
      },
      { _id: "name", key: "name" as const, label: "Name" },
      {
        _id: "slug",
        key: "slug" as const,
        label: "URL",
        renderer: (item: Product) =>
          `https://www.airneis.com/product/${item.slug}`,
      },
      { _id: "categoryName", key: "categoryName" as const, label: "Category" },
      { _id: "price", key: "price" as const, label: "Price" },
      { _id: "stock", key: "stock" as const, label: "Stock" },
      { _id: "description", key: "description" as const, label: "Description" },
      { _id: "priority", key: "priority" as const, label: "Priority" },
    ],
    []
  );

  if (productsLoading || categoriesLoading) return <div>Loading...</div>;
  if (productsError || categoriesError) return <div>Error fetching data</div>;

  return (
    <div>
      <Helmet>
        <title>Products List</title>
      </Helmet>
      <h2>Products List</h2>
      <Table
        data={adjustedProducts}
        columns={columns}
        onEdit={handleEdit}
        onAdd={handleCreate}
        onDelete={handleDelete}
      />
      {showCreateModal && (
        <CreateProductModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onProductCreate={handleProductCreate}
        />
      )}
      {currentProduct && categories && (
        <EditProductModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          product={currentProduct}
          categories={categories}
          onProductUpdate={handleProductUpdate}
        />
      )}
    </div>
  );
};

export default ProductsList;
