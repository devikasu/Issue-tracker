import React from 'react';
import { motion } from 'framer-motion';

type Props = {
  newTitle: string;
  setNewTitle: (val: string) => void;
  newDescription: string;
  setNewDescription: (val: string) => void;
  newStatus: 'Open' | 'In Progress' | 'Closed';
  setNewStatus: (val: 'Open' | 'In Progress' | 'Closed') => void;
  handleAddIssue: () => void;
  error: string;
};

export default function NewIssueForm({
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newStatus,
  setNewStatus,
  handleAddIssue,
  error,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-10 border-t pt-6"
    >
      <h2 className="text-2xl font-semibold mb-4">Add New Issue</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          rows={4}
        />
        <select
          className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as any)}
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(59,130,246,0.6)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddIssue}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Issue
        </motion.button>
      </div>
    </motion.div>
  );
}
