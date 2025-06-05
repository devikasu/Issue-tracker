import React from 'react';
import { motion } from 'framer-motion';
import IssueItem from './IssueItem';

type Issue = {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
};

type Props = {
  issues: Issue[];
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

export default function IssueList({
  issues,
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
  if (issues.length === 0) {
    return <p className="text-gray-500">No issues found.</p>;
  }

  return (
    <motion.ul
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {issues.map((issue) => (
        <IssueItem
          key={issue.id}
          issue={issue}
          editIssueId={editIssueId}
          editTitle={editTitle}
          editDescription={editDescription}
          editStatus={editStatus}
          setEditTitle={setEditTitle}
          setEditDescription={setEditDescription}
          setEditStatus={setEditStatus}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          deleteIssue={deleteIssue}
          statusBadge={statusBadge}
        />
      ))}
    </motion.ul>
  );
}
