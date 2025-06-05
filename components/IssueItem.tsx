import React from 'react';
import { motion } from 'framer-motion';

type Issue = {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
};

type Props = {
  issue: Issue;
  editIssueId: string | null;
  editTitle: string;
  editDescription: string;
  editStatus: 'Open' | 'In Progress' | 'Closed';
  setEditTitle: (val: string) => void;
  setEditDescription: (val: string) => void;
  setEditStatus: (val: 'Open' | 'In Progress' | 'Closed') => void;
  startEdit: (issue: Issue) => void;
  cancelEdit: () => void;
  saveEdit: () => void;
  deleteIssue: (id: string) => void;
  statusBadge: (status: string) => React.ReactElement;
};

export default function IssueItem({
  issue,
  editIssueId,
  editTitle,
  editDescription,
  editStatus,
  setEditTitle,
  setEditDescription,
  setEditStatus,
  startEdit,
  cancelEdit,
  saveEdit,
  deleteIssue,
  statusBadge,
}: Props) {
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, boxShadow: '0px 4px 16px rgba(0,0,0,0.1)' }}
      className="bg-white border rounded p-4 shadow-sm transition-all"
    >
      {editIssueId === issue.id ? (
        <>
          <input
            className="border p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            className="border p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
          />
          <select
            className="border p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={editStatus}
            onChange={(e) =>
              setEditStatus(e.target.value as 'Open' | 'In Progress' | 'Closed')
            }
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={saveEdit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Save
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={cancelEdit}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </motion.button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold">{issue.title}</h2>
            {statusBadge(issue.status)}
          </div>
          <p className="text-gray-700 mb-2">{issue.description}</p>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              onClick={() => startEdit(issue)}
              className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500 transition"
            >
              Edit
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              onClick={() => deleteIssue(issue.id)}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
            >
              Delete
            </motion.button>
          </div>
        </>
      )}
    </motion.li>
  );
}
