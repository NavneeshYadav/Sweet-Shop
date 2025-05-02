'use client';

import React, { useState } from 'react';
import { Plus, Download, Edit } from 'lucide-react';
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

const ExpensesPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [typeFilter, setTypeFilter] = useState<'All' | 'Earning' | 'Expense'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'Earning', description: 'Online Order', category: 'Sales', amount: 5000, date: '2025-04-01' },
    { id: 2, type: 'Expense', description: 'Packaging Material', category: 'Supplies', amount: 800, date: '2025-04-03' },
    { id: 3, type: 'Expense', description: 'Rent Payment', category: 'Office', amount: 15000, date: '2025-03-31' },
    { id: 4, type: 'Earning', description: 'Wholesale Order', category: 'Sales', amount: 12000, date: '2025-03-15' },
  ]);

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const resetDateFilter = () => setSelectedDate('');

  const handleAddEntry = (newEntry: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...newEntry, id: prev.length + 1 }]);
  };

  const handleEditEntry = (updatedTransaction: Transaction) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
  };

  const handleDeleteEntry = () => {
    if (selectedTransaction) {
      setTransactions(prev =>
        prev.filter(transaction => transaction.id !== selectedTransaction.id)
      );
    }
  };

  const openAddModal = () => {
    setSelectedTransaction(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    modalMode === 'add' ? handleAddEntry(values) : handleEditEntry(values as Transaction);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const filteredTransactions = transactions.filter(t => {
    if (typeFilter !== 'All' && t.type !== typeFilter) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    if (selectedDate && t.date !== selectedDate) return false;
    return true;
  });

  const totalEarnings = filteredTransactions.filter(t => t.type === 'Earning').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalEarnings - totalExpenses;

  const groupedMap: { [date: string]: { date: string; Earning: number; Expense: number } } = {};
  filteredTransactions.forEach(({ date, type, amount }) => {
    if (!groupedMap[date]) {
      groupedMap[date] = { date, Earning: 0, Expense: 0 };
    }
    groupedMap[date][type] += amount;
  });

  const groupedData = Object.values(groupedMap);

  const exportTransactions = () => {
    const headers = ['Date', 'Type', 'Description', 'Category', 'Amount'];
    const csvContent = filteredTransactions.map(t =>
      `${t.date},${t.type},${t.description},${t.category},${t.amount}`
    );
    const csvData = [headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Expenses and Earnings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <p className="text-green-700 font-semibold">Total Earnings</p>
            <p className="text-2xl font-bold">₹{totalEarnings}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow">
            <p className="text-red-700 font-semibold">Total Expenses</p>
            <p className="text-2xl font-bold">₹{totalExpenses}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <p className="text-blue-700 font-semibold">Net Profit</p>
            <p className="text-2xl font-bold">₹{netProfit}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="border px-3 py-2 rounded-md"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {selectedDate && (
              <button
                onClick={resetDateFilter}
                className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
              >
                Clear
              </button>
            )}
          </div>

          <select
            className="border px-3 py-2 rounded-md"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'All' | 'Earning' | 'Expense')}
          >
            <option value="All">All Types</option>
            <option value="Earning">Earnings Only</option>
            <option value="Expense">Expenses Only</option>
          </select>

          <select
            className="border px-3 py-2 rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={exportTransactions}
          >
            <Download size={16} /> Export
          </button>
        </div>

        {/* Active Filters */}
        {(typeFilter !== 'All' || categoryFilter || selectedDate) && (
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="text-sm text-gray-600">Active filters:</div>
            {typeFilter !== 'All' && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Type: {typeFilter}
              </span>
            )}
            {categoryFilter && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                Category: {categoryFilter}
              </span>
            )}
            {selectedDate && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Date: {selectedDate}
              </span>
            )}
          </div>
        )}

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
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
                  <tr key={txn.id} className="border-t">
                    <td className="p-3">{txn.date}</td>
                    <td className={`p-3 ${txn.type === 'Earning' ? 'text-green-600' : 'text-red-600'}`}>{txn.type}</td>
                    <td className="p-3">{txn.description}</td>
                    <td className="p-3">{txn.category}</td>
                    <td className="p-3 font-semibold">₹{txn.amount}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(txn)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit entry"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
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

        <div className="mt-6">
          <button
            onClick={openAddModal}
            className="bg-orange-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition"
          >
            <Plus size={20} /> Add Entry
          </button>
        </div>

        {/* Chart */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Earnings & Expenses Chart</h2>
          <div className="bg-white rounded-lg p-4 shadow">
            {groupedData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={groupedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Earning" fill="#4ade80" />
                  <Bar dataKey="Expense" fill="#f87171" />
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
