import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  TrendingUp,
  PieChart,
  History,
  Trash2,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';




// Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Upload Component
const UploadPage = ({ onAnalysisComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setError(null);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one PDF file');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
       formData.append('pdf', selectedFiles[0]);  // ✅ match backend key

      });

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
      onAnalysisComplete(result);
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <Upload className="upload-icon" />
          <h2>Upload Financial Documents</h2>
          <p>Upload your financial PDFs for personalized investment and tax-saving analysis</p>
        </div>

        <div className="file-input-section">
          <label className="file-input-label">Select PDF Files</label>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileSelect}
            className="file-input"
            disabled={isAnalyzing}
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="selected-files">
            <h3>Selected Files:</h3>
            <div className="files-list">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <FileText className="file-icon" />
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="remove-file-btn"
                    disabled={isAnalyzing}
                  >
                    <Trash2 className="remove-icon" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || isAnalyzing}
          className="upload-btn"
        >
          {isAnalyzing ? (
            <div className="loading-content">
              <div className="spinner"></div>
              Analyzing Documents...
            </div>
          ) : (
            'Analyze Documents'
          )}
        </button>
      </div>

      {analysisResult && <AnalysisResults analysis={analysisResult} />}
    </div>
  );
};

// Analysis Results Component
const AnalysisResults = ({ analysis }) => {
  if (!analysis) return null;

  const investmentData = Object.entries(analysis.investments || {}).map(([name, value]) => ({
    name,
    value: parseFloat(value),
  }));

  const taxSavingsAmount = analysis.taxSavings?.['Estimated Savings']?.replace(/[₹,]/g, '') || '0';
  const taxData = [
    { name: 'Tax Savings', value: parseFloat(taxSavingsAmount) },
    { name: 'Regular Tax', value: Math.max(100000 - parseFloat(taxSavingsAmount), 0) }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="analysis-results">
      <div className="results-header">
        <TrendingUp className="results-icon" />
        <h2>Your Personalized Financial Strategy</h2>
        <p>Based on your financial documents, here's what we recommend</p>
      </div>

      <div className="charts-grid">
        {/* Investment Distribution */}
        <div className="chart-section">
          <h3 className="chart-title">
            <PieChart className="title-icon" />
            Investment Distribution
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={investmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {investmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            {investmentData.map((item, index) => (
              <div key={item.name} className="legend-item">
                <div className="legend-info">
                  <div
                    className="legend-color"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></div>
                  <span className="legend-name">{item.name}</span>
                </div>
                <span className="legend-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Savings */}
        <div className="chart-section">
          <h3 className="chart-title">
            <DollarSign className="title-icon" />
            Tax Savings Analysis
          </h3>
          <div className="tax-savings-amount">
            <div className="savings-value">
              ₹
              {Number(
                analysis.taxSavings?.['Estimated Savings'] || 0
              ).toLocaleString()}
            </div>
            <p className="savings-label">Potential Annual Savings</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={taxData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {analysis.taxSavings?.Tips && (
            <div className="tax-tips">
              <h4>Tax Saving Tips:</h4>
              <ul>
                {analysis.taxSavings.Tips.map((tip, index) => (
                  <li key={index}>
                    <span className="tip-bullet">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Strategy Summary */}
      <div className="strategy-summary">
        <h3>Strategy Summary</h3>
        <p>{analysis.summary}</p>
      </div>
    </div>
  );
};

// History Component
const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/history');
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch history');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      await apiCall(`/delete/${id}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(item => item._id !== id));
      if (selectedAnalysis && selectedAnalysis._id === id) {
        setSelectedAnalysis(null);
      }
    } catch (err) {
      alert('Failed to delete analysis');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <History className="page-icon" />
        <h1>Analysis History</h1>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {history.length === 0 ? (
        <div className="empty-state">
          <FileText className="empty-icon" />
          <h2>No Analysis History</h2>
          <p>Upload some financial documents to get started!</p>
        </div>
      ) : (
        <div className="history-content">
          {/* History List */}
          <div className="history-list">
            <div className="history-list-container">
              <h2>Previous Analyses</h2>
              <div className="analyses-list">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className={`analysis-item ${selectedAnalysis?._id === item._id ? 'selected' : ''}`}
                  >
                    <div className="analysis-content">
                      <h3 className="analysis-title">
                        {item.filename || 'Financial Analysis'}
                      </h3>
                      <div className="analysis-date">
                        <Calendar className="date-icon" />
                        {formatDate(item.createdAt || item.uploadDate)}
                      </div>
                      <div className="analysis-actions">
                        <button
                          onClick={() => setSelectedAnalysis(item)}
                          className="view-btn"
                        >
                          <Eye className="btn-icon" />
                          View
                        </button>
                        <button
                          onClick={() => deleteAnalysis(item._id)}
                          className="delete-btn"
                        >
                          <Trash2 className="btn-icon" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="analysis-details">
            {selectedAnalysis ? (
              <AnalysisResults analysis={selectedAnalysis} />
            ) : (
              <div className="select-analysis">
                <Eye className="select-icon" />
                <h2>Select an Analysis</h2>
                <p>Choose an analysis from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ recentAnalysis }) => {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalSavings: 0,
    avgInvestmentReturn: 0
  });

  useEffect(() => {
    // Calculate dashboard stats
    if (recentAnalysis) {
      const savingsAmount = recentAnalysis.taxSavings?.['Estimated Savings']?.replace(/[₹,]/g, '') || '0';
      setStats(prev => ({
        ...prev,
        totalSavings: parseFloat(savingsAmount)
      }));
    }
  }, [recentAnalysis]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <p>Your personalized financial insights at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Total Analyses</p>
              <p className="stat-value">{stats.totalAnalyses}</p>
            </div>
            <FileText className="stat-icon" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Potential Tax Savings</p>
              <p className="stat-value savings">₹{stats.totalSavings.toLocaleString()}</p>
            </div>
            <DollarSign className="stat-icon savings-icon" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Investment Score</p>
              <p className="stat-value score">B+</p>
            </div>
            <TrendingUp className="stat-icon score-icon" />
          </div>
        </div>
      </div>

      {/* Recent Analysis */}
      {recentAnalysis ? (
        <div className="recent-analysis">
          <h2>Latest Analysis</h2>
          <AnalysisResults analysis={recentAnalysis} />
        </div>
      ) : (
        <div className="no-analysis">
          <Upload className="no-analysis-icon" />
          <h2>No Analysis Yet</h2>
          <p>Upload your first financial document to get started!</p>
        </div>
      )}
    </div>
  );
};

// Main App Component
const Dash = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [recentAnalysis, setRecentAnalysis] = useState(null);

  const handleAnalysisComplete = (analysis) => {
    setRecentAnalysis(analysis);
    setCurrentPage('dashboard');
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'upload', name: 'Upload', icon: Upload },
    { id: 'history', name: 'History', icon: History },
  ];

  return (
    <div className="app">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background-color: #f5f5f5;
          color: #333;
          line-height: 1.6;
        }

        .app {
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        /* Navigation Styles */
        .nav {
          background-color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-brand h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e40af;
        }

        .nav-menu {
          display: flex;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          color: #6b7280;
        }

        .nav-item:hover {
          background-color: #f3f4f6;
        }

        .nav-item.active {
          background-color: #2563eb;
          color: white;
        }

        /* Upload Page Styles */
        .upload-page {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .upload-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 2rem;
        }

        .upload-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .upload-icon {
          width: 64px;
          height: 64px;
          color: #3b82f6;
          margin: 0 auto 1rem;
        }

        .upload-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .upload-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .file-input-section {
          margin-bottom: 1.5rem;
        }

        .file-input-label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .file-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .file-input:hover {
          border-color: #9ca3af;
        }

        .file-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .selected-files {
          margin-bottom: 1.5rem;
        }

        .selected-files h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .files-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .file-icon {
          width: 20px;
          height: 20px;
          color: #dc2626;
        }

        .file-name {
          font-weight: 500;
          color: #1f2937;
        }

        .file-size {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .remove-file-btn {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .remove-file-btn:hover {
          background-color: #fef2f2;
        }

        .remove-icon {
          width: 16px;
          height: 16px;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .error-message p {
          color: #dc2626;
          margin: 0;
        }

        .upload-btn {
          width: 100%;
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 1rem;
        }

        .upload-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .upload-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .loading-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Analysis Results Styles */
        .analysis-results {
          margin-top: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 2rem;
        }

        .results-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .results-icon {
          width: 48px;
          height: 48px;
          color: #10b981;
          margin: 0 auto 1rem;
        }

        .results-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .results-header p {
          color: #6b7280;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-section {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .chart-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .title-icon {
          width: 20px;
          height: 20px;
          color: #3b82f6;
        }

        .chart-container {
          margin-bottom: 1rem;
        }

        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .legend-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .legend-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-name {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .legend-value {
          font-size: 0.875rem;
          font-weight: 700;
        }

        .tax-savings-amount {
          text-align: center;
          margin-bottom: 1rem;
        }

        .savings-value {
          font-size: 2rem;
          font-weight: 700;
          color: #059669;
          margin-bottom: 0.25rem;
        }

        .savings-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .tax-tips {
          margin-top: 1rem;
        }

        .tax-tips h4 {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .tax-tips ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .tax-tips li {
          font-size: 0.875rem;
          color: #374151;
          display: flex;
          align-items: flex-start;
        }

        .tip-bullet {
          color: #10b981;
          margin-right: 0.5rem;
          font-weight: bold;
        }

        .strategy-summary {
          background: #eff6ff;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .strategy-summary h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 1rem;
        }

        .strategy-summary p {
          color: #374151;
          line-height: 1.7;
        }

        /* History Page Styles */
        .history-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .history-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .page-icon {
          width: 32px;
          height: 32px;
          color: #3b82f6;
        }

        .history-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          color: #9ca3af;
          margin: 0 auto 1rem;
        }

        .empty-state h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #9ca3af;
        }

        .history-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }

        @media (max-width: 1024px) {
          .history-content {
            grid-template-columns: 1fr;
          }
        }

        .history-list-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }

        .history-list-container h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .analyses-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .analysis-item {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .analysis-item:hover {
          border-color: #9ca3af;
        }

        .analysis-item.selected {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }

        .analysis-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .analysis-title {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .analysis-date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .date-icon {
          width: 16px;
          height: 16px;
        }

        .analysis-actions {
          display: flex;
          gap: 0.5rem;
        }

        .view-btn, .delete-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-btn {
          color: #2563eb;
          background: none;
        }

        .view-btn:hover {
          color: #1d4ed8;
          background-color: #eff6ff;
        }

        .delete-btn {
          color: #dc2626;
          background: none;
        }

        .delete-btn:hover {
          color: #b91c1c;
          background-color: #fef2f2;
        }

        .btn-icon {
          width: 16px;
          height: 16px;
        }

        .select-analysis {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 3rem;
          text-align: center;
        }

        .select-icon {
          width: 64px;
          height: 64px;
          color: #9ca3af;
          margin: 0 auto 1rem;
        }

        .select-analysis h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .select-analysis p {
          color: #9ca3af;
        }

        /* Dashboard Styles */
        .dashboard {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: #6b7280;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }

        .stat-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-value.savings {
          color: #059669;
        }

        .stat-value.score {
          color: #7c3aed;
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          color: #3b82f6;
        }

        .savings-icon {
          color: #10b981;
        }

        .score-icon {
          color: #8b5cf6;
        }

        .recent-analysis {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }

        .recent-analysis h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .no-analysis {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 3rem;
          text-align: center;
        }

        .no-analysis-icon {
          width: 64px;
          height: 64px;
          color: #9ca3af;
          margin: 0 auto 1rem;
        }

        .no-analysis h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .no-analysis p {
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-container {
            padding: 0 0.5rem;
            flex-direction: column;
            height: auto;
            padding: 1rem 0.5rem;
            gap: 1rem;
          }

          .nav-menu {
            width: 100%;
            justify-content: center;
          }

          .upload-page, .history-page, .dashboard {
            padding: 1rem;
          }

          .upload-container, .analysis-results {
            padding: 1rem;
          }

          .charts-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .history-content {
            grid-template-columns: 1fr;
          }

          .file-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .file-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }

        /* Additional utility classes */
        .text-center {
          text-align: center;
        }

        .mb-4 {
          margin-bottom: 1rem;
        }

        .mb-2 {
          margin-bottom: 0.5rem;
        }

        .flex {
          display: flex;
        }

        .items-center {
          align-items: center;
        }

        .justify-center {
          justify-content: center;
        }

        .gap-2 {
          gap: 0.5rem;
        }

        .font-bold {
          font-weight: 700;
        }

        .font-semibold {
          font-weight: 600;
        }

        .text-lg {
          font-size: 1.125rem;
        }

        .text-xl {
          font-size: 1.25rem;
        }

        .text-2xl {
          font-size: 1.5rem;
        }

        .text-3xl {
          font-size: 1.875rem;
        }

        .text-blue-500 {
          color: #3b82f6;
        }

        .text-green-500 {
          color: #10b981;
        }

        .text-red-500 {
          color: #ef4444;
        }

        .text-gray-500 {
          color: #6b7280;
        }

        .text-gray-600 {
          color: #4b5563;
        }

        .text-gray-700 {
          color: #374151;
        }

        .text-gray-800 {
          color: #1f2937;
        }

        .bg-white {
          background-color: white;
        }

        .bg-blue-50 {
          background-color: #eff6ff;
        }

        .bg-gray-50 {
          background-color: #f9fafb;
        }

        .rounded-lg {
          border-radius: 8px;
        }

        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .p-4 {
          padding: 1rem;
        }

        .p-6 {
          padding: 1.5rem;
        }

        .p-8 {
          padding: 2rem;
        }

        .px-4 {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }

        .py-3 {
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }

        .mt-4 {
          margin-top: 1rem;
        }

        .mt-8 {
          margin-top: 2rem;
        }

        .w-full {
          width: 100%;
        }

        .max-w-4xl {
          max-width: 56rem;
        }

        .max-w-6xl {
          max-width: 72rem;
        }

        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }

        .grid {
          display: grid;
        }

        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .gap-6 {
          gap: 1.5rem;
        }

        .gap-8 {
          gap: 2rem;
        }

        .space-y-2 > :not([hidden]) ~ :not([hidden]) {
          margin-top: 0.5rem;
        }

        .space-y-3 > :not([hidden]) ~ :not([hidden]) {
          margin-top: 0.75rem;
        }

        .transition-colors {
          transition-property: color, background-color, border-color;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        .hover\\:bg-blue-700:hover {
          background-color: #1d4ed8;
        }

        .hover\\:bg-gray-100:hover {
          background-color: #f3f4f6;
        }

        .disabled\\:bg-gray-400:disabled {
          background-color: #9ca3af;
        }

        .disabled\\:cursor-not-allowed:disabled {
          cursor: not-allowed;
        }
      `}</style>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-brand">
            <PieChart style={{ width: '32px', height: '32px', color: '#2563eb' }} />
            <h1>FinAnalyzer Pro</h1>
          </div>
          <div className="nav-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                >
                  <Icon style={{ width: '16px', height: '16px' }} />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentPage === 'dashboard' && <Dashboard recentAnalysis={recentAnalysis} />}
        {currentPage === 'upload' && <UploadPage onAnalysisComplete={handleAnalysisComplete} />}
        {currentPage === 'history' && <HistoryPage />}
      </main>
    </div>
  );
};

export default Dash;