import { Order } from '../../types/Order';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { useSalesDataByDay } from '../../hooks/orderHook';

const categoryColors: { [key: string]: string } = {
  Unknown: '#8884d8', // Mauve
  Bookcases: '#82ca9d', // Vert doux
  Rugs: '#ffc658', // Jaune orangé
  Wardrobes: '#6e7f80', // Bleu Ardoise Clair
  Sofas: '#cc4f1b', // Terre de Sienne Brûlée
  Tables: '#decba4', // Beige Vanille
  Lamps: '#e1c699', // Jaune Sable
};

interface AverageBasketByDateAndCategory {
  category: string;
  date: string;
  averageBasket: number;
}

interface IProduct {
  _id: string;
  quantity: number;
  price: number;
  category: string;
}

interface IOrder {
  createdAt: string;
  orderItems: IProduct[];
}

interface CategoryData {
  [category: string]: number;
}

interface DateCategoryData {
  date: string;
  categories: CategoryData;
}

const transformData = (data: AverageBasketByDateAndCategory[]): DateCategoryData[] => {
  const groupedData = data.reduce<Record<string, DateCategoryData>>((acc, { date, category, averageBasket }) => {
    if (!acc[date]) {
      acc[date] = { date, categories: {} };
    }
    acc[date].categories[category] = averageBasket;
    return acc;
  }, {});

  return Object.values(groupedData);
};

const AverageBasketByCatBarchart = () => {
  const { orders } = useSalesDataByDay();

  const transformOrdersToIOrders = (orders: Order[]): IOrder[] => {
    return orders.map((order) => ({
      createdAt: order.createdAt,
      orderItems: order.orderItems.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        price: item.price,
        category: item.category ? item.category.name : 'Unknown',
      })),
    }));
  };

  const calculateAverageBasketByDateAndCategory = (orders: IOrder[]): AverageBasketByDateAndCategory[] => {
    const totalsByDateCategory: { [key: string]: { totalSales: number; totalItems: number } } = {};

    orders.forEach((order) => {
      order.orderItems.forEach((product) => {
        const dateOnly = order.createdAt.split('T')[0];
        const key = `${dateOnly}&${product.category}`;
        if (!totalsByDateCategory[key]) {
          totalsByDateCategory[key] = { totalSales: 0, totalItems: 0 };
        }
        totalsByDateCategory[key].totalSales += product.price * product.quantity;
        totalsByDateCategory[key].totalItems += product.quantity;
      });
    });

    return Object.keys(totalsByDateCategory)
      .map((key) => {
        const [date, category] = key.split('&');
        const { totalSales, totalItems } = totalsByDateCategory[key];
        const averageBasket = totalItems > 0 ? parseFloat((totalSales / totalItems).toFixed(2)) : 0;
        return { date, category, averageBasket };
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.category.localeCompare(b.category));
  };

  const enrichedOrders = transformOrdersToIOrders(orders);
  const averageBasketByDate = calculateAverageBasketByDateAndCategory(enrichedOrders);
  const barChartData = transformData(averageBasketByDate);

  const allCategories = new Set<string>();
  barChartData.forEach((item) => {
    Object.keys(item.categories).forEach((key) => {
      allCategories.add(key);
    });
  });

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={barChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Array.from(allCategories).map((category) => (
          <Bar key={category} dataKey={`categories.${category}`} stackId="a" fill={getCategoryColor(category)} />
        ))}
        <Brush height={30} stroke="#0065BF"></Brush>
      </BarChart>
    </ResponsiveContainer>
  );
};

const getCategoryColor = (category: string): string => {
  return categoryColors[category] || '#000000';
};

export default AverageBasketByCatBarchart;
