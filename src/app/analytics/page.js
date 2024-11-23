'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Text,
  Grid,
  Col,
  LineChart,
  BarChart,
  DonutChart,
  Flex,
  Badge,
  Metric,
} from '@tremor/react';

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Dummy data for charts
  const chartdata = [
    {
      date: "Jan",
      "Link Clicks": 650,
      "Active Users": 450,
    },
    {
      date: "Feb",
      "Link Clicks": 590,
      "Active Users": 400,
    },
    {
      date: "Mar",
      "Link Clicks": 800,
      "Active Users": 600,
    },
    {
      date: "Apr",
      "Link Clicks": 810,
      "Active Users": 550,
    },
    {
      date: "May",
      "Link Clicks": 960,
      "Active Users": 700,
    },
    {
      date: "Jun",
      "Link Clicks": 1200,
      "Active Users": 800,
    },
  ];

  const dailyData = [
    { day: "Mon", "Active Users": 65 },
    { day: "Tue", "Active Users": 59 },
    { day: "Wed", "Active Users": 80 },
    { day: "Thu", "Active Users": 81 },
    { day: "Fri", "Active Users": 56 },
    { day: "Sat", "Active Users": 40 },
    { day: "Sun", "Active Users": 45 },
  ];

  const categoryData = [
    { name: "Social", value: 40 },
    { name: "Business", value: 30 },
    { name: "Personal", value: 20 },
    { name: "Other", value: 10 },
  ];

  const stats = [
    {
      title: 'Total Links',
      value: '1,234',
      change: '+12.3%',
      isPositive: true,
    },
    {
      title: 'Total Clicks',
      value: '45.6K',
      change: '+8.7%',
      isPositive: true,
    },
    {
      title: 'Avg. Click Rate',
      value: '3.45%',
      change: '-2.1%',
      isPositive: false,
    },
    {
      title: 'Active Links',
      value: '892',
      change: '+5.4%',
      isPositive: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="mt-2 h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>

            {/* Charts Grid Skeleton */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Unable to load analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Title className="text-3xl">Analytics</Title>
          <Text>Track your link performance and user engagement</Text>
        </div>

        {/* Stats Grid */}
        <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <Flex>
                <Text>{stat.title}</Text>
                <Badge color={stat.isPositive ? "emerald" : "red"}>
                  {stat.change}
                </Badge>
              </Flex>
              <Metric>{stat.value}</Metric>
            </Card>
          ))}
        </Grid>

        {/* Charts Grid */}
        <Grid numItems={1} numItemsLg={2} className="gap-6">
          {/* Line Chart */}
          <Col numColSpan={1} numColSpanLg={2}>
            <Card>
              <Title>Link Performance Over Time</Title>
              <LineChart
                className="h-80 mt-4"
                data={chartdata}
                index="date"
                categories={["Link Clicks", "Active Users"]}
                colors={["emerald", "blue"]}
              />
            </Card>
          </Col>

          {/* Bar Chart */}
          <Card>
            <Title>Daily Active Users</Title>
            <BarChart
              className="h-80 mt-4"
              data={dailyData}
              index="day"
              categories={["Active Users"]}
              colors={["violet"]}
            />
          </Card>

          {/* Donut Chart */}
          <Card>
            <Title>Link Categories Distribution</Title>
            <DonutChart
              className="h-80 mt-4"
              data={categoryData}
              category="value"
              index="name"
              colors={["rose", "cyan", "amber", "indigo"]}
            />
          </Card>

          {/* Coming Soon Card */}
          <Card>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Title className="mb-2">More Analytics Coming Soon!</Title>
                <Text>
                  We're working on adding more insights and analytics features to help you track your link performance better.
                </Text>
              </div>
            </div>
          </Card>
        </Grid>
      </div>
    </div>
  );
}
