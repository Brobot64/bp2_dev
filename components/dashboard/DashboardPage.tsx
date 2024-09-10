import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from '../all.module.css';
import { useAuth } from '../../src/context/AuthProvider';
import StatsBox from '../StatsBox/Page';

interface AccessData {
  date: string;
  count: number;
}

interface RevenueData {
  date: string;
  total_revenue: number;
}

const DashboardPage: React.FC = () => {
  const { token, loggedUser } = useAuth();
  const [stats, setStats] = useState<{
    blvckcards: number;
    users: number;
    subscribers: number;
  }>({
    blvckcards: 0,
    users: 0,
    subscribers: 0,
  });
  const [accessData, setAccessData] = useState<AccessData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [revenue24Hours, setRevenue24Hours] = useState<RevenueData[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        console.error('No token available');
        return;
      }

      try {
        const statsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/stats`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setStats(statsResponse.data);

        const accessResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/track/stats`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setAccessData(accessResponse.data.accessData);

        const revenueResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/track/revenue-stats`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setRevenue24Hours(revenueResponse.data.revenue24Hours);
        setRevenueData(revenueResponse.data.revenue360Days);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStats();
  }, [token]);

  const handleUserDetailsClick = () => {
    console.log('User details button clicked');
  };

  const isAdmin = loggedUser?.role_id === 1;
  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.card} ${styles.w100}`}>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Welcome to the Dashboard, {loggedUser?.name}
        </p>
        <div className={styles.statsContainer}>
          <StatsBox title="Blvckcards" count={stats.blvckcards} />
          <StatsBox title="Users" count={stats.users} />
          <StatsBox title="Subscribers" count={stats.subscribers} />
        </div>

        <div style={{ marginTop: '40px' }}>
          <h3>User Access Statistics (Last 24 Hours to 180 Days)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={accessData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#f035ff"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {isAdmin && (
            <>
              <h3 style={{ marginTop: '40px' }}>
                Revenue Statistics (Last 24 Hours to 360 Days)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number | string) => {
                      if (typeof value === 'number') {
                        return `$${value.toFixed(2)}`;
                      }
                      return '$0.00';
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total_revenue"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
