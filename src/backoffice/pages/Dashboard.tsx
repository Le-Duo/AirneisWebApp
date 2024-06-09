import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ReferenceLine } from 'recharts';
import { useSalesDataByDay } from '../../hooks/orderHook';
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
  const { salesData, isLoading: ordersLoading, isError: ordersError } = useSalesDataByDay();

  
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
