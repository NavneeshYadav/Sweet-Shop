'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Download, Edit, X } from 'lucide-react';
import EntryModal from '@/components/EntryModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: number;
  type: 'Earning' | 'Expense';
  description: string;
  category: string;
  amount: number;
  date: string;
}

interface FilterState {
  type: 'All' | 'Earning' | 'Expense';
  category: string;
  month: string;
  date: string;
}

const ExpensesPage = () => {
  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Filter state combined into a single object
  const [filters, setFilters] = useState<FilterState>({
    type: 'All',
    category: '',
    month: '',
    date: ''
  });

  // Sample transaction data
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'Earning', description: 'Online Order', category: 'Sales', amount: 5000, date: '2025-04-01' },
    { id: 2, type: 'Expense', description: 'Packaging Material', category: 'Supplies', amount: 800, date: '2025-04-03' },
    { id: 3, type: 'Expense', description: 'Rent Payment', category: 'Office', amount: 15000, date: '2025-03-31' },
    { id: 4, type: 'Earning', description: 'Wholesale Order', category: 'Sales', amount: 12000, date: '2025-03-15' },
  ]);

  // Memoize unique categories from transactions
  const categories = useMemo(() => 
    Array.from(new Set(transactions.map(t => t.category))),
    [transactions]
  );

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => 
    transactions.filter(t => {
      if (filters.type !== 'All' && t.type !== filters.type) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.month && !t.date.startsWith(filters.month)) return false;
      if (filters.date && t.date !== filters.date) return false;
      return true;
    }),
    [transactions, filters]
  );

  // Calculate financial summaries
  const financialSummary = useMemo(() => {
    const totalEarnings = filteredTransactions
      .filter(t => t.type === 'Earning')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    return {
      totalEarnings,
      totalExpenses,
      netProfit: totalEarnings - totalExpenses
    };
  }, [filteredTransactions]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const groupedMap: { [date: string]: { date: string; Earning: number; Expense: number } } = {};
    
    filteredTransactions.forEach(({ date, type, amount }) => {
      if (!groupedMap[date]) {
        groupedMap[date] = { date, Earning: 0, Expense: 0 };
      }
      groupedMap[date][type] += amount;
    });
    
    return Object.values(groupedMap);
  }, [filteredTransactions]);

  // Event handlers with useCallback
  const handleAddEntry = useCallback((newEntry: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...newEntry, id: Date.now() }]); // Using timestamp as ID is more reliable
  }, []);

  const handleEditEntry = useCallback((updatedTransaction: Transaction) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
  }, []);

  const handleDeleteEntry = useCallback(() => {
    if (selectedTransaction) {
      setTransactions(prev =>
        prev.filter(transaction => transaction.id !== selectedTransaction.id)
      );
      setModalOpen(false);
    }
  }, [selectedTransaction]);

  const openAddModal = useCallback(() => {
    setSelectedTransaction(null);
    setModalMode('add');
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalMode('edit');
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback((values: any) => {
    modalMode === 'add' ? handleAddEntry(values) : handleEditEntry(values as Transaction);
    setModalOpen(false);
  }, [modalMode, handleAddEntry, handleEditEntry]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedTransaction(null);
  }, []);

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      type: 'All',
      category: '',
      month: '',
      date: ''
    });
  }, []);

  const handleSelectDate = useCallback((date: string) => {
    setFilters(prev => ({
      ...prev,
      date: prev.date === date ? '' : date // Toggle date filter
    }));
  }, []);

  const removeFilter = useCallback((filterName: keyof FilterState) => {
    setFilters(prev => ({ 
      ...prev, 
      [filterName]: filterName === 'type' ? 'All' : '' 
    }));
  }, []);

  const exportTransactions = useCallback(() => {
    const headers = ['Date', 'Type', 'Description', 'Category', 'Amount'];
    const csvContent = filteredTransactions.map(t =>
      `${t.date},${t.type},"${t.description.replace(/"/g, '""')}",${t.category},${t.amount}`
    );
    const csvData = [headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Expenses and Earnings</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <p className="text-green-700 font-semibold">Total Earnings</p>
            <p className="text-2xl font-bold">₹{financialSummary.totalEarnings}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow">
            <p className="text-red-700 font-semibold">Total Expenses</p>
            <p className="text-2xl font-bold">₹{financialSummary.totalExpenses}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <p className="text-blue-700 font-semibold">Net Profit</p>
            <p className="text-2xl font-bold">₹{financialSummary.netProfit}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="month"
            className="border px-3 py-2 rounded-md"
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
            aria-label="Filter by month"
          />

          <select
            className="border px-3 py-2 rounded-md"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value as 'All' | 'Earning' | 'Expense')}
            aria-label="Filter by transaction type"
          >
            <option value="All">All Types</option>
            <option value="Earning">Earnings Only</option>
            <option value="Expense">Expenses Only</option>
          </select>

          <select
            className="border px-3 py-2 rounded-md"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
            onClick={exportTransactions}
            aria-label="Export data"
          >
            <Download size={16} /> Export
          </button>

          <button
            onClick={handleClearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            aria-label="Clear all filters"
          >
            Clear All Filters
          </button>
        </div>

        {/* Active Filters */}
        {(filters.type !== 'All' || filters.category || filters.month || filters.date) && (
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="text-sm text-gray-600">Active filters:</div>
            {filters.type !== 'All' && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                Type: {filters.type}
                <button 
                  onClick={() => removeFilter('type')} 
                  className="ml-1 hover:text-blue-900"
                  aria-label="Remove type filter"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                Category: {filters.category}
                <button 
                  onClick={() => removeFilter('category')} 
                  className="ml-1 hover:text-purple-900"
                  aria-label="Remove category filter"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.month && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                Month: {filters.month}
                <button 
                  onClick={() => removeFilter('month')} 
                  className="ml-1 hover:text-green-900"
                  aria-label="Remove month filter"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.date && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center">
                Date: {filters.date}
                <button 
                  onClick={() => removeFilter('date')} 
                  className="ml-1 hover:text-orange-900"
                  aria-label="Remove date filter"
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Transaction Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className={`border-t hover:bg-gray-50 ${filters.date === txn.date ? 'bg-yellow-50' : ''}`}
                  >
                    <td className="p-3">
                      <button 
                        className="hover:underline focus:outline-none"
                        onClick={() => handleSelectDate(txn.date)}
                        aria-label={`Filter by date ${txn.date}`}
                      >
                        {txn.date}
                      </button>
                    </td>
                    <td className={`p-3 ${txn.type === 'Earning' ? 'text-green-600' : 'text-red-600'}`}>{txn.type}</td>
                    <td className="p-3">{txn.description}</td>
                    <td className="p-3">{txn.category}</td>
                    <td className="p-3 font-semibold">₹{txn.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(txn);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                        title="Edit entry"
                        aria-label={`Edit ${txn.description}`}
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No transactions found with the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Entry Button */}
        <div className="mt-6">
          <button
            onClick={openAddModal}
            className="bg-orange-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition"
            aria-label="Add new transaction"
          >
            <Plus size={20} /> Add Entry
          </button>
        </div>

        {/* Chart */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Earnings & Expenses Chart</h2>
          <div className="bg-white rounded-lg p-4 shadow">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend />
                  <Bar dataKey="Earning" fill="#4ade80" name="Earnings" />
                  <Bar dataKey="Expense" fill="#f87171" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available for the selected filters
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Entry Modal */}
      <EntryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onDelete={handleDeleteEntry}
        mode={modalMode}
        entry={selectedTransaction}
      />
    </div>
  );
};

export default ExpensesPage;