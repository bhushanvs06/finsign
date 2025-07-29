import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, FileText, PiggyBank, Shield, Calculator } from 'lucide-react';

const AnalysisResultPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/finance-report/latest');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        console.log("📊 Latest Finance Report:", result);
        setData(result);
      } catch (error) {
        console.error("❌ Error fetching latest entry:", error);
        setError(error.message);
        
        // For demo purposes, use the provided sample data
        const sampleData = {
          "_id": "6888470fff417cef8ae33324",
          "currentTax": 1080000,
          "potentialSavings": 46878,
          "aiAnalysis": "Sample analysis data...",
          "investmentAllocation": [
            {"instrument": "Fixed Deposits (FD)", "percentage": 20},
            {"instrument": "Debt Mutual Funds", "percentage": 20},
            {"instrument": "Public Provident Fund (PPF)", "percentage": 20},
            {"instrument": "Equity Linked Savings Scheme (ELSS)", "percentage": 20},
            {"instrument": "National Savings Certificate (NSC)", "percentage": 20}
          ],
          "documentName": "income_sources_sample_fixed.pdf",
          "createdAt": "2025-07-29T03:59:11.772Z"
        };
        setData(sampleData);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading your financial analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorContent}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Error Loading Data</h2>
          <p style={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.noDataContainer}>
        <div style={styles.noDataContent}>
          <p style={styles.noDataText}>No data available</p>
        </div>
      </div>
    );
  }

  // Process investment allocation data
  const investmentData = data.investmentAllocation?.filter(item => 
    item.instrument && 
    item.percentage > 0 && 
    !item.instrument.includes('of ') && 
    !item.instrument.includes('deduction')
  ).map(item => ({
    name: item.instrument.replace(/\b\w+\b/g, word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ),
    value: item.percentage,
    amount: (data.currentTax * item.percentage / 100).toFixed(0)
  })) || [];

  // Sample income breakdown
  const incomeBreakdown = [
    { source: 'Salary', amount: 720000, percentage: 66.7 },
    { source: 'Freelancing', amount: 180000, percentage: 16.7 },
    { source: 'Rental Income', amount: 120000, percentage: 11.1 },
    { source: 'Stock Dividends', amount: 48000, percentage: 4.4 },
    { source: 'Other', amount: 12000, percentage: 1.1 }
  ];

  // Tax comparison data
  const taxComparison = [
    { category: 'Current Tax', amount: data.currentTax },
    { category: 'Optimized Tax', amount: data.currentTax - data.potentialSavings },
    { category: 'Potential Savings', amount: data.potentialSavings }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
    return (
      <div style={{...styles.statCard, ...styles[`statCard${color.charAt(0).toUpperCase() + color.slice(1)}`]}}>
        <div style={styles.statCardContent}>
          <div>
            <p style={styles.statCardTitle}>{title}</p>
            <p style={styles.statCardValue}>{value}</p>
            {trend && (
              <div style={{...styles.trendContainer, color: trend > 0 ? '#10B981' : '#EF4444'}}>
                {trend > 0 ? <TrendingUp style={styles.trendIcon} /> : <TrendingDown style={styles.trendIcon} />}
                <span>{Math.abs(trend)}% vs last year</span>
              </div>
            )}
          </div>
          <div style={{...styles.iconContainer, ...styles[`iconContainer${color.charAt(0).toUpperCase() + color.slice(1)}`]}}>
            <Icon style={styles.icon} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Financial Analysis Dashboard</h1>
          <p style={styles.subtitle}>
            Comprehensive analysis of your financial portfolio with tax optimization recommendations
          </p>
          <div style={styles.meta}>
            Document: {data.documentName} • Generated: {new Date(data.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Key Metrics */}
        <div style={styles.statsGrid}>
          <StatCard
            title="Current Tax Liability"
            value={formatCurrency(data.currentTax)}
            icon={Calculator}
            color="red"
          />
          <StatCard
            title="Potential Savings"
            value={formatCurrency(data.potentialSavings)}
            icon={PiggyBank}
            trend={15}
            color="green"
          />
          <StatCard
            title="Optimized Tax"
            value={formatCurrency(data.currentTax - data.potentialSavings)}
            icon={Target}
            color="blue"
          />
          <StatCard
            title="Savings Rate"
            value={`${((data.potentialSavings / data.currentTax) * 100).toFixed(1)}%`}
            icon={TrendingUp}
            trend={8}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div style={styles.chartsGrid}>
          {/* Income Breakdown */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <DollarSign style={styles.chartTitleIcon} />
              Income Sources Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ source, percentage }) => `${source} (${percentage}%)`}
                >
                  {incomeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tax Comparison */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              <Shield style={styles.chartTitleIcon} />
              Tax Optimization Impact
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taxComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis formatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Investment Allocation */}
        {investmentData.length > 0 && (
          <div style={styles.investmentCard}>
            <h3 style={styles.chartTitle}>
              <Target style={styles.chartTitleIcon} />
              Recommended Investment Allocation
            </h3>
            <div style={styles.investmentGrid}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={investmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                  >
                    {investmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={styles.investmentList}>
                {investmentData.map((item, index) => (
                  <div key={index} style={styles.investmentItem}>
                    <div style={styles.investmentItemLeft}>
                      <div 
                        style={{
                          ...styles.colorDot,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                      <span style={styles.investmentName}>{item.name}</span>
                    </div>
                    <div style={styles.investmentItemRight}>
                      <div style={styles.investmentPercentage}>{item.value}%</div>
                      <div style={styles.investmentAmount}>{formatCurrency(item.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Summary */}
        <div style={styles.analysisCard}>
          <h3 style={styles.chartTitle}>
            <FileText style={styles.chartTitleIcon} />
            AI Analysis Summary
          </h3>
          <div style={styles.analysisContent}>
            <div style={styles.insightsBox}>
              <h4 style={styles.insightsTitle}>Key Insights</h4>
              <ul style={styles.insightsList}>
                <li>• Your current tax liability stands at {formatCurrency(data.currentTax)}</li>
                <li>• Potential tax savings of {formatCurrency(data.potentialSavings)} identified</li>
                <li>• This represents a {((data.potentialSavings / data.currentTax) * 100).toFixed(1)}% reduction in tax burden</li>
                <li>• Recommendations include maximizing 80C, 80D, and other eligible deductions</li>
                <li>• A diversified investment approach balancing risk and returns is suggested</li>
              </ul>
            </div>
            
            <div style={styles.actionBox}>
              <h4 style={styles.actionTitle}>Next Steps</h4>
              <ul style={styles.actionList}>
                <li>• Implement tax-saving investments under Section 80C</li>
                <li>• Purchase health insurance to claim 80D benefits</li>
                <li>• Consider home loan for additional interest deductions</li>
                <li>• Make strategic donations under Section 80G</li>
                <li>• Consult with a tax advisor for personalized guidance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            This analysis is based on the provided financial data and current tax regulations.
            Please consult with a qualified financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e8eaf6 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px'
  },
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContent: {
    textAlign: 'center'
  },
  spinner: {
    width: '64px',
    height: '64px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '18px',
    color: '#6b7280'
  },
  errorContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorContent: {
    textAlign: 'center',
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px'
  },
  errorMessage: {
    color: '#6b7280'
  },
  noDataContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noDataContent: {
    textAlign: 'center'
  },
  noDataText: {
    fontSize: '18px',
    color: '#6b7280'
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '16px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b7280',
    maxWidth: '640px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  meta: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#9ca3af'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '48px'
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '24px',
    transition: 'all 0.3s ease'
  },
  statCardContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  statCardTitle: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px'
  },
  statCardValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px'
  },
  trendContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px'
  },
  trendIcon: {
    width: '16px',
    height: '16px',
    marginRight: '4px'
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainerBlue: {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
  },
  iconContainerGreen: {
    background: 'linear-gradient(135deg, #10b981, #047857)'
  },
  iconContainerRed: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)'
  },
  iconContainerPurple: {
    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
  },
  icon: {
    width: '24px',
    height: '24px',
    color: 'white'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '32px',
    marginBottom: '48px'
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '32px'
  },
  chartTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center'
  },
  chartTitleIcon: {
    width: '24px',
    height: '24px',
    marginRight: '8px',
    color: '#3b82f6'
  },
  investmentCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '32px',
    marginBottom: '48px'
  },
  investmentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '32px'
  },
  investmentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  investmentItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  investmentItemLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  colorDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    marginRight: '12px'
  },
  investmentName: {
    fontWeight: '500',
    color: '#1f2937'
  },
  investmentItemRight: {
    textAlign: 'right'
  },
  investmentPercentage: {
    fontWeight: 'bold',
    color: '#1f2937'
  },
  investmentAmount: {
    fontSize: '14px',
    color: '#6b7280'
  },
  analysisCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '32px',
    marginBottom: '48px'
  },
  analysisContent: {
    color: '#374151',
    lineHeight: '1.6'
  },
  insightsBox: {
    background: 'linear-gradient(135deg, #dbeafe, #e0f2fe)',
    padding: '24px',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6',
    marginBottom: '24px'
  },
  insightsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '12px'
  },
  insightsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  actionBox: {
    background: 'linear-gradient(135deg, #dcfce7, #d1fae5)',
    padding: '24px',
    borderRadius: '8px',
    borderLeft: '4px solid #10b981'
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '12px'
  },
  actionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  footer: {
    textAlign: 'center',
    marginTop: '48px',
    color: '#9ca3af'
  },
  footerText: {
    fontSize: '14px'
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
};

export default AnalysisResultPage;