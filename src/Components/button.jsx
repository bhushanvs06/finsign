import React, { useState } from 'react';
import { Upload, FileText, TrendingUp, PieChart, BarChart3, DollarSign, Calculator, Shield, AlertCircle, CheckCircle, Menu, X, Target, BookOpen, Brain, Loader } from 'lucide-react';

const FinSightDashboard = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTax, setCurrentTax] = useState(0);
  const [potentialSavings, setPotentialSavings] = useState(0);
  const [investmentPlan, setInvestmentPlan] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setLoading(true);
      setAnalysisComplete(false);
      
      try {
        const formData = new FormData();
        formData.append('pdf', file);
        
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        // Parse AI response and extract key information
        const aiResponse = data.suggestion;
        setAiSuggestions(aiResponse);
        
        // Extract numbers from AI response (basic parsing)
        const taxMatch = aiResponse.match(/tax.*?(\d+,?\d*)/i);
        const savingsMatch = aiResponse.match(/save.*?(\d+,?\d*)/i);
        
        if (taxMatch) {
          setCurrentTax(parseInt(taxMatch[1].replace(',', '')));
        }
        if (savingsMatch) {
          setPotentialSavings(parseInt(savingsMatch[1].replace(',', '')));
        }
        
        // Extract investment plan
        const investmentMatches = aiResponse.match(/(\d+)%\s*([^,\n]+)/g);
        if (investmentMatches) {
          const plan = investmentMatches.map(match => {
            const [, percentage, instrument] = match.match(/(\d+)%\s*(.+)/);
            return { percentage: parseInt(percentage), instrument: instrument.trim() };
          });
          setInvestmentPlan(plan);
        }
        
        setAnalysisComplete(true);
        setLoading(false);
      } catch (error) {
        console.error('Error uploading file:', error);
        setLoading(false);
        alert('Error analyzing PDF. Please try again.');
      }
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
    { id: 'upload', label: 'AI Analysis', icon: Brain },
    { id: 'calculator', label: 'Tax Calculator', icon: Calculator },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
  ];

  // Dashboard Content Component
  const DashboardContent = () => (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Brain className="text-blue-600" size={20} />
          AI-Powered Tax Analysis
        </h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-2">Upload your PDF tax documents for AI analysis</p>
            <p className="text-sm text-gray-500">Supports: Form 16, Bank Statements, Investment Proofs</p>
          </label>
          
          {uploadedFile && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-center gap-2">
              <FileText className="text-blue-600" size={20} />
              <span className="text-blue-800">{uploadedFile.name}</span>
              {loading ? (
                <Loader className="animate-spin text-blue-600" size={20} />
              ) : analysisComplete ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Potential Savings</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{potentialSavings ? potentialSavings.toLocaleString() : '78,000'}
              </p>
            </div>
            <DollarSign className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Tax</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{currentTax ? currentTax.toLocaleString() : '2,40,000'}
              </p>
            </div>
            <Calculator className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Optimization Score</p>
              <p className="text-2xl font-bold text-orange-600">
                {analysisComplete ? '85/100' : '67/100'}
              </p>
            </div>
            <Target className="text-orange-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Documents Analyzed</p>
              <p className="text-2xl font-bold text-purple-600">{uploadedFile ? '1' : '0'}</p>
            </div>
            <FileText className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Investment Allocation Chart */}
      {investmentPlan.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="text-blue-600" size={20} />
            AI Recommended Investment Allocation
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {investmentPlan.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{backgroundColor: `hsl(${index * 60}, 70%, 60%)`}}
                    ></div>
                    <span className="font-medium text-gray-800">{item.instrument}</span>
                  </div>
                  <span className="font-bold text-blue-600">{item.percentage}%</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {investmentPlan.reduce((acc, item, index) => {
                    const startAngle = acc.angle;
                    const endAngle = startAngle + (item.percentage * 3.6);
                    const largeArcFlag = item.percentage > 50 ? 1 : 0;
                    const x1 = 50 + 40 * Math.cos(startAngle * Math.PI / 180);
                    const y1 = 50 + 40 * Math.sin(startAngle * Math.PI / 180);
                    const x2 = 50 + 40 * Math.cos(endAngle * Math.PI / 180);
                    const y2 = 50 + 40 * Math.sin(endAngle * Math.PI / 180);
                    
                    acc.paths.push(
                      <path
                        key={index}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={`hsl(${index * 60}, 70%, 60%)`}
                        stroke="white"
                        strokeWidth="1"
                      />
                    );
                    acc.angle = endAngle;
                    return acc;
                  }, { angle: 0, paths: [] }).paths}
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tax Savings Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={20} />
            Tax Saving Opportunities
          </h3>
          
          <div className="h-64 flex items-end justify-around gap-4">
            {taxSavingsData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gray-200 rounded-t-lg relative h-32">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg absolute bottom-0 transition-all duration-1000"
                    style={{height: analysisComplete ? `${(item.savings / 30000) * 100}%` : '0%'}}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">{item.category}</p>
                <p className="text-sm font-semibold text-green-600">₹{item.savings.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-600" size={20} />
            Savings Trend
          </h3>
          
          <div className="h-32 flex items-end justify-around gap-2">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-green-500 rounded-t transition-all duration-1000"
                  style={{height: analysisComplete ? `${(item.savings / 5000) * 80}px` : '0px'}}
                ></div>
                <p className="text-xs text-gray-600 mt-1">{item.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Brain className="text-amber-600" size={20} />
          AI Recommendations
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader className="animate-spin text-blue-600 mr-2" size={20} />
            <span className="text-gray-600">AI is analyzing your documents...</span>
          </div>
        ) : aiSuggestions ? (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Brain size={16} />
                AI Analysis Results
              </h4>
              <div className="text-sm text-gray-700 whitespace-pre-line max-h-64 overflow-y-auto">
                {aiSuggestions}
              </div>
            </div>
          </div>
        ) : analysisComplete ? (
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-800">High Priority</p>
              <p className="text-amber-700">Increase Section 80C investments by ₹1,00,000 to save ₹30,000 in taxes</p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Medium Priority</p>
              <p className="text-blue-700">Consider increasing home loan amount for additional interest deduction</p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800">Investment Strategy</p>
              <p className="text-green-700">Diversify portfolio: 50% FD, 30% Mutual Funds, 20% PPF for optimal risk-return balance</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <Brain className="mx-auto mb-2 text-gray-400" size={32} />
              <p>Upload your tax documents to get AI-powered recommendations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // AI Analysis Content
  const AIAnalysisContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Brain className="text-blue-600" size={20} />
          AI Tax Document Analysis
        </h3>
        
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="ai-file-upload"
          />
          <label htmlFor="ai-file-upload" className="cursor-pointer">
            <Brain className="mx-auto text-blue-500 mb-4" size={64} />
            <h4 className="text-xl font-semibold text-blue-800 mb-2">Upload for AI Analysis</h4>
            <p className="text-blue-600 mb-4">Get personalized tax optimization recommendations</p>
            <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="mr-2" size={20} />
              Choose PDF Document
            </div>
          </label>
        </div>
        
        {uploadedFile && (
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {loading ? 'Analyzing with AI...' : analysisComplete ? 'Analysis complete' : 'Ready for analysis'}
                  </p>
                </div>
              </div>
              {loading ? (
                <Loader className="animate-spin text-blue-600" size={20} />
              ) : analysisComplete ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : null}
            </div>
          </div>
        )}
      </div>
      
      {aiSuggestions && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="text-amber-600" size={20} />
            Detailed AI Analysis
          </h4>
          <div className="prose max-w-none">
            <div className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg border">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                {aiSuggestions}
              </pre>
            </div>
          </div>
        </div>
      )}
      
      {investmentPlan.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="text-green-600" size={20} />
            Recommended Investment Strategy
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investmentPlan.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-800">{item.instrument}</h5>
                  <span className="text-lg font-bold text-blue-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{width: `${item.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
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
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Calculator className="text-blue-600" size={20} />
            Income Tax Calculator
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (₹)</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your annual income"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Deductions (₹)</label>
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter total deductions"
                />
              </div>
              
              <button
                onClick={calculateTax}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Calculate Tax
              </button>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Tax Calculation Result</h4>
              {calculatedTax !== null ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">Calculated Tax Amount</p>
                  <p className="text-2xl font-bold text-blue-800">₹{calculatedTax.toLocaleString()}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    Taxable Income: ₹{(parseInt(income) - parseInt(deductions || 0)).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600">
                  Enter your income details to calculate tax
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Tax Slabs (AY 2024-25)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Income Range</th>
                  <th className="text-left py-2">Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Up to ₹2,50,000</td>
                  <td className="py-2">0%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">₹2,50,001 - ₹5,00,000</td>
                  <td className="py-2">5%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">₹5,00,001 - ₹10,00,000</td>
                  <td className="py-2">20%</td>
                </tr>
                <tr>
                  <td className="py-2">Above ₹10,00,000</td>
                  <td className="py-2">30%</td>
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
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <BookOpen className="text-blue-600" size={20} />
          Tax Reports & Analytics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'AI Tax Analysis Report', desc: 'AI-generated tax optimization insights', status: analysisComplete ? 'Ready' : 'Pending' },
            { title: 'Investment Portfolio', desc: 'AI-recommended investment allocation', status: investmentPlan.length > 0 ? 'Ready' : 'Pending' },
            { title: 'Annual Tax Summary', desc: 'Complete tax breakdown for FY 2023-24', status: 'Ready' },
            { title: 'Deduction Optimizer', desc: 'Missed opportunities and suggestions', status: 'Ready' },
            { title: 'Quarterly Reports', desc: 'Q1-Q4 tax planning reports', status: 'Ready' },
            { title: 'Future Projections', desc: 'Next year tax planning insights', status: 'Ready' },
          ].map((report, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-800 mb-2">{report.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{report.desc}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  report.status === 'Ready' ? 'bg-green-100 text-green-800' :
                  report.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {report.status}
                </span>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {[
              { action: analysisComplete ? 'AI analysis completed' : 'Waiting for document upload', time: '2 hours ago', type: 'analysis' },
              { action: 'Tax calculation completed', time: '1 day ago', type: 'calculation' },
              { action: 'Report generated', time: '3 days ago', type: 'report' },
              { action: 'Profile updated', time: '1 week ago', type: 'profile' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'analysis' ? 'bg-purple-500' :
                  activity.type === 'calculation' ? 'bg-green-500' :
                  activity.type === 'report' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Export Options</h4>
          <div className="space-y-3">
            <button className="w-full p-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-800">Export AI Analysis to PDF</div>
              <div className="text-sm text-gray-600">Download comprehensive AI tax report</div>
            </button>
            
            <button className="w-full p-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-800">Export to Excel</div>
              <div className="text-sm text-gray-600">Get detailed data in spreadsheet format</div>
            </button>
            
            <button className="w-full p-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-800">Email AI Report</div>
              <div className="text-sm text-gray-600">Send AI analysis to your email address</div>
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
        return <AIAnalysisContent />;
      case 'calculator':
        return <CalculatorContent />;
      case 'reports':
        return <ReportsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:justify-start">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-600" size={24} />
            <div>
              <h1 className="text-xl font-bold text-gray-800">FinSight</h1>
              <p className="text-gray-600 text-xs">AI Tax Optimization</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-gray-600 text-sm">AI-powered tax saving insights</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <span className="text-gray-700 text-sm hidden sm:inline">User</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default FinSightDashboard;