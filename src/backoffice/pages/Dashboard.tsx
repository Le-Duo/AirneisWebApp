import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ReferenceLine, BarChart, Bar } from 'recharts';
import { useSalesByCategories, useSalesDataByDay } from '../../hooks/orderHook';
  import AverageBasketByCatBarchart from './../components/AverageBasketByCatBarchart';
  import SalesByCatPiechart from '../components/SalesByCatPiechart';

interface SaleData {
  name: string;
  sales: number;
  orders: number;
  category?: {
    name: string;
  };
}

const Dashboard = () => {
  const { salesData, orders, isLoading: ordersLoading, isError: ordersError } = useSalesDataByDay();
  const salesByCategories = useSalesByCategories(orders);

  
  const [selectedRange, setSelectedRange] = useState([0, salesData.length]);

  if (ordersLoading) return <div>Loading...</div>;
  if (ordersError) return <div>Error loading data</div>;

  
  const averageSales =
    salesData
      .slice(selectedRange[0], selectedRange[1]) 
      .reduce((acc: number, cur: SaleData) => acc + cur.sales, 0) /
    (selectedRange[1] - selectedRange[0]);

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

  const categoryAggregates: CategoryAggregate = salesData?.reduce(
    (acc: CategoryAggregate, order: Order) => { 
      (order.orderItems || []).forEach((item) => {
        if (!item.category) return;
        
        const categoryName = item.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = { total: 0, count: 0 };
        }
        acc[categoryName].total += item.price * item.quantity;
        acc[categoryName].count += item.quantity;
      });
      return acc;
    },
    {}
  );

  const averageBasketsByCategory: AverageBasketByCategory[] = Object.keys(
    categoryAggregates
  ).map((category) => ({
    name: category,
    average:
      categoryAggregates[category].total / categoryAggregates[category].count,
  }));

  
  const calculateTotalSalesForCategories = (categories: Category[], salesData: SaleData[]) => {
    const salesByCategory = salesData.reduce((acc, sale) => {
      if (!sale.category) return acc;
      const categoryName = sale.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += sale.sales; 
      return acc;
    }, {} as SalesByCategory);

    return categories.map(category => ({
      ...category,
      totalSales: salesByCategory[category.name] || 0,
    }));
  };

  const enhancedCategories = calculateTotalSalesForCategories(categories!, salesData);

  const categoryData = enhancedCategories?.map((category) => ({
    name: category.name,
    value: category.totalSales,
  }));

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
             <AverageBasketByCatBarchart />
          </div>
          <div className="col-md-6">
            <h3>Sales Volume by Category</h3>
            <SalesByCatPiechart />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
