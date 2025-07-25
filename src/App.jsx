// src/App.jsx
import React, { useState } from 'react';
import { Upload, FileText, TrendingUp, BarChart3, DollarSign, Calculator, Shield, AlertCircle, CheckCircle, Menu, X, Target, BookOpen } from 'lucide-react';
import './styles/App.css';
import './styles/dashboard.css';
// import './styles/components.css';
// import './styles/responsive.css';

const FinSightDashboard = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setLoading(true);
      setAnalysisComplete(false);
      
      setTimeout(() => {
        setAnalysisComplete(true);
        setLoading(false);
      }, 3000);
    }
  };

  const taxSavingsData = [
    { category: '80C Investments', current: 50000, potential: 150000, savings: 30000 },
    { category: 'Home Loan Interest', current: 100000, potential: 200000, savings: 30000 },
    { category: 'Medical Insurance', current: 15000, potential: 50000, savings: 10500 },
    { category: 'Donations', current: 0, potential: 25000, savings: 7500 },
  ];

  const monthlyData = [
    { month: 'Jan', savings: 2400 },
    { month: 'Feb', savings: 1398 },
    { month: 'Mar', savings: 3800 },
    { month: 'Apr', savings: 3908 },
    { month: 'May', savings: 4800 },
    { month: 'Jun', savings: 3800 },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'upload', label: 'Upload Documents', icon: Upload },
    { id: 'calculator', label: 'Tax Calculator', icon: Calculator },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
  ];

  // Dashboard Content Component
  const DashboardContent = () => (
    <div className="content-container">
      {/* File Upload Section */}
      <div className="card">
        <h3 className="card-title">
          <Upload className="icon-blue" size={20} />
          Upload Tax Documents
        </h3>
        
        <div className="upload-area" onClick={() => document.getElementById('file-upload').click()}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="file-input"
            id="file-upload"
          />
          <FileText className="upload-icon" size={48} />
          <p className="upload-text">Drop your PDF tax documents here or click to browse</p>
          <p className="upload-subtext">Supports: Form 16, Bank Statements, Investment Proofs</p>
          
          {uploadedFile && (
            <div className="uploaded-file">
              <FileText className="icon-blue" size={20} />
              <span className="file-name">{uploadedFile.name}</span>
              {loading ? (
                <div className="spinner"></div>
              ) : analysisComplete ? (
                <CheckCircle className="icon-green" size={20} />
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Potential Savings</p>
              <p className="stat-value stat-value-green">₹78,000</p>
            </div>
            <DollarSign className="icon-green" size={24} />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Current Tax</p>
              <p className="stat-value stat-value-blue">₹2,40,000</p>
            </div>
            <Calculator className="icon-blue" size={24} />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Optimization Score</p>
              <p className="stat-value stat-value-orange">67/100</p>
            </div>
            <Target className="icon-orange" size={24} />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Documents</p>
              <p className="stat-value stat-value-purple">{uploadedFile ? '1' : '0'}</p>
            </div>
            <FileText className="icon-purple" size={24} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Tax Savings Chart */}
        <div className="chart-card">
          <h3 className="card-title">
            <BarChart3 className="icon-blue" size={20} />
            Tax Saving Opportunities
          </h3>
          
          <div className="chart-container">
            {taxSavingsData.map((item, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-container">
                  <div 
                    className={`bar-fill ${analysisComplete ? 'animated' : ''}`}
                    style={{'--bar-height': `${(item.savings / 30000) * 100}%`}}
                  ></div>
                </div>
                <p className="bar-label">{item.category}</p>
                <p className="bar-value">₹{item.savings.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="trend-card">
          <h3 className="card-title">
            <TrendingUp className="icon-green" size={20} />
            Savings Trend
          </h3>
          
          <div className="trend-container">
            {monthlyData.map((item, index) => (
              <div key={index} className="trend-bar">
                <div 
                  className={`trend-fill ${analysisComplete ? 'animated' : ''}`}
                  style={{'--trend-height': `${(item.savings / 5000) * 80}px`}}
                ></div>
                <p className="trend-label">{item.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card">
        <h3 className="card-title">
          <AlertCircle className="icon-amber" size={20} />
          AI Recommendations
        </h3>
        
        {analysisComplete ? (
          <div className="recommendations-container">
            <div className="recommendation-item recommendation-high">
              <p className="recommendation-priority">High Priority</p>
              <p className="recommendation-text">Increase Section 80C investments by ₹1,00,000 to save ₹30,000 in taxes</p>
            </div>
            
            <div className="recommendation-item recommendation-medium">
              <p className="recommendation-priority">Medium Priority</p>
              <p className="recommendation-text">Consider increasing home loan amount for additional interest deduction</p>
            </div>
            
            <div className="recommendation-item recommendation-low">
              <p className="recommendation-priority">Low Priority</p>
              <p className="recommendation-text">Optimize health insurance premium to maximize 80D benefits</p>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Upload your tax documents to get AI-powered recommendations</p>
          </div>
        )}
      </div>
    </div>
  );

  // Upload Documents Content
  const UploadContent = () => (
    <div className="content-container">
      <div className="card">
        <h3 className="card-title">Document Upload Center</h3>
        
        <div className="upload-grid">
          {[
            { type: 'Form 16', desc: 'Annual salary certificate', icon: '📄' },
            { type: 'Bank Statements', desc: 'Last 6 months statements', icon: '🏦' },
            { type: 'Investment Proofs', desc: 'ELSS, PPF, NSC receipts', icon: '📊' },
            { type: 'Insurance Premiums', desc: 'Health & life insurance', icon: '🛡️' },
            { type: 'Home Loan Documents', desc: 'Interest certificates', icon: '🏠' },
            { type: 'Donation Receipts', desc: '80G eligible donations', icon: '❤️' },
          ].map((item, index) => (
            <div key={index} className="upload-card">
              <div className="upload-icon-large">{item.icon}</div>
              <h4 className="upload-card-title">{item.type}</h4>
              <p className="upload-card-desc">{item.desc}</p>
              <button className="upload-button">
                Upload Document
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {uploadedFile && (
        <div className="card">
          <h4 className="card-subtitle">Uploaded Documents</h4>
          <div className="uploaded-document">
            <FileText className="icon-blue" size={20} />
            <div className="document-info">
              <p className="document-name">{uploadedFile.name}</p>
              <p className="document-time">Uploaded just now</p>
            </div>
            {analysisComplete && <CheckCircle className="icon-green" size={20} />}
          </div>
        </div>
      )}
    </div>
  );

  // Tax Calculator Content
  const CalculatorContent = () => {
    const [income, setIncome] = useState('');
    const [deductions, setDeductions] = useState('');
    const [calculatedTax, setCalculatedTax] = useState(null);

    const calculateTax = () => {
      const taxableIncome = parseInt(income) - parseInt(deductions || 0);
      let tax = 0;
      
      if (taxableIncome > 1000000) {
        tax = 112500 + (taxableIncome - 1000000) * 0.3;
      } else if (taxableIncome > 500000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2;
      } else if (taxableIncome > 250000) {
        tax = (taxableIncome - 250000) * 0.05;
      }
      
      setCalculatedTax(Math.max(0, tax));
    };

    return (
      <div className="content-container">
        <div className="card">
          <h3 className="card-title">
            <Calculator className="icon-blue" size={20} />
            Income Tax Calculator
          </h3>
          
          <div className="calculator-grid">
            <div className="calculator-inputs">
              <div className="input-group">
                <label className="input-label">Annual Income (₹)</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="input-field"
                  placeholder="Enter your annual income"
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Total Deductions (₹)</label>
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  className="input-field"
                  placeholder="Enter total deductions"
                />
              </div>
              
              <button
                onClick={calculateTax}
                className="calculate-button"
              >
                Calculate Tax
              </button>
            </div>
            
            <div className="calculator-results">
              <h4 className="results-title">Tax Calculation Result</h4>
              {calculatedTax !== null ? (
                <div className="result-card">
                  <p className="result-label">Calculated Tax Amount</p>
                  <p className="result-value">₹{calculatedTax.toLocaleString()}</p>
                  <p className="result-info">
                    Taxable Income: ₹{(parseInt(income) - parseInt(deductions || 0)).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="result-placeholder">
                  Enter your income details to calculate tax
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="card">
          <h4 className="card-subtitle">Tax Slabs (AY 2024-25)</h4>
          <div className="table-container">
            <table className="tax-table">
              <thead>
                <tr>
                  <th>Income Range</th>
                  <th>Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Up to ₹2,50,000</td>
                  <td>0%</td>
                </tr>
                <tr>
                  <td>₹2,50,001 - ₹5,00,000</td>
                  <td>5%</td>
                </tr>
                <tr>
                  <td>₹5,00,001 - ₹10,00,000</td>
                  <td>20%</td>
                </tr>
                <tr>
                  <td>Above ₹10,00,000</td>
                  <td>30%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Reports Content
  const ReportsContent = () => (
    <div className="content-container">
      <div className="card">
        <h3 className="card-title">
          <BookOpen className="icon-blue" size={20} />
          Tax Reports & Analytics
        </h3>
        
        <div className="reports-grid">
          {[
            { title: 'Annual Tax Summary', desc: 'Complete tax breakdown for FY 2023-24', status: 'Ready' },
            { title: 'Investment Analysis', desc: 'Performance of tax-saving investments', status: 'Processing' },
            { title: 'Deduction Optimizer', desc: 'Missed opportunities and suggestions', status: 'Ready' },
            { title: 'Quarterly Reports', desc: 'Q1-Q4 tax planning reports', status: 'Ready' },
            { title: 'Compliance Checklist', desc: 'ITR filing compliance status', status: 'Pending' },
            { title: 'Future Projections', desc: 'Next year tax planning insights', status: 'Ready' },
          ].map((report, index) => (
            <div key={index} className="report-card">
              <h4 className="report-title">{report.title}</h4>
              <p className="report-desc">{report.desc}</p>
              <div className="report-footer">
                <span className={`status-badge status-${report.status.toLowerCase()}`}>
                  {report.status}
                </span>
                <button className="view-button">
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="reports-bottom-grid">
        <div className="card">
          <h4 className="card-subtitle">Recent Activity</h4>
          <div className="activity-list">
            {[
              { action: 'Document uploaded', time: '2 hours ago', type: 'upload' },
              { action: 'Tax calculation completed', time: '1 day ago', type: 'calculation' },
              { action: 'Report generated', time: '3 days ago', type: 'report' },
              { action: 'Profile updated', time: '1 week ago', type: 'profile' },
            ].map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-dot activity-${activity.type}`}></div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h4 className="card-subtitle">Export Options</h4>
          <div className="export-options">
            <button className="export-button">
              <div className="export-title">Export to PDF</div>
              <div className="export-desc">Download comprehensive tax report</div>
            </button>
            
            <button className="export-button">
              <div className="export-title">Export to Excel</div>
              <div className="export-desc">Get detailed data in spreadsheet format</div>
            </button>
            
            <button className="export-button">
              <div className="export-title">Email Report</div>
              <div className="export-desc">Send report to your email address</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'upload':
        return <UploadContent />;
      case 'calculator':
        return <CalculatorContent />;
      case 'reports':
        return <ReportsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <Shield className="logo-icon" size={24} />
            <div className="logo-text">
              <h1 className="logo-title">FinSight</h1>
              <p className="logo-subtitle">AI Tax Optimization</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`nav-item ${activeTab === item.id ? 'nav-item-active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button
              onClick={() => setSidebarOpen(true)}
              className="menu-button"
            >
              <Menu size={24} />
            </button>
            <div className="header-title-container">
              <h2 className="header-title">
                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="header-subtitle">AI-powered tax saving insights</p>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-avatar">
              <span>U</span>
            </div>
            <span className="user-name">User</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default FinSightDashboard;