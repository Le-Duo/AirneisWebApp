import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts";
import { useGetCategoriesQuery } from "../../hooks/categoryHook";
import { useSalesDataByDay } from "../../hooks/orderHook";
import { Order } from "../../types/Order";
import { Category } from "../../types/Category";

interface SaleData {
  name: string;
  sales: number;
  category?: {
    name: string;
  };
}

interface CategoryAggregate {
  [key: string]: {
    total: number;
    count: number;
  };
}

interface AverageBasketByCategory {
  name: string;
  average: number;
}

interface SalesByCategory {
  [categoryName: string]: number;
}

const Dashboard = () => {
  const {
    salesData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useSalesDataByDay();
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  // State to keep track of the selected range in the Brush component
  const [selectedRange, setSelectedRange] = useState([0, salesData.length]);

  if (ordersLoading || categoriesLoading) return <div>Loading...</div>;
  if (ordersError || categoriesError) return <div>Error loading data</div>;

  // Calculate average sales based on the selected range
  const averageSales =
    salesData
      .slice(selectedRange[0], selectedRange[1]) // Use the selected range for calculation
      .reduce((acc: number, cur: SaleData) => acc + cur.sales, 0) /
    (selectedRange[1] - selectedRange[0]);

  // Custom Tooltip component for more detailed information
  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: any[];
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <p className="label">{`Date: ${label}`}</p>
          <p className="intro">{`Sales: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  // Calculate Average Baskets by Category
  const categoryAggregates: CategoryAggregate = salesData?.reduce(
    (acc: CategoryAggregate, order: Order) => { 
      (order.orderItems || []).forEach((item) => {
        if (!item.category) return;
        // Assuming item.category.name is a string and can serve as a unique key
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

  // Calculate total sales for each category
  const calculateTotalSalesForCategories = (categories: Category[], salesData: SaleData[]) => {
    const salesByCategory = salesData.reduce((acc, sale) => {
      if (!sale.category) return acc;
      const categoryName = sale.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += sale.sales; // Assuming `sale.sales` holds the sale value
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
            <div
              className="chart-container"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <LineChart
                width={1100}
                height={400}
                data={salesData}
                margin={{ top: 5, right: 100, left: 100, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#0065BF"
                  activeDot={{ r: 8 }}
                />
                <Brush
                  dataKey="name"
                  height={30}
                  stroke="#0065BF"
                  onChange={({ startIndex, endIndex }) =>
                    setSelectedRange([startIndex, endIndex])
                  }
                />
                <ReferenceLine
                  y={averageSales}
                  label="Avg"
                  stroke="red"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <h3>Average Baskets by Category</h3>
            <BarChart width={600} height={300} data={averageBasketsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#82ca9d" />
            </BarChart>
          </div>
          <div className="col-md-6">
            <h3>Sales Volume by Category</h3>
            <PieChart width={400} height={400}>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
              />
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
