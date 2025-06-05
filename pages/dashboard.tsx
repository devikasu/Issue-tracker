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
      Open: 'bg-green-100 text-green-800 border border-green-500',
      'In Progress': 'bg-yellow-100 text-yellow-800 border border-yellow-500',
      Closed: 'bg-red-100 text-red-800 border border-red-500',
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
      <div className="max-w-4xl mx-auto p-6 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#a30054] transition-all duration-300 hover:scale-105">
            Issue Tracker
          </h1>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-md transition-all duration-300 ease-in-out shadow text-[#ffcff1] bg-[#a30054] hover:bg-[#80003d] hover:scale-105"
          >
            Logout
          </button>
        </header>

        {loading ? (
          <p className="text-center text-[#a30054]">Loading issues...</p>
        ) : (
          <>
            {issues.length === 0 ? (
              <p className="text-center text-lg text-[#a30054]">No issues found.</p>
            ) : (
              <ul className="space-y-6">
                {issues.map((issue) => (
                  <li
                    key={issue.id}
                    className="bg-[#ffcff1] border border-[#a30054] rounded-lg p-5 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out"
                  >
                    {editIssueId === issue.id ? (
                      <>
                        <input
                          className="border p-3 w-full mb-3 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a30054]"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                        />
                        <textarea
                          className="border p-3 w-full mb-3 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a30054]"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={4}
                          placeholder="Description"
                        />
                        <select
                          className="border p-3 w-full mb-4 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a30054]"
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
                            className="px-5 py-2 rounded-md transition-all duration-300 ease-in-out shadow text-[#ffcff1] bg-[#a30054] hover:bg-[#80003d] hover:scale-105"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-5 py-2 rounded-md transition-all duration-300 ease-in-out shadow border border-[#a30054] text-[#a30054] bg-[#ffcff1] hover:bg-[#a30054] hover:text-[#ffcff1] hover:scale-105"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-3">
                          <h2 className="text-xl font-semibold text-[#a30054]">{issue.title}</h2>
                          {statusBadge(issue.status)}
                        </div>
                        <p className="text-[#a30054] whitespace-pre-line mb-4">{issue.description}</p>
                        <div className="flex gap-4 justify-end">
                          <button
                            onClick={() => startEdit(issue)}
                            className="px-5 py-2 rounded-md transition-all duration-300 ease-in-out shadow text-[#ffcff1] bg-[#a30054] hover:bg-[#80003d] hover:scale-105"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteIssue(issue.id)}
                            className="px-5 py-2 rounded-md transition-all duration-300 ease-in-out shadow text-[#ffcff1] bg-[#a30054] hover:bg-[#80003d] hover:scale-105"
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

        <section className="mt-12 border-t pt-8 border-[#a30054]">
          <h2 className="text-3xl font-bold text-[#a30054] mb-6">Add New Issue</h2>
          {error && <p className="text-[#a30054] text-center font-semibold mb-4">{error}</p>}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="p-4 w-full rounded-md border border-[#a30054] bg-[#ffcff1] text-[#a30054] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a30054]"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="p-4 w-full rounded-md border border-[#a30054] bg-[#ffcff1] text-[#a30054] resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a30054]"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={5}
            />
            <select
              className="p-4 w-full rounded-md border border-[#a30054] bg-[#ffcff1] text-[#a30054] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a30054]"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <button
              onClick={handleAddIssue}
              className="w-full px-8 py-3 rounded-md transition-all duration-300 ease-in-out shadow text-[#ffcff1] bg-[#a30054] hover:bg-[#80003d] hover:scale-105"
            >
              Add Issue
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
