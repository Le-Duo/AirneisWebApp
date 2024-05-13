import { Button, Table, Image, Pagination } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useGetOrderHistoryQuery } from '../hooks/orderHook';
import { ApiError } from '../types/APIError';
import { getError } from '../utils';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function OrderHistoryPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: Orders, isLoading, error } = useGetOrderHistoryQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const totalOrders = Orders?.length;
  const totalPages = Math.ceil(totalOrders! / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  let leftSide = currentPage - 2;
  if (leftSide <= 1) leftSide = 2;
  let rightSide = currentPage + 2;
  if (rightSide >= totalPages) rightSide = totalPages - 1;

  for (let number = leftSide; number <= rightSide; number++) {
    pageNumbers.push(number);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(i18n.language, { dateStyle: 'full', timeStyle: 'short' });
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = Orders?.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div>
      <Helmet>
        <title>{t('Order History')}</title>
      </Helmet>

      <h1>{t('Order History')}</h1>
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{getError(error as unknown as ApiError)}</MessageBox>
      ) : (
        <>
        <Pagination>
            <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
            <Pagination.Item onClick={() => paginate(1)} active={currentPage === 1}>1</Pagination.Item>
            {currentPage > 3 && <Pagination.Ellipsis disabled />}
            {pageNumbers.map(number => (
              <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                {number}
              </Pagination.Item>
            ))}
            {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}
            {totalPages > 1 && (
              <Pagination.Item onClick={() => paginate(totalPages)} active={currentPage === totalPages}>
                {totalPages}
              </Pagination.Item>
            )}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
          <Table responsive="sm" striped bordered hover>
            <thead>
              <tr>
                <th>{t('ID')}</th>
                <th>{t('DATE')}</th>
                <th>{t('TOTAL')}</th>
                <th>{t('ITEMS')}</th>
                <th className="d-none d-md-table-cell">{t('PAID')}</th>
                <th className="d-none d-md-table-cell">{t('DELIVERED')}</th>
                <th>{t('ACTIONS')}</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders!.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt ? formatDate(order.createdAt) : t('N/A')}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <Image key={index} src={item.image} thumbnail width="50" />
                    ))}
                  </td>
                  <td className="d-none d-md-table-cell">{order.isPaid ? (order.paidAt ? formatDate(order.paidAt) : t('N/A')) : t('No')}</td>
                  <td className="d-none d-md-table-cell">
                    {order.isDelivered ? (order.deliveredAt ? formatDate(order.deliveredAt) : t('N/A')) : t('No')}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                      aria-label={t('View details for order', { id: order._id })}
                    >
                      {t('Details')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
            <Pagination.Item onClick={() => paginate(1)} active={currentPage === 1}>1</Pagination.Item>
            {currentPage > 3 && <Pagination.Ellipsis disabled />}
            {pageNumbers.map(number => (
              <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                {number}
              </Pagination.Item>
            ))}
            {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}
            {totalPages > 1 && (
              <Pagination.Item onClick={() => paginate(totalPages)} active={currentPage === totalPages}>
                {totalPages}
              </Pagination.Item>
            )}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </>
      )}
    </div>
  );
}
