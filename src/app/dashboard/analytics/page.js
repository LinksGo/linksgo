'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BarChart, LineChart, DonutChart } from '@tremor/react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/use-toast";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [clickData, setClickData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setRefreshing(true);
      // Simulate API delay for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dummy data for demonstration
      setClickData([
        { date: 'Jan 01', clicks: 100 },
        { date: 'Jan 02', clicks: 150 },
        { date: 'Jan 03', clicks: 200 },
        { date: 'Jan 04', clicks: 175 },
        { date: 'Jan 05', clicks: 225 },
        { date: 'Jan 06', clicks: 250 },
        { date: 'Jan 07', clicks: 300 },
      ]);

      setDeviceData([
        { device: 'Desktop', value: 45 },
        { device: 'Mobile', value: 35 },
        { device: 'Tablet', value: 20 },
      ]);

      setLocationData([
        { country: 'United States', visits: 450 },
        { country: 'United Kingdom', visits: 320 },
        { country: 'Canada', visits: 280 },
        { country: 'Germany', visits: 220 },
        { country: 'France', visits: 190 },
      ]);

      toast({
        title: "Analytics Updated",
        description: "Your analytics data has been refreshed.",
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to refresh analytics data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Chart customization for dark/light mode
  const chartColors = {
    blue: {
      light: '#2563eb',
      dark: '#60a5fa',
    },
    violet: {
      light: '#7c3aed',
      dark: '#a78bfa',
    },
    emerald: {
      light: '#059669',
      dark: '#34d399',
    },
    amber: {
      light: '#d97706',
      dark: '#fbbf24',
    },
    slate: {
      light: '#475569',
      dark: '#94a3b8',
    },
  };

  const chartConfig = {
    // Common chart configuration
    grid: {
      stroke: 'currentColor',
      strokeOpacity: 0.1,
    },
    xAxis: {
      stroke: 'currentColor',
      strokeOpacity: 0.4,
      tickStroke: 'currentColor',
    },
    yAxis: {
      stroke: 'currentColor',
      strokeOpacity: 0.4,
      tickStroke: 'currentColor',
    },
    tooltip: {
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)',
      borderColor: 'var(--border)',
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchAnalyticsData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path d="M14.486 10.172a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M5 12l14 0" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.6K</div>
            <p className="text-xs text-muted-foreground">
              +8.7% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.45%</div>
            <p className="text-xs text-muted-foreground">
              -2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              +5.4% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Link Clicks</CardTitle>
            <CardDescription>Daily click trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full dark:text-gray-100">
              <LineChart
                data={clickData}
                index="date"
                categories={["clicks"]}
                colors={[chartColors.blue.dark]}
                showLegend={true}
                showGridLines={true}
                startEndOnly={false}
                showXAxis={true}
                showYAxis={true}
                yAxisWidth={40}
                className="h-full w-full"
                customTooltip={({ payload }) => (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Date
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload?.[0]?.payload.date}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Clicks
                        </span>
                        <span className="font-bold">
                          {payload?.[0]?.payload.clicks}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>Clicks by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full dark:text-gray-100">
              <DonutChart
                data={deviceData}
                category="value"
                index="device"
                colors={[
                  chartColors.blue.dark,
                  chartColors.violet.dark,
                  chartColors.emerald.dark,
                ]}
                showAnimation={true}
                showTooltip={true}
                showLabel={true}
                valueFormatter={(value) => `${value}%`}
                className="h-full w-full"
                customTooltip={({ payload }) => (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Device
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload?.[0]?.payload.device}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Percentage
                        </span>
                        <span className="font-bold">
                          {payload?.[0]?.payload.value}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>Most active countries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full dark:text-gray-100">
              <BarChart
                data={locationData}
                index="country"
                categories={["visits"]}
                colors={[chartColors.violet.dark]}
                showLegend={false}
                showGridLines={true}
                startEndOnly={false}
                showXAxis={true}
                showYAxis={true}
                yAxisWidth={40}
                className="h-full w-full"
                customTooltip={({ payload }) => (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Country
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload?.[0]?.payload.country}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Visits
                        </span>
                        <span className="font-bold">
                          {payload?.[0]?.payload.visits}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Section */}
      <Card className="p-8 text-center">
        <CardHeader>
          <CardTitle className="text-2xl">🚀 Enhanced Analytics Coming Soon!</CardTitle>
          <CardDescription className="text-lg mt-2">
            We&apos;re working on bringing you powerful analytics features including:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
            <div className="space-y-2">
              <div className="text-xl font-semibold">📊 Advanced Metrics</div>
              <p className="text-muted-foreground">Deeper insights into your link performance</p>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-semibold">🌍 Geographic Data</div>
              <p className="text-muted-foreground">Visitor locations and demographics</p>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-semibold">📱 Device Analytics</div>
              <p className="text-muted-foreground">Track visitor devices and platforms</p>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-semibold">⚡ Real-time Stats</div>
              <p className="text-muted-foreground">Live tracking of link interactions</p>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-semibold">📈 Custom Reports</div>
              <p className="text-muted-foreground">Create and export custom analytics reports</p>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-semibold">🎯 Goal Tracking</div>
              <p className="text-muted-foreground">Set and monitor link performance goals</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
