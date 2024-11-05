import { useState } from 'react';

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Archived";
  priority: "LOW" | "MEDIUM" | "HIGH";
}

interface TaskProps extends TaskData {
  onUpdate: (taskId: string, updatedData: Partial<TaskData>) => void;
}

function Task({ id, title, description, status, priority, onUpdate }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedPriority, setEditedPriority] = useState(priority);

  const handleSave = () => {
    onUpdate(id, {
      title: editedTitle,
      description: editedDescription,
      status: editedStatus,
      priority: editedPriority,
    });
    setIsEditing(false);
  };

  return (
    <div className="border p-4 mb-4 rounded-lg">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <div className="flex gap-4 mb-2">
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600">{description}</p>
          <div className="mt-2">
            <span className="mr-2">Status: {status}</span>
            <span>Priority: {priority}</span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}

export default Task