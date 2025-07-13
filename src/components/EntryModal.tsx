'use client';

import { Dialog } from '@headlessui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

interface Transaction {
  id: number;
  type: 'Earning' | 'Expense';
  description: string;
  category: string;
  amount: number;
  date: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  onDelete?: () => void;
  mode: 'add' | 'edit';
  entry?: Transaction | null;
}

const EntryModal = ({ isOpen, onClose, onSubmit, onDelete, mode, entry }: Props) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: entry?.id || 0,
      type: entry?.type || 'Earning',
      description: entry?.description || '',
      category: entry?.category || '',
      amount: entry?.amount || '',
      date: entry?.date || '',
    },
    validationSchema: Yup.object({
      type: Yup.string().required(),
      description: Yup.string().required('Required'),
      category: Yup.string().required('Required'),
      amount: Yup.number().positive('Must be positive').required('Required'),
      date: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
      onClose();
    },
  });

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete();
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 mx-2 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {!showDeleteConfirm ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {mode === 'add' ? 'Add Entry' : 'Edit Entry'}
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Type</label>
                <select
                  name="type"
                  onChange={formik.handleChange}
                  value={formik.values.type}
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="Earning">Earning</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  className="w-full border px-3 py-2 rounded-md"
                />
                {formik.errors.description && <p className="text-sm text-red-500">{formik.errors.description}</p>}
              </div>
              <div>
                <label className="block mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  onChange={formik.handleChange}
                  value={formik.values.category}
                  className="w-full border px-3 py-2 rounded-md"
                />
                {formik.errors.category && <p className="text-sm text-red-500">{formik.errors.category}</p>}
              </div>
              <div>
                <label className="block mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  onChange={formik.handleChange}
                  value={formik.values.amount}
                  className="w-full border px-3 py-2 rounded-md"
                />
                {formik.errors.amount && <p className="text-sm text-red-500">{formik.errors.amount}</p>}
              </div>
              <div>
                <label className="block mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  onChange={formik.handleChange}
                  value={formik.values.date}
                  className="w-full border px-3 py-2 rounded-md"
                />
                {formik.errors.date && <p className="text-sm text-red-500">{formik.errors.date}</p>}
              </div>
              <div className="flex justify-end gap-4">
                {mode === 'edit' && onDelete && (
                  <button 
                    type="button" 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="mr-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
                <button type="button" onClick={onClose} className="text-gray-500 hover:underline">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`${mode === 'add' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded`}
                >
                  {mode === 'add' ? 'Add' : 'Save Changes'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete the entry "{entry?.description}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => setShowDeleteConfirm(false)} 
                className="px-4 py-2 text-gray-700 hover:underline"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDeleteConfirm} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default EntryModal;