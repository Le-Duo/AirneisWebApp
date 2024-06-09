import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
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

interface SalesByCatPiechart {
  category: string;
  date: string;
  total: number;
}

interface CategoryCount {
  [category: string]: number;
}

interface DateCategoryAggregate {
  [date: string]: CategoryCount;
}

interface CategoryData {
  [category: string]: number;
}

interface AggregatedData {
  [date: string]: CategoryData;
}

interface PieChartData {
  name: string;
  value: number;
}

const SalesByCatPiechart = () => {
  const { orders } = useSalesDataByDay();

  function normalizeDate(date: string) {
    return new Date(date).toISOString().split('T')[0];
  }

  // Grouper les données par date et par catégorie
  const groupByDateAndCategory = (orders: { createdAt: string; orderItems: { category: { name: string } | null; quantity: number }[] }[]): DateCategoryAggregate => {
    return orders.reduce<DateCategoryAggregate>((acc, order) => {
      const date = normalizeDate(order.createdAt);
      order.orderItems.forEach((item: { category: { name: string } | null; quantity: number }) => {
        const category = item.category && typeof item.category === 'object' && item.category.name ? item.category.name : 'Unknown';
        const quantity = item.quantity;

        if (!acc[date]) {
          acc[date] = {};
        }
        if (!acc[date][category]) {
          acc[date][category] = 0;
        }
        acc[date][category] += quantity;
      });
      return acc;
    }, {});
  };
  const transformData = (data: AggregatedData): PieChartData[] => {
    const result: PieChartData[] = [];
    for (const date in data) {
      for (const category in data[date]) {
        const existingCategory = result.find((item) => item.name === category);
        if (existingCategory) {
          existingCategory.value += data[date][category];
        } else {
          result.push({ name: category, value: data[date][category] });
        }
      }
    }
    return result;
  };

  const groupedData = groupByDateAndCategory(orders);
  const pieChartData = transformData(groupedData);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Pie
          data={pieChartData}
          cx={200}
          cy={200}
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const getCategoryColor = (category: string): string => {
  return categoryColors[category] || '#000000'; // Couleur noire par défaut si la catégorie n'est pas définie
};

export default SalesByCatPiechart;

