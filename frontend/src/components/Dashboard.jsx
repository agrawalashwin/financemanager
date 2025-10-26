import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Paper, Grid, Card, CardContent, Typography, CircularProgress, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup, useTheme, Chip, Stack, TextField, Autocomplete, Button, Collapse, IconButton } from '@mui/material';
import { FilterList as FilterListIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import * as d3 from 'd3';
import axios from 'axios';
import KPICard from './KPICard';
import { nytimesColors } from '../theme/nytimesColors';
import { useLogger } from '../hooks/useLogger';
import { useAuth } from '../contexts/AuthContext';
import { SUBCATEGORIES } from '../config/constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuth();
  const log = useLogger('Dashboard');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chartType, setChartType] = useState('combined');
  const revenueChartRef = useRef();
  const expenseChartRef = useRef();
  const budgetChartRef = useRef();
  const categoryChartRef = useRef();
  const subcategoryChartRef = useRef();

  // Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedBudgets, setSelectedBudgets] = useState([]);
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'weekly'

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  // Get unique vendors and subcategories from transactions
  const uniqueVendors = useMemo(() => {
    const vendors = new Set();
    transactions.forEach(t => {
      if (t.vendor) vendors.add(t.vendor);
    });
    return Array.from(vendors).sort();
  }, [transactions]);

  const uniqueSubcategories = useMemo(() => {
    const subcats = new Set();
    transactions.forEach(t => {
      if (t.subcategory) subcats.add(t.subcategory);
    });
    return Array.from(subcats).sort();
  }, [transactions]);

  const uniqueBudgets = useMemo(() => {
    const budgets = new Set();
    transactions.forEach(t => {
      if (t.budget_name) budgets.add(t.budget_name);
    });
    return Array.from(budgets).sort();
  }, [transactions]);

  // Initialize date range on first load
  useEffect(() => {
    if (transactions.length > 0 && !startMonth && !endMonth) {
      const currentYear = new Date().getFullYear();
      setStartMonth(`${currentYear}-01`);
      setEndMonth(`${currentYear}-12`);
    }
  }, [transactions]);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      const [transRes, summaryRes] = await Promise.all([
        axios.get(`${API_URL}/transactions?userId=${user.id}`),
        axios.get(`${API_URL}/summary?userId=${user.id}`),
      ]);

      setTransactions(transRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate all 12 months of the current year starting from January
  const getMonthRange = () => {
    const months = [];
    const currentYear = new Date().getFullYear();

    // Generate all 12 months of the current year (Jan - Dec)
    for (let month = 1; month <= 12; month++) {
      const monthKey = `${currentYear}-${String(month).padStart(2, '0')}`;
      months.push(monthKey);
    }

    return months;
  };

  // Calculate occurrences of a transaction in a given month
  const getOccurrencesInMonth = (transaction, monthKey) => {
    const [year, month] = monthKey.split('-').map(Number);
    const startDate = new Date(transaction.start_date);
    const endDate = transaction.end_date ? new Date(transaction.end_date) : null;

    // Check if transaction is active in this month
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    if (startDate > monthEnd || (endDate && endDate < monthStart)) {
      return 0;
    }

    const freq = transaction.frequency;
    if (freq === 'one-time') {
      const txMonth = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
      return txMonth === monthKey ? 1 : 0;
    }

    // For recurring transactions, estimate occurrences per month
    const daysInMonth = monthEnd.getDate();
    switch (freq) {
      case 'daily':
        return daysInMonth;
      case 'weekly':
        // Average 4.33 weeks per month (52 weeks / 12 months)
        return 4.33;
      case 'biweekly':
        // Average 2.17 occurrences per month (26 biweeks / 12 months)
        return 2.17;
      case 'monthly':
        return 1;
      case 'quarterly':
        // 1/3 of quarterly amount per month
        return 1 / 3;
      case 'annual':
        // 1/12 of annual amount per month
        return 1 / 12;
      default:
        return 0;
    }
  };

  // Apply filters to transactions
  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      // Category filter
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

      // Subcategory filter
      if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(t.subcategory)) return false;

      // Vendor filter
      if (selectedVendors.length > 0 && !selectedVendors.includes(t.vendor)) return false;

      // Budget filter
      if (selectedBudgets.length > 0 && !selectedBudgets.includes(t.budget_name)) return false;

      // Amount filter
      const amount = parseFloat(t.amount);
      if (minAmount !== '' && amount < parseFloat(minAmount)) return false;
      if (maxAmount !== '' && amount > parseFloat(maxAmount)) return false;

      return true;
    });
  };

  // Get month range based on filters
  const getFilteredMonthRange = () => {
    const months = [];
    const currentYear = new Date().getFullYear();

    const start = startMonth || `${currentYear}-01`;
    const end = endMonth || `${currentYear}-12`;

    const [startYear, startMonthNum] = start.split('-').map(Number);
    const [endYear, endMonthNum] = end.split('-').map(Number);

    for (let year = startYear; year <= endYear; year++) {
      const firstMonth = year === startYear ? startMonthNum : 1;
      const lastMonth = year === endYear ? endMonthNum : 12;

      for (let month = firstMonth; month <= lastMonth; month++) {
        const monthKey = `${year}-${String(month).padStart(2, '0')}`;
        months.push(monthKey);
      }
    }

    return months;
  };

  // Get weekly range (last month, current month, next month)
  const getWeeklyRange = () => {
    const weeks = [];
    const now = new Date();

    // Start from first day of last month
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // End at last day of next month
    const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);

    // Find the Monday of the week containing startDate
    let currentWeekStart = new Date(startDate);
    const dayOfWeek = currentWeekStart.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentWeekStart.setDate(currentWeekStart.getDate() + daysToMonday);

    while (currentWeekStart <= endDate) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekKey = `${currentWeekStart.getFullYear()}-W${String(Math.ceil((currentWeekStart.getDate() + currentWeekStart.getDay()) / 7)).padStart(2, '0')}-${String(currentWeekStart.getMonth() + 1).padStart(2, '0')}`;
      weeks.push({
        key: weekKey,
        start: new Date(currentWeekStart),
        end: new Date(weekEnd),
        label: `${currentWeekStart.getMonth() + 1}/${currentWeekStart.getDate()}`
      });

      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    return weeks;
  };

  // Check if transaction occurs in a given week - returns fraction for proper distribution
  const getOccurrencesInWeek = (transaction, weekStart, weekEnd) => {
    const startDate = new Date(transaction.start_date);
    const endDate = transaction.end_date ? new Date(transaction.end_date) : null;

    // If transaction hasn't started yet or has ended before this week
    if (startDate > weekEnd || (endDate && endDate < weekStart)) {
      return 0;
    }

    if (transaction.frequency === 'one-time') {
      // Check if the transaction date falls within this week
      return (startDate >= weekStart && startDate <= weekEnd) ? 1 : 0;
    }

    // For recurring transactions, distribute amounts appropriately
    switch (transaction.frequency) {
      case 'daily':
        // Count actual days in the week where transaction is active
        let dailyCount = 0;
        for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
          if (d >= startDate && (!endDate || d <= endDate)) {
            dailyCount++;
          }
        }
        return dailyCount;

      case 'weekly':
        // Check if transaction day falls in this week (1 occurrence per week)
        const transactionDay = startDate.getDay();
        for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
          if (d >= startDate && (!endDate || d <= endDate) && d.getDay() === transactionDay) {
            return 1; // Full weekly amount in the week it occurs
          }
        }
        return 0;

      case 'biweekly':
        // Check if any biweekly occurrence falls in this week
        let checkDate = new Date(startDate);
        while (checkDate <= weekEnd) {
          if (checkDate >= weekStart && checkDate <= weekEnd && (!endDate || checkDate <= endDate)) {
            return 1; // Full biweekly amount in the week it occurs
          }
          checkDate.setDate(checkDate.getDate() + 14);
        }
        return 0;

      case 'monthly':
        // Distribute monthly amount evenly across ~4.33 weeks per month
        // Return 1/4.33 for each week the transaction is active
        return 1 / 4.33;

      case 'quarterly':
        // Distribute quarterly amount across 13 weeks per quarter
        return 1 / 13;

      case 'annual':
        // Distribute annual amount across 52 weeks per year
        return 1 / 52;

      default:
        return 0;
    }
  };

  // Process data for stacked bar charts - group by vendor/description
  const getStackedChartData = () => {
    const filteredTransactions = getFilteredTransactions();
    const vendors = new Set();

    if (viewMode === 'weekly') {
      const weeks = getWeeklyRange();
      const weeklyData = {};

      // Initialize data structure
      weeks.forEach(week => {
        weeklyData[week.key] = {
          revenue: {},
          expense: {},
          revenueTotal: 0,
          expenseTotal: 0,
          label: week.label
        };
      });

      // Group transactions by vendor and week
      filteredTransactions.forEach(t => {
        const vendor = t.vendor || t.description || 'Other';
        vendors.add(vendor);

        weeks.forEach(week => {
          const occurrences = getOccurrencesInWeek(t, week.start, week.end);
          const amount = parseFloat(t.amount) * occurrences;

          if (amount > 0) {
            if (t.type === 'revenue') {
              weeklyData[week.key].revenue[vendor] = (weeklyData[week.key].revenue[vendor] || 0) + amount;
              weeklyData[week.key].revenueTotal += amount;
            } else {
              weeklyData[week.key].expense[vendor] = (weeklyData[week.key].expense[vendor] || 0) + amount;
              weeklyData[week.key].expenseTotal += amount;
            }
          }
        });
      });

      const chartData = weeks.map(week => ({
        month: week.key,
        label: week.label,
        revenue: weeklyData[week.key].revenue,
        expense: weeklyData[week.key].expense,
        revenueTotal: weeklyData[week.key].revenueTotal,
        expenseTotal: weeklyData[week.key].expenseTotal,
        net: weeklyData[week.key].revenueTotal - weeklyData[week.key].expenseTotal,
      }));

      return { chartData, vendors: Array.from(vendors) };
    } else {
      // Monthly view
      const months = getFilteredMonthRange();
      const monthlyData = {};

      // Initialize data structure
      months.forEach(month => {
        monthlyData[month] = {
          revenue: {},
          expense: {},
          revenueTotal: 0,
          expenseTotal: 0
        };
      });

      // Group transactions by vendor and month
      filteredTransactions.forEach(t => {
        const vendor = t.vendor || t.description || 'Other';
        vendors.add(vendor);

        months.forEach(month => {
          const occurrences = getOccurrencesInMonth(t, month);
          const amount = parseFloat(t.amount) * occurrences;

          if (amount > 0) {
            if (t.type === 'revenue') {
              monthlyData[month].revenue[vendor] = (monthlyData[month].revenue[vendor] || 0) + amount;
              monthlyData[month].revenueTotal += amount;
            } else {
              monthlyData[month].expense[vendor] = (monthlyData[month].expense[vendor] || 0) + amount;
              monthlyData[month].expenseTotal += amount;
            }
          }
        });
      });

      const chartData = months.map(month => ({
        month,
        revenue: monthlyData[month].revenue,
        expense: monthlyData[month].expense,
        revenueTotal: monthlyData[month].revenueTotal,
        expenseTotal: monthlyData[month].expenseTotal,
        net: monthlyData[month].revenueTotal - monthlyData[month].expenseTotal,
      }));

      // Debug logging for expense totals
      console.log('Monthly Chart Data:', chartData.map(d => ({
        month: d.month,
        expenseTotal: d.expenseTotal,
        expenseVendors: Object.keys(d.expense).length,
        expenseBreakdown: d.expense
      })));

      log.debug('Stacked chart data generated', {
        transactionCount: filteredTransactions.length,
        monthCount: months.length,
        vendorCount: vendors.size,
        selectedCategory,
      }, 'Dashboard');

      return { chartData, vendors: Array.from(vendors) };
    }
  };

  useEffect(() => {
    if (transactions.length > 0) {
      drawCharts();
      drawBreakdownCharts();
    }
  }, [transactions, selectedCategory, selectedSubcategories, selectedVendors, selectedBudgets, startMonth, endMonth, minAmount, maxAmount, viewMode]);

  const drawCharts = () => {
    const { chartData, vendors } = getStackedChartData();
    const currentMonth = new Date();
    const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    const margin = { top: 50, right: 40, bottom: 70, left: 80 };
    const barWidth = viewMode === 'weekly' ? 40 : 60; // Narrower bars for weekly view
    const width = barWidth * chartData.length + 100; // Dynamic width based on data points
    const height = 400 - margin.top - margin.bottom;

    // Color scales for stacked bars - more distinct colors
    const revenueColorScale = d3.scaleOrdinal()
      .domain(vendors)
      .range([
        '#1976D2', // Blue
        '#0288D1', // Light Blue
        '#00ACC1', // Cyan
        '#00897B', // Teal
        '#43A047', // Green
        '#7CB342', // Light Green
        '#C0CA33', // Lime
        '#FDD835', // Yellow
        '#FFB300', // Amber
        '#FB8C00', // Orange
        '#F4511E', // Deep Orange
        '#6D4C41', // Brown
        '#546E7A', // Blue Grey
        '#5E35B1', // Deep Purple
        '#8E24AA', // Purple
      ]);

    const expenseColorScale = d3.scaleOrdinal()
      .domain(vendors)
      .range([
        '#D32F2F', // Red
        '#C2185B', // Pink
        '#7B1FA2', // Purple
        '#512DA8', // Deep Purple
        '#303F9F', // Indigo
        '#1976D2', // Blue
        '#0288D1', // Light Blue
        '#0097A7', // Cyan
        '#00796B', // Teal
        '#388E3C', // Green
        '#689F38', // Light Green
        '#AFB42B', // Lime
        '#F57C00', // Orange
        '#E64A19', // Deep Orange
        '#5D4037', // Brown
      ]);

    // Draw Revenue Stacked Chart
    const revenueTitle = viewMode === 'weekly' ? 'Revenue by Week' : 'Revenue by Month';
    drawStackedBarChart(revenueChartRef, chartData, vendors, 'revenue', revenueTitle, revenueColorScale, margin, width, height, currentMonthKey, barWidth);

    // Draw Expense Stacked Chart
    const expenseTitle = viewMode === 'weekly' ? 'Expenses by Week' : 'Expenses by Month';
    drawStackedBarChart(expenseChartRef, chartData, vendors, 'expense', expenseTitle, expenseColorScale, margin, width, height, currentMonthKey, barWidth);
  };

  // Draw stacked bar chart showing individual transactions
  const drawStackedBarChart = (ref, data, vendors, dataKey, title, colorScale, margin, width, height, currentMonthKey, barWidth) => {
    if (!ref.current) return;

    // Remove old chart only
    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', 'transparent')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.2);

    // Calculate max for y scale
    const yMax = d3.max(data, d => {
      const items = d[dataKey];
      return Object.values(items).reduce((sum, val) => sum + val, 0);
    }) || 1000;

    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([height, 0])
      .nice();

    // Format month/week label
    const formatMonth = (monthStr) => {
      // Check if it's a weekly key (contains 'W')
      if (monthStr.includes('-W')) {
        // Find the corresponding data point to get the label
        const dataPoint = data.find(d => d.month === monthStr);
        return dataPoint?.label || monthStr;
      }
      // Monthly format
      const [year, month] = monthStr.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short' });
    };

    // Add horizontal grid lines
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat('')
      )
      .style('stroke', '#E0E0E0')
      .style('stroke-opacity', 0.3)
      .style('stroke-dasharray', '2,2')
      .selectAll('line')
      .style('stroke', '#E0E0E0')
      .style('stroke-opacity', 0.3);

    svg.select('.grid .domain').remove();

    // X Axis
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(formatMonth));

    xAxis.selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('text-anchor', 'middle')
      .style('fill', '#424242')
      .style('font-family', "'Inter', 'Roboto', sans-serif")
      .attr('dy', '1.2em');

    xAxis.selectAll('line')
      .style('stroke', '#BDBDBD')
      .style('stroke-width', '1px');

    xAxis.select('.domain')
      .style('stroke', '#BDBDBD')
      .style('stroke-width', '1.5px');

    // Y Axis
    const yAxis = svg.append('g')
      .call(d3.axisLeft(yScale)
        .ticks(6)
        .tickFormat(d => d3.format('$,.0f')(d))
      );

    yAxis.selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', '400')
      .style('fill', '#616161')
      .style('font-family', "'Inter', 'Roboto', sans-serif")
      .style('font-variant-numeric', 'tabular-nums');

    yAxis.selectAll('line')
      .style('stroke', '#E0E0E0')
      .style('stroke-width', '1px');

    yAxis.select('.domain')
      .style('stroke', '#BDBDBD')
      .style('stroke-width', '1.5px');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', '600')
      .style('fill', '#212121')
      .style('font-family', "'Inter', 'Roboto', sans-serif")
      .text(title);

    // Create or reuse tooltip - append to body for proper positioning
    let tooltip = d3.select('body').select('.chart-tooltip');
    if (tooltip.empty()) {
      tooltip = d3.select('body')
        .append('div')
        .attr('class', 'chart-tooltip')
        .style('position', 'fixed')
        .style('background-color', 'rgba(33, 33, 33, 0.97)')
        .style('color', '#FFFFFF')
        .style('padding', '14px 18px')
        .style('border-radius', '10px')
        .style('font-size', '13px')
        .style('font-weight', '500')
        .style('font-family', "'Inter', 'Roboto', sans-serif")
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .style('transition', 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)')
        .style('z-index', 99999)
        .style('box-shadow', '0 8px 24px rgba(0,0,0,0.25)')
        .style('min-width', '200px')
        .style('backdrop-filter', 'blur(10px)');
    }

    // Draw stacked bars
    data.forEach((monthData, i) => {
      const items = monthData[dataKey];
      const vendors = Object.keys(items).sort((a, b) => items[b] - items[a]); // Sort by value
      const monthTotal = Object.values(items).reduce((sum, val) => sum + val, 0);

      let yOffset = 0;

      vendors.forEach((vendor, j) => {
        const value = items[vendor];
        const barHeight = yScale(0) - yScale(value);
        const isCurrentMonth = monthData.month === currentMonthKey;

        const rect = svg.append('rect')
          .attr('x', xScale(monthData.month))
          .attr('y', height) // Start from bottom for animation
          .attr('width', xScale.bandwidth())
          .attr('height', 0)
          .attr('fill', colorScale(vendor))
          .attr('rx', j === 0 ? 4 : 0) // Round bottom corners of first segment
          .attr('ry', j === 0 ? 4 : 0)
          .style('cursor', 'pointer')
          .style('stroke', isCurrentMonth ? '#FFB74D' : 'none')
          .style('stroke-width', isCurrentMonth ? 2 : 0)
          .style('filter', isCurrentMonth && j === 0 ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none');

        // Animate
        rect.transition()
          .duration(800)
          .delay(i * 50 + j * 30)
          .ease(d3.easeCubicOut)
          .attr('y', yScale(yOffset + value))
          .attr('height', barHeight);

        // Add text label if bar is large enough (height > 30px)
        if (barHeight > 30) {
          const label = svg.append('text')
            .attr('x', xScale(monthData.month) + xScale.bandwidth() / 2)
            .attr('y', height) // Start from bottom for animation
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('font-weight', '600')
            .attr('fill', '#FFFFFF')
            .attr('font-family', "'Inter', 'Roboto', sans-serif")
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .text(`$${(value / 1000).toFixed(1)}k`);

          label.transition()
            .duration(800)
            .delay(i * 50 + j * 30 + 400)
            .ease(d3.easeCubicOut)
            .attr('y', yScale(yOffset + value / 2))
            .style('opacity', 0.9);
        }

        // Hover interactions with enhanced tooltip
        rect.on('mouseenter', function(event) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 0.8);

          const formatMonthFull = (monthStr) => {
            // Check if it's a weekly key (contains 'W')
            if (monthStr.includes('-W')) {
              // Find the data point to get the label
              const dataPoint = data.find(d => d.month === monthStr);
              return dataPoint?.label || monthStr;
            }
            // Monthly format
            const [year, month] = monthStr.split('-');
            const date = new Date(year, parseInt(month) - 1);
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          };

          // Calculate total for this month
          const monthTotal = Object.values(items).reduce((sum, val) => sum + val, 0);
          const percentage = ((value / monthTotal) * 100).toFixed(1);

          tooltip
            .style('opacity', 1)
            .html(`
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid rgba(255,255,255,0.2);">
                <div style="width: 16px; height: 16px; background-color: ${colorScale(vendor)}; border-radius: 3px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
                <div style="font-weight: 700; font-size: 16px; color: #FFFFFF;">${vendor}</div>
              </div>
              <div style="font-weight: 600; margin-bottom: 8px; font-size: 13px; color: #B0BEC5;">
                ${formatMonthFull(monthData.month)}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 20px; margin-top: 10px;">
                <div style="font-size: 20px; font-weight: 700; color: #FFFFFF;">$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                <div style="font-size: 14px; color: ${colorScale(vendor)}; font-weight: 700; background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 4px;">${percentage}%</div>
              </div>
              <div style="font-size: 11px; color: #90A4AE; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
                Month Total: $${monthTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
              ${isCurrentMonth ? '<div style="font-size: 11px; margin-top: 6px; color: #FFB74D; font-weight: 600;">● Current Month</div>' : ''}
            `)
            .style('left', (event.clientX + 15) + 'px')
            .style('top', (event.clientY - 90) + 'px');
        })
        .on('mousemove', function(event) {
          tooltip
            .style('left', (event.clientX + 15) + 'px')
            .style('top', (event.clientY - 90) + 'px');
        })
        .on('mouseleave', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 1);

          tooltip.style('opacity', 0);
        });

        yOffset += value;
      });

      // Add month total label at the top of the stacked bar
      if (monthTotal > 0) {
        const totalLabel = svg.append('text')
          .attr('x', xScale(monthData.month) + xScale.bandwidth() / 2)
          .attr('y', height) // Start from bottom for animation
          .attr('text-anchor', 'middle')
          .attr('font-size', '13px')
          .attr('font-weight', '700')
          .attr('fill', '#212121')
          .attr('font-family', "'Inter', 'Roboto', sans-serif")
          .style('pointer-events', 'none')
          .style('opacity', 0)
          .text(`$${(monthTotal / 1000).toFixed(1)}k`);

        totalLabel.transition()
          .duration(800)
          .delay(i * 50 + 500)
          .ease(d3.easeCubicOut)
          .attr('y', yScale(monthTotal) - 8)
          .style('opacity', 1);
      }
    });

    // Current month indicator
    const currentMonthIndex = data.findIndex(d => d.month === currentMonthKey);
    if (currentMonthIndex >= 0) {
      const xPos = xScale(currentMonthKey) + xScale.bandwidth() / 2;

      svg.append('line')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y1', -10)
        .attr('y2', height + 10)
        .attr('stroke', '#FFB74D')
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.4)
        .attr('stroke-width', 2);

      svg.append('text')
        .attr('x', xPos)
        .attr('y', -25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#FFB74D')
        .attr('font-weight', '600')
        .attr('font-family', "'Inter', 'Roboto', sans-serif")
        .text('● Current');
    }

    // Add legend
    const legendData = [];
    data.forEach(monthData => {
      const items = monthData[dataKey];
      Object.keys(items).forEach(vendor => {
        if (!legendData.find(d => d.vendor === vendor)) {
          legendData.push({ vendor, value: items[vendor] });
        }
      });
    });

    // Sort legend by total value across all months
    const vendorTotals = {};
    data.forEach(monthData => {
      const items = monthData[dataKey];
      Object.keys(items).forEach(vendor => {
        vendorTotals[vendor] = (vendorTotals[vendor] || 0) + items[vendor];
      });
    });
    legendData.sort((a, b) => vendorTotals[b.vendor] - vendorTotals[a.vendor]);

    // Only show top 8 vendors in legend to avoid clutter
    const topLegendData = legendData.slice(0, 8);

    const legendItemWidth = 140;
    const legendItemHeight = 24;
    const legendColumns = Math.ceil(topLegendData.length / 2);
    const legendStartX = 0;
    const legendStartY = height + 50;

    topLegendData.forEach((d, i) => {
      const row = Math.floor(i / legendColumns);
      const col = i % legendColumns;
      const x = legendStartX + col * legendItemWidth;
      const y = legendStartY + row * legendItemHeight;

      const legendGroup = svg.append('g')
        .attr('transform', `translate(${x}, ${y})`)
        .style('cursor', 'pointer')
        .on('mouseenter', function() {
          // Highlight all bars of this vendor
          svg.selectAll('rect')
            .filter(function() {
              return d3.select(this).attr('fill') === colorScale(d.vendor);
            })
            .transition()
            .duration(200)
            .attr('opacity', 0.8)
            .style('stroke', '#212121')
            .style('stroke-width', 2);
        })
        .on('mouseleave', function() {
          svg.selectAll('rect')
            .transition()
            .duration(200)
            .attr('opacity', 1)
            .style('stroke', function() {
              return d3.select(this).style('stroke') === 'rgb(255, 183, 77)' ? '#FFB74D' : 'none';
            })
            .style('stroke-width', function() {
              return d3.select(this).style('stroke') === 'rgb(255, 183, 77)' ? 2 : 0;
            });
        });

      legendGroup.append('rect')
        .attr('width', 14)
        .attr('height', 14)
        .attr('rx', 2)
        .attr('fill', colorScale(d.vendor));

      legendGroup.append('text')
        .attr('x', 20)
        .attr('y', 11)
        .style('font-size', '12px')
        .style('font-weight', '500')
        .style('fill', '#424242')
        .style('font-family', "'Inter', 'Roboto', sans-serif")
        .text(d.vendor.length > 15 ? d.vendor.substring(0, 15) + '...' : d.vendor);
    });

    if (legendData.length > 8) {
      svg.append('text')
        .attr('x', legendStartX + legendColumns * legendItemWidth)
        .attr('y', legendStartY + 11)
        .style('font-size', '11px')
        .style('font-weight', '500')
        .style('fill', '#757575')
        .style('font-family', "'Inter', 'Roboto', sans-serif")
        .text(`+${legendData.length - 8} more`);
    }
  };

  const drawBarChart = (ref, data, dataKey, title, color, margin, width, height, currentMonthKey, highlightColor, barWidth) => {
    if (!ref.current) return;

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', 'transparent')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.2);

    const yMax = d3.max(data, d => Math.abs(d[dataKey])) || 1000;
    const yScale = d3.scaleLinear()
      .domain([dataKey === 'net' ? -yMax * 1.1 : 0, yMax * 1.1])
      .range([height, 0])
      .nice();

    // Format month label (YYYY-MM to MMM)
    const formatMonth = (monthStr) => {
      const [year, month] = monthStr.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short' });
    };

    // Add horizontal grid lines (NY Times style)
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat('')
      )
      .style('stroke', '#E0E0E0')
      .style('stroke-opacity', 0.3)
      .style('stroke-dasharray', '2,2')
      .selectAll('line')
      .style('stroke', '#E0E0E0')
      .style('stroke-opacity', 0.3);

    // Remove grid domain line
    svg.select('.grid .domain').remove();

    // X Axis
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(formatMonth));

    xAxis.selectAll('text')
      .style('font-size', '13px')
      .style('font-weight', '500')
      .style('text-anchor', 'middle')
      .style('fill', '#424242')
      .style('font-family', "'Inter', 'Roboto', sans-serif")
      .attr('dy', '1.2em');

    xAxis.selectAll('line')
      .style('stroke', '#BDBDBD')
      .style('stroke-width', '1px');

    xAxis.select('.domain')
      .style('stroke', '#BDBDBD')
      .style('stroke-width', '1.5px');

    // Y Axis
    const yAxis = svg.append('g')
      .call(d3.axisLeft(yScale)
        .ticks(6)
        .tickFormat(d => d3.format('$,.0f')(d))
      );

    yAxis.selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', '400')
      .style('fill', '#616161')
      .style('font-family', "'Inter', 'Roboto', sans-serif")
      .style('font-variant-numeric', 'tabular-nums');

    yAxis.selectAll('line')
      .style('stroke', '#E0E0E0')
      .style('stroke-width', '1px');

    yAxis.select('.domain')
      .style('stroke', '#BDBDBD')
      .style('stroke-width', '1.5px');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', '600')
      .style('fill', '#212121')
      .style('font-family', "'Inter', 'Roboto', sans-serif")
      .text(title);

    // Create tooltip with Material Design styling
    const tooltip = d3.select(ref.current.parentElement)
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'rgba(33, 33, 33, 0.95)')
      .style('color', '#FFFFFF')
      .style('padding', '12px 16px')
      .style('border-radius', '8px')
      .style('font-size', '13px')
      .style('font-weight', '500')
      .style('font-family', "'Inter', 'Roboto', sans-serif")
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('transition', 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)')
      .style('z-index', 1000)
      .style('white-space', 'nowrap')
      .style('box-shadow', '0 4px 12px rgba(0,0,0,0.15)');

    // Bars with smooth animations and current month highlighting
    const bars = svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.month))
      .attr('y', height) // Start from bottom for animation
      .attr('width', xScale.bandwidth())
      .attr('height', 0) // Start with 0 height for animation
      .attr('fill', d => d.month === currentMonthKey ? highlightColor : color)
      .attr('rx', 4)
      .attr('ry', 4)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      .style('filter', d => d.month === currentMonthKey ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none');

    // Animate bars growing from bottom
    bars.transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .ease(d3.easeCubicOut)
      .attr('y', d => {
        const value = d[dataKey];
        if (value >= 0) {
          return yScale(value);
        } else {
          return yScale(0);
        }
      })
      .attr('height', d => {
        const value = d[dataKey];
        if (value >= 0) {
          return yScale(0) - yScale(value);
        } else {
          return yScale(value) - yScale(0);
        }
      });

    // Add hover interactions with smooth transitions
    bars.on('mouseenter', function(event, d) {
      const isCurrentMonth = d.month === currentMonthKey;

      d3.select(this)
        .transition()
        .duration(200)
        .ease(d3.easeCubicOut)
        .attr('opacity', 1)
        .style('filter', 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))');

      const value = d[dataKey];
      const formatMonthFull = (monthStr) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      };

      tooltip
        .style('opacity', 1)
        .html(`
          <div style="font-weight: 600; margin-bottom: 4px;">${formatMonthFull(d.month)}</div>
          <div style="font-size: 16px; font-weight: 700;">$${Math.abs(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          ${isCurrentMonth ? '<div style="font-size: 11px; margin-top: 4px; color: #FFB74D;">● Current Month</div>' : ''}
        `)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 60) + 'px');
    })
    .on('mouseleave', function(event, d) {
      const isCurrentMonth = d.month === currentMonthKey;

      d3.select(this)
        .transition()
        .duration(200)
        .ease(d3.easeCubicOut)
        .attr('opacity', 0.9)
        .style('filter', isCurrentMonth ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none');

      tooltip.style('opacity', 0);
    });

    // Add current month indicator line
    const currentMonthIndex = data.findIndex(d => d.month === currentMonthKey);
    if (currentMonthIndex >= 0) {
      const xPos = xScale(currentMonthKey) + xScale.bandwidth() / 2;

      // Subtle vertical line at current month
      svg.append('line')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y1', -10)
        .attr('y2', height + 10)
        .attr('stroke', highlightColor)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.4)
        .attr('stroke-width', 2);

      // Current month label
      svg.append('text')
        .attr('x', xPos)
        .attr('y', -25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', highlightColor)
        .attr('font-weight', '600')
        .attr('font-family', "'Inter', 'Roboto', sans-serif")
        .text('● Current');
    }

    // Zero line for net income - NY Times style
    if (dataKey === 'net') {
      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', nytimesColors.chart.gridLine)
        .attr('stroke-dasharray', '3,2')
        .attr('opacity', 0.25)
        .attr('stroke-width', 1);
    }
  };

  const calculateTotals = () => {
    let totalRevenue = 0;
    let totalExpense = 0;

    // Get current month key
    const currentMonth = new Date();
    const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    const filteredTransactions = getFilteredTransactions();

    filteredTransactions.forEach(t => {
      // Calculate occurrences for current month only
      const occurrences = getOccurrencesInMonth(t, currentMonthKey);
      const amount = parseFloat(t.amount) * occurrences;

      if (t.type === 'revenue') {
        totalRevenue += amount;
      } else {
        totalExpense += amount;
      }
    });

    return {
      revenue: totalRevenue,
      expense: totalExpense,
      net: totalRevenue - totalExpense,
    };
  };

  // Draw breakdown charts by budget, category, and subcategory
  const drawBreakdownCharts = () => {
    const filteredTransactions = getFilteredTransactions();

    // Aggregate data by budget, category, and subcategory
    const budgetData = {};
    const categoryData = {};
    const subcategoryData = {};

    let periods = [];
    let barWidth = 60;
    let titleSuffix = '';

    if (viewMode === 'weekly') {
      periods = getWeeklyRange();
      barWidth = 40;
      titleSuffix = ' - Weekly';

      // Initialize data structure for weeks
      periods.forEach(week => {
        budgetData[week.key] = {};
        categoryData[week.key] = {};
        subcategoryData[week.key] = {};
      });

      filteredTransactions.forEach(t => {
        if (t.type !== 'expense') return; // Only show expenses for breakdown

        periods.forEach(week => {
          const occurrences = getOccurrencesInWeek(t, week.start, week.end);
          const amount = parseFloat(t.amount) * occurrences;

          if (amount > 0) {
            // By budget
            const budget = t.budget_name || 'Unassigned';
            budgetData[week.key][budget] = (budgetData[week.key][budget] || 0) + amount;

            // By category
            const category = t.category || 'Other';
            categoryData[week.key][category] = (categoryData[week.key][category] || 0) + amount;

            // By subcategory
            const subcategory = t.subcategory || 'Other';
            subcategoryData[week.key][subcategory] = (subcategoryData[week.key][subcategory] || 0) + amount;
          }
        });
      });
    } else {
      // Monthly view
      periods = getFilteredMonthRange();
      titleSuffix = ' - Monthly';

      // Initialize data structure for months
      periods.forEach(month => {
        budgetData[month] = {};
        categoryData[month] = {};
        subcategoryData[month] = {};
      });

      filteredTransactions.forEach(t => {
        if (t.type !== 'expense') return; // Only show expenses for breakdown

        periods.forEach(month => {
          const occurrences = getOccurrencesInMonth(t, month);
          const amount = parseFloat(t.amount) * occurrences;

          if (amount > 0) {
            // By budget
            const budget = t.budget_name || 'Unassigned';
            budgetData[month][budget] = (budgetData[month][budget] || 0) + amount;

            // By category
            const category = t.category || 'Other';
            categoryData[month][category] = (categoryData[month][category] || 0) + amount;

            // By subcategory
            const subcategory = t.subcategory || 'Other';
            subcategoryData[month][subcategory] = (subcategoryData[month][subcategory] || 0) + amount;
          }
        });
      });
    }

    // Convert to chart format
    const periodKeys = viewMode === 'weekly' ? periods.map(w => w.key) : periods;

    const budgetChartData = periodKeys.map(key => ({
      month: key,
      data: budgetData[key],
      total: Object.values(budgetData[key]).reduce((sum, val) => sum + val, 0)
    }));

    const categoryChartData = periodKeys.map(key => ({
      month: key,
      data: categoryData[key],
      total: Object.values(categoryData[key]).reduce((sum, val) => sum + val, 0)
    }));

    const subcategoryChartData = periodKeys.map(key => ({
      month: key,
      data: subcategoryData[key],
      total: Object.values(subcategoryData[key]).reduce((sum, val) => sum + val, 0)
    }));

    const margin = { top: 50, right: 40, bottom: 100, left: 80 }; // Increased bottom margin for rotated labels
    const width = barWidth * periodKeys.length + 200; // Increased width for better spacing
    const height = 400 - margin.top - margin.bottom;
    const currentMonth = new Date();
    const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

    // Color scales
    const budgetColors = d3.scaleOrdinal()
      .range(['#1976D2', '#388E3C', '#F57C00', '#7B1FA2', '#C2185B', '#00897B', '#FBC02D', '#5D4037']);

    const categoryColors = d3.scaleOrdinal()
      .range(['#D32F2F', '#1976D2', '#388E3C', '#F57C00', '#7B1FA2']);

    const subcategoryColors = d3.scaleOrdinal()
      .range(['#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#4CAF50', '#FF9800', '#795548']);

    // Draw charts
    drawGroupedStackedChart(budgetChartRef, budgetChartData, `Expenses by Budget${titleSuffix}`, budgetColors, margin, width, height, currentMonthKey, barWidth);
    drawGroupedStackedChart(categoryChartRef, categoryChartData, `Expenses by Category${titleSuffix}`, categoryColors, margin, width, height, currentMonthKey, barWidth);
    drawGroupedStackedChart(subcategoryChartRef, subcategoryChartData, `Expenses by Subcategory${titleSuffix}`, subcategoryColors, margin, width, height, currentMonthKey, barWidth);
  };

  // Generic function to draw grouped stacked bar charts
  const drawGroupedStackedChart = (ref, data, title, colorScale, margin, width, height, currentMonthKey, barWidth) => {
    if (!ref.current) return;

    // Remove old chart only
    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', 'transparent')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Get all unique keys
    const allKeys = new Set();
    data.forEach(d => Object.keys(d.data).forEach(key => allKeys.add(key)));
    const keys = Array.from(allKeys);
    colorScale.domain(keys);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.2);

    const yMax = d3.max(data, d => d.total) || 1000;
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([height, 0])
      .nice();

    // Format month/week label
    const formatMonth = (monthStr) => {
      // Check if it's a weekly key (contains 'W')
      if (monthStr.includes('-W')) {
        // Find the corresponding data point to get the label
        const dataPoint = data.find(d => d.month === monthStr);
        return dataPoint?.label || monthStr;
      }
      // Monthly format
      const [year, month] = monthStr.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short' });
    };

    // Add grid
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''))
      .style('stroke', '#E0E0E0')
      .style('stroke-opacity', 0.3)
      .style('stroke-dasharray', '2,2');

    svg.select('.grid .domain').remove();

    // X Axis
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(formatMonth));

    xAxis.selectAll('text')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('fill', '#424242')
      .style('text-anchor', 'middle');

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(6).tickFormat(d => `$${d.toFixed(0)}`))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#424242');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#212121')
      .text(title);

    // Stack data
    const stack = d3.stack()
      .keys(keys)
      .value((d, key) => d.data[key] || 0);

    const series = stack(data);

    // Create or reuse tooltip
    let tooltip = d3.select('body').select('.chart-tooltip');
    if (tooltip.empty()) {
      tooltip = d3.select('body')
        .append('div')
        .attr('class', 'chart-tooltip')
        .style('position', 'fixed')
        .style('background-color', 'rgba(33, 33, 33, 0.97)')
        .style('color', '#FFFFFF')
        .style('padding', '14px 18px')
        .style('border-radius', '10px')
        .style('font-size', '13px')
        .style('font-weight', '500')
        .style('font-family', "'Inter', 'Roboto', sans-serif")
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .style('transition', 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)')
        .style('z-index', 99999)
        .style('box-shadow', '0 8px 24px rgba(0,0,0,0.25)')
        .style('min-width', '200px')
        .style('backdrop-filter', 'blur(10px)');
    }

    // Draw bars
    svg.selectAll('.series')
      .data(series)
      .enter().append('g')
      .attr('class', 'series')
      .attr('fill', d => colorScale(d.key))
      .selectAll('rect')
      .data(d => d.map(item => ({ ...item, key: d.key })))
      .enter().append('rect')
      .attr('x', d => xScale(d.data.month))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .attr('opacity', 0.85)
      .style('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        d3.select(this).attr('opacity', 1);

        const value = d[1] - d[0];
        const monthTotal = d.data.total;
        const percentage = ((value / monthTotal) * 100).toFixed(1);

        const formatMonthFull = (monthStr) => {
          // Check if it's a weekly key (contains 'W')
          if (monthStr.includes('-W')) {
            // Find the data point to get the label
            const dataPoint = data.find(dp => dp.month === monthStr);
            return dataPoint?.label || monthStr;
          }
          // Monthly format
          const [year, month] = monthStr.split('-');
          const date = new Date(year, parseInt(month) - 1);
          return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        };

        tooltip
          .style('opacity', 1)
          .html(`
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid rgba(255,255,255,0.2);">
              <div style="width: 16px; height: 16px; background-color: ${colorScale(d.key)}; border-radius: 3px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
              <div style="font-weight: 700; font-size: 16px; color: #FFFFFF;">${d.key}</div>
            </div>
            <div style="font-weight: 600; margin-bottom: 8px; font-size: 13px; color: #B0BEC5;">
              ${formatMonthFull(d.data.month)}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 20px; margin-top: 10px;">
              <div style="font-size: 20px; font-weight: 700; color: #FFFFFF;">$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
              <div style="font-size: 14px; color: ${colorScale(d.key)}; font-weight: 700; background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 4px;">${percentage}%</div>
            </div>
            <div style="font-size: 11px; color: #90A4AE; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
              Month Total: $${monthTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          `)
          .style('left', (event.clientX + 15) + 'px')
          .style('top', (event.clientY - 90) + 'px');
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.clientX + 15) + 'px')
          .style('top', (event.clientY - 90) + 'px');
      })
      .on('mouseleave', function() {
        d3.select(this).attr('opacity', 0.85);
        tooltip.style('opacity', 0);
      });

    // Add month totals on top
    svg.selectAll('.month-total')
      .data(data)
      .enter().append('text')
      .attr('class', 'month-total')
      .attr('x', d => xScale(d.month) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.total) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-weight', '600')
      .style('fill', '#424242')
      .text(d => d.total > 0 ? `$${d.total.toFixed(0)}` : '');

    // Legend
    const legendItemWidth = 120;
    const legendX = width / 2 - (keys.length * legendItemWidth) / 2;

    const legend = svg.append('g')
      .attr('transform', `translate(${legendX}, ${height + 45})`);

    keys.forEach((key, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(${i * legendItemWidth}, 0)`);

      legendItem.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', colorScale(key))
        .attr('opacity', 0.85);

      legendItem.append('text')
        .attr('x', 18)
        .attr('y', 10)
        .style('font-size', '10px')
        .style('fill', '#424242')
        .text(key.length > 12 ? key.substring(0, 12) + '...' : key);
    });
  };

  const totals = calculateTotals();

  if (loading) {
    return <CircularProgress />;
  }

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategories([]);
    setSelectedVendors([]);
    setSelectedBudgets([]);
    setMinAmount('');
    setMaxAmount('');
    const currentYear = new Date().getFullYear();
    setStartMonth(`${currentYear}-01`);
    setEndMonth(`${currentYear}-12`);
  };

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)' }}>
        <Stack spacing={3}>
          {/* Filter Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filters
              </Typography>
              {(selectedSubcategories.length > 0 || selectedVendors.length > 0 || selectedBudgets.length > 0 || minAmount || maxAmount) && (
                <Chip
                  label="Active"
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
                sx={{ mr: 2 }}
              >
                <ToggleButton value="monthly">
                  Monthly
                </ToggleButton>
                <ToggleButton value="weekly">
                  Weekly
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                size="small"
                onClick={handleClearFilters}
                variant="outlined"
              >
                Clear All
              </Button>
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Basic Filters - Always Visible */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2.5}>
              <FormControl fullWidth size="medium">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="investment">Investment</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                fullWidth
                size="medium"
                type="month"
                label="Start Month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                fullWidth
                size="medium"
                type="month"
                label="End Month"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 1 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Showing {getFilteredTransactions().length} of {transactions.length} transactions
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Advanced Filters - Collapsible */}
          <Collapse in={showFilters}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={3}>
                <Autocomplete
                  multiple
                  size="medium"
                  options={uniqueVendors}
                  value={selectedVendors}
                  onChange={(event, newValue) => setSelectedVendors(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vendors"
                      placeholder="Select vendors..."
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        size="small"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Autocomplete
                  multiple
                  size="medium"
                  options={uniqueSubcategories}
                  value={selectedSubcategories}
                  onChange={(event, newValue) => setSelectedSubcategories(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Subcategories"
                      placeholder="Select subcategories..."
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        size="small"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Autocomplete
                  multiple
                  size="medium"
                  options={uniqueBudgets}
                  value={selectedBudgets}
                  onChange={(event, newValue) => setSelectedBudgets(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Budgets"
                      placeholder="Select budgets..."
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        size="small"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="medium"
                  type="number"
                  label="Min Amount"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                  placeholder="0.00"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="medium"
                  type="number"
                  label="Max Amount"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  InputProps={{ startAdornment: '$' }}
                  placeholder="10000.00"
                />
              </Grid>
            </Grid>
          </Collapse>
        </Stack>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Revenue"
            value={`$${totals.revenue.toFixed(2)}`}
            subtitle="This month"
            color="success"
            variant="tonal"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Expenses"
            value={`$${totals.expense.toFixed(2)}`}
            subtitle="This month"
            color="error"
            variant="tonal"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Net Income"
            value={`$${totals.net.toFixed(2)}`}
            subtitle="This month"
            color={totals.net >= 0 ? 'info' : 'warning'}
            variant="tonal"
            trend={totals.net >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(totals.net).toFixed(0)}%`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Transactions"
            value={transactions.length}
            subtitle="Total tracked"
            color="primary"
            variant="tonal"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.06)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Box
              sx={{
                overflowX: 'auto',
                overflowY: 'hidden',
                minHeight: 450,
                position: 'relative',
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#F5F5F5',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#BDBDBD',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#9E9E9E',
                  }
                }
              }}
            >
              <svg ref={revenueChartRef} style={{ display: 'block' }}></svg>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.06)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Box
              sx={{
                overflowX: 'auto',
                overflowY: 'hidden',
                minHeight: 450,
                position: 'relative',
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#F5F5F5',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#BDBDBD',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#9E9E9E',
                  }
                }
              }}
            >
              <svg ref={expenseChartRef} style={{ display: 'block' }}></svg>
            </Box>
          </Paper>
        </Grid>

        {/* Breakdown Charts */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.06)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Box
              sx={{
                overflowX: 'auto',
                overflowY: 'hidden',
                minHeight: 450,
                position: 'relative',
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#F5F5F5',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#BDBDBD',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#9E9E9E',
                  }
                }
              }}
            >
              <svg ref={budgetChartRef} style={{ display: 'block' }}></svg>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.06)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Box
              sx={{
                overflowX: 'auto',
                overflowY: 'hidden',
                minHeight: 450,
                position: 'relative',
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#F5F5F5',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#BDBDBD',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#9E9E9E',
                  }
                }
              }}
            >
              <svg ref={categoryChartRef} style={{ display: 'block' }}></svg>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
              borderRadius: 2,
              border: '1px solid rgba(0,0,0,0.06)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Box
              sx={{
                overflowX: 'auto',
                overflowY: 'hidden',
                minHeight: 450,
                position: 'relative',
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#F5F5F5',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#BDBDBD',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#9E9E9E',
                  }
                }
              }}
            >
              <svg ref={subcategoryChartRef} style={{ display: 'block' }}></svg>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

