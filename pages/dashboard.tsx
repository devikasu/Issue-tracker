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
      Open: 'bg-green-100 text-green-700',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      Closed: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Issue Tracker</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading issues...</p>
      ) : (
        <ul className="space-y-4">
          {issues.length === 0 && <p className="text-gray-500">No issues found.</p>}
          {issues.map(issue => (
            <li key={issue.id} className="bg-white border rounded p-4 shadow-sm">
              {editIssueId === issue.id ? (
                <>
                  <input
                    className="border p-2 w-full mb-2 rounded"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="border p-2 w-full mb-2 rounded"
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    rows={3}
                  />
                  <select
                    className="border p-2 w-full mb-2 rounded"
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
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
                      className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteIssue(issue.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
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

      <div className="mt-10 border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Issue</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="border p-3 w-full rounded"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="border p-3 w-full rounded"
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
            rows={4}
          />
          <select
            className="border p-3 w-full rounded"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value as any)}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <button
            onClick={handleAddIssue}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Issue
          </button>
        </div>
      </div>
    </div>
  );
}