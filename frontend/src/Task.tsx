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
  onDelete: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
}

function Task({ 
  id, 
  title, 
  description, 
  status, 
  priority, 
  onUpdate, 
  onDelete,
  isEditing,
  onEditToggle 
}: TaskProps) {
  if (isEditing) {
    return (
      <div className="border p-4 mb-4 rounded-lg">
        <input
          type="text"
          value={title}
          onChange={(e) => onUpdate(id, { title: e.target.value })}
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => onUpdate(id, { description: e.target.value })}
          className="w-full mb-2 p-2 border rounded"
        />
        <select
          value={status}
          onChange={(e) => onUpdate(id, { status: e.target.value })}
          className="p-2 border rounded mr-2"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Archived">Archived</option>
        </select>
        <select
          value={priority}
          onChange={(e) => onUpdate(id, { priority: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <button onClick={onEditToggle} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="border p-4 mb-4 rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <div className="mt-2">
        <span className="mr-2">Status: {status}</span>
        <span>Priority: {priority}</span>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={onEditToggle}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default Task