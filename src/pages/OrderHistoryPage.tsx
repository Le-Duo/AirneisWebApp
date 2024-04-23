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
  const { t } = useTranslation();
  const navigate = useNavigate()
  const { data: Orders, isLoading, error } = useGetOrderHistoryQuery()

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
                  {order.createdAt ? order.createdAt.substring(0, 10) : t('N/A')}
                </td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid
                    ? order.paidAt
                    ? (order.paidAt instanceof Date ? order.paidAt.toISOString() : order.paidAt).substring(0, 10)
                      : t('N/A')
                    : t('No')}
                </td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt
                    ? (order.deliveredAt instanceof Date ? order.deliveredAt.toISOString() : order.deliveredAt).substring(0, 10)
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
