import React from 'react';

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
    <li className="bg-white border rounded p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
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
            <button
              onClick={saveEdit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-transform transform hover:scale-105"
            >
              Cancel
            </button>
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
            <button
              onClick={() => startEdit(issue)}
              className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500 transition-transform transform hover:scale-105"
            >
              Edit
            </button>
            <button
              onClick={() => deleteIssue(issue.id)}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-transform transform hover:scale-105"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
