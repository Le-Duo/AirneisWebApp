import { Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { useGetOrderHistoryQuery } from '../hooks/orderHook'
import { ApiError } from '../types/APIError'
import { getError } from '../utils'
import { useTranslation } from 'react-i18next'

export default function OrderHistoryPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate()
  const { data: Orders, isLoading, error } = useGetOrderHistoryQuery()

  // Function to format date based on current language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(i18n.language, { dateStyle: 'full', timeStyle: 'short' });
  };

  return (
    <div>
      <Helmet>
        <title>{t('Order History')}</title>
      </Helmet>

      <h1>{t('Order History')}</h1>
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">
          {getError(error as unknown as ApiError)}
        </MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>{t('ID')}</th>
              <th>{t('DATE')}</th>
              <th>{t('TOTAL')}</th>
              <th>{t('PAID')}</th>
              <th>{t('DELIVERED')}</th>
              <th>{t('ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {Orders!.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.createdAt ? formatDate(order.createdAt) : t('N/A')}
                </td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid
                    ? order.paidAt
                      ? formatDate(order.paidAt)
                      : t('N/A')
                    : t('No')}
                </td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt
                      ? formatDate(order.deliveredAt)
                      : t('N/A')
                    : t('No')}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`)
                    }}
                  >
                    {t('Details')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}