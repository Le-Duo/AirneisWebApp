import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ReferenceLine, BarChart, Bar } from 'recharts';
import { useSalesByCategories, useSalesDataByDay } from '../../hooks/orderHook';
import { Order } from '../../types/Order';
import { Category } from '../../types/Category';

interface SaleData {
  name: string;
  sales: number;
  orders: number;
  category?: {
    name: string;
  };
}

interface IProduct {
  _id: string;
  quantity: number;
  price: number;
  category: string;
}
interface IOrdersProps {
  orders: Order[];
}

interface IOrder {
  createdAt: string;
  orderItems: IProduct[];
}

interface AverageBasketByDateAndCategory {
  category: string;
  date: string;
  averageBasket: number;
}

const Dashboard = () => {
  const { salesData, orders, isLoading: ordersLoading, isError: ordersError } = useSalesDataByDay();
  const salesByCategories = useSalesByCategories(orders);

  // State to keep track of the selected range in the Brush component
  const [selectedRange, setSelectedRange] = useState([0, salesData.length]);

  if (ordersLoading) return <div>Loading...</div>;
  if (ordersError) return <div>Error loading data</div>;

  // Calculate average sales based on the selected range
  const averageSales =
    salesData
      .slice(selectedRange[0], selectedRange[1]) // Use the selected range for calculation
      .reduce((acc: number, cur: SaleData) => acc + cur.sales, 0) /
    (selectedRange[1] - selectedRange[0]);

  // async function getCategoryByProductId(id: string): Promise<string> {
  //   // Ici, remplacez par votre logique pour appeler l'API ou la base de données
  //   const response = await fetch(`api/product/id/${id}`);
  //   const data = await response.json();
  //   console.log('data:', data);
  //   return data.Category.name;
  // }

  // const enrichOrdersWithCategories = async (orders: IOrder[]): Promise<IOrder[]> => {
  //   for (let order of orders) {
  //     for (let product of order.orderItems) {
  //       product.category = await getCategoryByProductId(product._id);
  //     }
  //   }
  //   return orders;
  // };


 
  // const calculateAverageBasketByDate = (orders: IOrder[]): AverageBasketByDate[] => {

  //   if (!orders) {
  //     return []
  //   }
  //   const totalsByDate: { [key: string]: { totalSales: number; totalItems: number } } = {};
  //   // Accumuler les ventes et les quantités pour chaque date
  //   orders.forEach((order) => {
  //     if (!totalsByDate[order.createdAt]) {
  //       totalsByDate[order.createdAt] = { totalSales: 0, totalItems: 0 };
  //     }
  //     const orderTotal = order.orderItems.reduce((sum, product) => sum + product.price * product.quantity, 0);
  //     const itemCount = order.orderItems.reduce((count, product) => count + product.quantity, 0);
  //     totalsByDate[order.createdAt].totalSales += orderTotal;
  //     totalsByDate[order.createdAt].totalItems += itemCount;
  //   });

  //   // Transformer les données accumulées en un tableau de résultats
  //   const result: AverageBasketByDate[] = Object.keys(totalsByDate).map((date) => {
  //     const { totalSales, totalItems } = totalsByDate[date];
  //     const averageBasket = totalItems > 0 ? totalSales / totalItems : 0;
  //     return { date, averageBasket, category };
  //   });

  //   // Trier le tableau par date
  //   result.sort((a, b) => a.date.localeCompare(b.date));

  //   return result;
  // };

  const calculateAverageBasketByDateAndCategory = (orders: IOrder[]): AverageBasketByDateAndCategory[] => {
    const totalsByDateCategory: { [key: string]: { totalSales: number; totalItems: number } } = {};

    // Parcourir chaque commande et chaque produit pour accumuler les données
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

    // Convertir les données accumulées en un tableau structuré
    const result: AverageBasketByDateAndCategory[] = Object.keys(totalsByDateCategory).map((key) => {
      const [date, category] = key.split('&');
      const { totalSales, totalItems } = totalsByDateCategory[key];
      const averageBasket = totalItems > 0 ? totalSales / totalItems : 0;
      return { date, category, averageBasket };
    });

    // Trier le tableau par date, puis par catégorie
    result.sort((a, b) => a.date.localeCompare(b.date) || a.category.localeCompare(b.category));

    return result;
  };

  const averageBasketByDate = calculateAverageBasketByDateAndCategory(orders);

  console.log(averageBasketByDate);

  // Custom Tooltip component for more detailed information
  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: Record<string, unknown>[];
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: '#ffff',
            padding: '5px',
            border: '1px solid #cccc',
          }}
        >
          <p className="label">{`Date: ${label}`}</p>
          <p className="intro">{`Sales: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Dashboard</title>
      </Helmet>
      <div className="mt-3">
        <h2>Dashboard</h2>
        <div className="row">
          <div className="col-md-12">
            <h3>Total Sales by Day</h3>
            <div className="chart-container" style={{ display: 'flex', justifyContent: 'center' }}>
              <LineChart width={1100} height={400} data={salesData} margin={{ top: 5, right: 100, left: 100, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#0065BF" activeDot={{ r: 8 }} />
                <Brush
                  dataKey="name"
                  height={30}
                  stroke="#0065BF"
                  onChange={({ startIndex, endIndex }) => setSelectedRange([startIndex, endIndex])}
                />
                <ReferenceLine y={averageSales} label="Avg" stroke="red" strokeDasharray="3 3" />
              </LineChart>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <h3>Average Baskets by Category</h3>
            <BarChart width={600} height={300} data={averageBasketByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageBasket" fill="#82ca9d" />
            </BarChart>
          </div>
          {/* <div className="col-md-6">
            <h3>Sales Volume by Category</h3>
            <PieChart width={400} height={400}>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
              <Tooltip />
            </PieChart>
          </div> */}
        </div>
      </div>

      {/* TEST */}

      <div className="row mt-4">
        <div className="col-md-6">
          <h3>Total et moyenne des paniers par catégorie</h3>
          <BarChart data={salesByCategories}>
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
