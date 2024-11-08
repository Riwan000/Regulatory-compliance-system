import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Line, 
  Bar, 
  Pie, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const BaselComplianceDashboard = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [showChat, setShowChat] = useState(false);

  const fetchTransactionData = () => {
    Papa.parse('/public/raw_realtime_data.csv', {
      download: true,
      header: true,
      complete: (results) => {
        console.log('Parsed CSV results:', results); // Log the raw results
  
        // Check if results.data is empty
        if (!results.data || results.data.length === 0) {
          console.error('No data found in CSV file.');
          return;
        }
  
        // Extract only the desired columns
        const formattedData = results.data.map(item => ({
          id: item.transaction_id,       // Extract transaction_id
          type: item.type,               // Extract type
          amount: parseFloat(item.amount), // Convert amount to float
          step: item.step,               // Extract step
        })).filter(item => item.id); // Filter out any rows without an ID
  
        console.log('Formatted Data:', formattedData); // Log the formatted data
  
        // Check for NaN values
        const hasNaN = formattedData.some(item => isNaN(item.amount));
        if (hasNaN) {
          console.error('Found NaN values in transaction data:', formattedData);
        }
  
        setTransactionData(formattedData);
      },
      error: (error) => {
        console.error('Error fetching CSV data:', error);
      },
    });
  };

  // Fetch data every 5 seconds
  useEffect(() => {
    fetchTransactionData(); // Initial fetch
    const interval = setInterval(fetchTransactionData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const complianceData = [
    { type: 'KYC', pass: 85, fail: 10, underReview: 5 },
    { type: 'AML', pass: 92, fail: 6, underReview: 2 },
    { type: 'Sanctions', pass: 90, fail: 8, underReview: 2 },
    { type: 'OFAC', pass: 88, fail: 10, underReview: 2 },
  ];

  const newsData = [
    {
      id: 'NEWS001',
      title: 'Basel Committee Releases Updated Guidance on Operational Risk',
      date: '2023-11-01',
      content: 'The Basel Committee on Banking Supervision has published revisions to its operational risk framework, introducing new requirements for banks to enhance their risk management practices.'
    },
    {
      id: 'NEWS002',
      title: 'EU Proposes Stricter Anti-Money Laundering Rules for Crypto Sector',
      date: '2023-10-30',
      content: 'The European Commission has unveiled a legislative proposal to subject the cryptocurrency industry to stricter anti-money laundering and counter-terrorist financing rules, aligning it with the financial sector.'
    },
    {
      id: 'NEWS003',
      title: 'APAC Regulators Collaborate on Cross-Border Compliance Initiatives',
      date: '2023-10-25',
      content: 'Financial regulators from Asia-Pacific countries have announced joint efforts to harmonize regulatory frameworks and enhance cross-border compliance monitoring in the region.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Centered Main Heading */}
      <div className="text-center py-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800">Basel Committee Regulatory Compliance Dashboard</h1>
      </div>

      <div className="mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Transaction Data Table */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction Data</h2>
                <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Transaction ID</th>
                        <th className="py-2 px-4 border-b">Type</th>
                        <th className="py-2 px-4 border-b">Amount</th>
                        <th className="py-2 px-4 border-b">Step</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactionData.length === 0 ? (
                        <tr>
                        <td colSpan="4" className="py-2 px-4 border-b text-center">No transactions available</td>
                        </tr>
                    ) : (
                        transactionData.map((transaction) => (
                        <tr key={transaction.id}>
                            <td className="py-2 px-4 border-b">{transaction.id}</td>
                            <td className="py-2 px-4 border-b">{transaction.type}</td>
                            <td className="py-2 px-4 border-b">{transaction.amount}</td>
                            <td className="py-2 px-4 border-b">{transaction.step}</td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
                </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Transaction Volume Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction Volume</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Volume" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Rates Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Compliance Rates</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pass" fill="#82ca9d" name="Pass" />
                  <Bar dataKey="fail" fill="#d62728" name="Fail" />
                  <Bar dataKey="underReview" fill="#ffa500" name="Under Review" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Compliance Type Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Compliance Type Breakdown</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={complianceData} 
                  dataKey="pass" 
                  nameKey="type" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  fill="#82ca9d" 
                  label 
                  isAnimationActive={false}
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#00C49F" />
                  <Cell fill="#FFBB28" />
                  <Cell fill ="#FF8042" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Data Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Compliance Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Pass</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Fail</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Under Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {complianceData.map((row, index) => (
                  <tr key={row.type} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">{row.pass}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">{row.fail}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 text-right">{row.underReview}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar with News and Chat */}
      <div className="xl:w-96">
        <div className="space-y-6">
          {/* News Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Regulatory News</h2>
            <div className="space-y-6">
              {newsData.map((news) => (
                <div key={news.id} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{news.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{news.date}</p>
                  <p className="text-gray-600">{news.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Compliance Support Chat</h2>
              <button
                onClick={() => setShowChat(!showChat)}
                className="text-blue-600 hover:text-blue-700"
              >
                <ChatIcon />
              </button>
            </div>
            {showChat && (
              <div className="border-t border-gray-200 pt-4">
                <div className="bg-gray-50 rounded p-4">
                  <p className="text-gray-600">Chat with our compliance experts here...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaselComplianceDashboard;