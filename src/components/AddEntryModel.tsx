'use client';

import { Dialog } from '@headlessui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const AddEntryModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const formik = useFormik({
    initialValues: {
      type: 'Earning',
      description: '',
      category: '',
      amount: '',
      date: '',
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

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Entry</h2>
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
            <button type="button" onClick={onClose} className="text-gray-500 hover:underline">Cancel</button>
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Add</button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default AddEntryModal;
