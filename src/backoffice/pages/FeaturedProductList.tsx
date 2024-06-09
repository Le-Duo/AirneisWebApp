import { useState, useEffect } from 'react';
import {
  useCreateFeaturedProductMutation,
  useGetFeaturedProductsQuery,
  useUpdateFeaturedProductMutation,
  useDeleteFeaturedProductMutation
} from '../../hooks/featuredProductHook';
import { useGetProductsQuery } from '../../hooks/productHook';
import { FeaturedProduct } from '../../types/FeaturedProduct';
import FeaturedProductFormModal from '../components/FeaturedProductFormModal';
import Table, { Column } from '../components/Table';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import { Product } from '../../types/Product';

const FeaturedProductList = () => {
  const { data: products, isLoading: isLoadingProducts } = useGetProductsQuery(null); 
  const { data: featuredProducts, isLoading: isLoadingFeaturedProducts } = useGetFeaturedProductsQuery();
  const createMutation = useCreateFeaturedProductMutation();
  const updateMutation = useUpdateFeaturedProductMutation();
  const deleteMutation = useDeleteFeaturedProductMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FeaturedProduct | undefined>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoadingProducts && !isLoadingFeaturedProducts && featuredProducts && products) {
      featuredProducts.forEach((fp) => {
        if (fp.product) {
          const productDetails = products.find((p) => p._id === fp.product._id);
          if (productDetails) {
            fp.product = { ...productDetails, _id: productDetails._id! };
          }
        }
      });
    }
  }, [products, featuredProducts, isLoadingProducts, isLoadingFeaturedProducts]);

  if (isLoadingProducts || isLoadingFeaturedProducts) return <Modal show={true} centered><Modal.Body><Spinner animation="border" /></Modal.Body></Modal>;

  const handleAddProduct = async (productId: string) => {
    const productToAdd = products?.find(product => product._id === productId);
    if (productToAdd && productToAdd._id !== undefined) {
      await createMutation.mutateAsync({
        product: {
          ...productToAdd,
          _id: productToAdd._id as string
        },
        order: 0,
        productDetails: {
          name: productToAdd.name,
          slug: productToAdd.slug,
          URLimages: productToAdd.URLimages,
          description: productToAdd.description,
          materials: productToAdd.materials,
          price: productToAdd.price,
        }
      });
    }
  };

  const handleEditProduct = async (productId: string) => {
    const productToEdit = featuredProducts?.find(product => product._id === productId);
    if (productToEdit) {
      await updateMutation.mutateAsync({ id: productId, order: productToEdit.order });
    }
  };

  const handleDeleteProduct = async (product: FeaturedProduct) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this product?');
    if (isConfirmed && product._id) {
      await deleteMutation.mutateAsync(product._id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['getFeaturedProducts'] });
        },
      });
    } else {
      console.error('Product ID is undefined');
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (selectedProductId: string) => {
    if (editingProduct) {
      await handleEditProduct(selectedProductId);
    } else {
      await handleAddProduct(selectedProductId);
    }
    setIsModalOpen(false);
  };

  const nonFeaturedProducts = products?.filter(
    product => !featuredProducts?.find(fp => fp.product?._id === product._id)
  ) || [];

  const columns: Column<FeaturedProduct>[] = [
    {
      _id: 'URLimages',
      key: 'product',
      label: 'Image',
      renderer: (item) => (
        <img
          src={(item.product as Product )?.URLimages?.[0]}
          alt={(item.product as Product )?.name}
          style={{ width: '300px', height: 'auto' }}
        />
      ),
    },
    {
      _id: 'name',
      key: 'product',
      label: 'Name',
      renderer: (item) => (item.product as Product)?.name,
    },
    {
      _id: 'category',
      key: 'product',
      label: 'Category',
      renderer: (item) => (item.product as Product)?.category?.name,
    },
  ];

  return (
    <div>
      <h2>Featured Products</h2>
      <Button variant="primary" onClick={handleOpenAddModal} className="mb-3">Add New Product</Button>
      <Table
        data={featuredProducts || []}
        columns={columns}
        onDelete={handleDeleteProduct}
      />
      <FeaturedProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        products={nonFeaturedProducts}
      />
    </div>
  );
};

export default FeaturedProductList;
