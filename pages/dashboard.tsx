// pages/dashboard.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

type Issue = {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
};

// Global styles for body background color
export const GlobalStyles = () => (
  <style jsx global>{`
    body {
      background-color: #ffcff1;
      margin: 0;
      min-height: 100vh;
    }
  `}</style>
);

export default function Dashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<'Open' | 'In Progress' | 'Closed'>('Open');

  const [editIssueId, setEditIssueId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<'Open' | 'In Progress' | 'Closed'>('Open');

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  async function fetchIssues() {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user) {
      setError('Not logged in');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setIssues(data || []);
    }
    setLoading(false);
  }

  async function handleAddIssue() {
    setError('');
    if (!newTitle || !newDescription) {
      setError('Please fill in all fields');
      return;
    }

    const user = (await supabase.auth.getUser()).data?.user;
    if (!user) {
      setError('Not logged in');
      return;
    }

    const { error } = await supabase.from('issues').insert([
      {
        user_id: user.id,
        title: newTitle,
        description: newDescription,
        status: newStatus,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      setNewTitle('');
      setNewDescription('');
      setNewStatus('Open');
      fetchIssues();
    }
  }

  function startEdit(issue: Issue) {
    setEditIssueId(issue.id);
    setEditTitle(issue.title);
    setEditDescription(issue.description);
    setEditStatus(issue.status);
  }

  function cancelEdit() {
    setEditIssueId(null);
    setError('');
  }

  async function saveEdit() {
    setError('');
    if (!editTitle || !editDescription) {
      setError('Please fill in all fields');
      return;
    }

    const { error } = await supabase
      .from('issues')
      .update({
        title: editTitle,
        description: editDescription,
        status: editStatus,
      })
      .eq('id', editIssueId);

    if (error) {
      setError(error.message);
    } else {
      setEditIssueId(null);
      fetchIssues();
    }
  }

  async function deleteIssue(id: string) {
    const confirmed = confirm('Are you sure you want to delete this issue?');
    if (!confirmed) return;

    const { error } = await supabase.from('issues').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      fetchIssues();
    }
  }

  const statusBadge = (status: string) => {
    const colors = {
      Open: 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      Closed: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full select-none ${colors[status as keyof typeof colors]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      <GlobalStyles />
      <div className="max-w-4xl mx-auto p-6 min-h-screen" style={{ backgroundColor: '#f5cef0' }}>
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Issue Tracker</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-md shadow hover:bg-red-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </header>

        {loading ? (
          <p className="text-gray-600 text-center animate-fadeIn">Loading issues...</p>
        ) : (
          <>
            {issues.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">No issues found.</p>
            ) : (
              <ul className="space-y-6">
                {issues.map((issue) => (
                  <li
                    key={issue.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                  >
                    {editIssueId === issue.id ? (
                      <>
                        <input
                          className="border border-gray-300 p-3 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                        />
                        <textarea
                          className="border border-gray-300 p-3 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={4}
                          placeholder="Description"
                        />
                        <select
                          className="border border-gray-300 p-3 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as any)}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={saveEdit}
                            className="bg-green-600 text-white px-5 py-2 rounded-md shadow hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-3">
                          <h2 className="text-2xl font-semibold text-gray-900">{issue.title}</h2>
                          {statusBadge(issue.status)}
                        </div>
                        <p className="text-gray-700 mb-4 whitespace-pre-line">{issue.description}</p>
                        <div className="flex gap-4 justify-end">
                          <button
                            onClick={() => startEdit(issue)}
                            className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-md shadow hover:bg-yellow-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteIssue(issue.id)}
                            className="bg-red-600 text-white px-5 py-2 rounded-md shadow hover:bg-red-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <section className="mt-12 border-t border-gray-300 pt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Add New Issue</h2>
          {error && <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>}
          <div className="max-w-xl mx-auto space-y-5">
            <input
              type="text"
              placeholder="Title"
              className="border border-gray-300 p-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="border border-gray-300 p-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={5}
            />
            <select
              className="border border-gray-300 p-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <button
              onClick={handleAddIssue}
              className="bg-blue-600 text-white px-8 py-3 rounded-md shadow hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
            >
              Add Issue
            </button>
          </div>
        </section>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease forwards;
          }
        `}</style>
      </div>
    </>
  );
}
