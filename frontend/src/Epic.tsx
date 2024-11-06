import { z } from "zod";
import Task from "./Task";
import { EpicSchema} from './schemas';
import { useState } from "react";

interface EpicProps {
  epic: z.infer<typeof EpicSchema> & { id: string };
  onUpdate: (epicId: string, updatedData: Partial<z.infer<typeof EpicSchema>>) => void;
  onSave?: (epicId: string) => Promise<void>;
  onDelete: (epicId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  onDeleteTask: (taskId: string) => void;
}

// New static methods
Epic.createTask = () => {
  return {
    id: crypto.randomUUID(),
    title: "New Task",
    description: "Task description",
    priority: "MEDIUM" as const,
    status: "Pending" as const
  };
};

Epic.addTask = (epic: z.infer<typeof EpicSchema> & { id: string }) => {
  return {
    ...epic,
    tasks: [...epic.tasks, Epic.createTask()]
  };
};

Epic.update = (epic: z.infer<typeof EpicSchema> & { id: string }, updatedData: Partial<z.infer<typeof EpicSchema>>) => {
  return { ...epic, ...updatedData };
};

// Add static method for toggle functionality
Epic.toggle = (expandedEpics: Set<string>, epicId: string): Set<string> => {
  const next = new Set(expandedEpics);
  if (next.has(epicId)) {
    next.delete(epicId);
  } else {
    next.add(epicId);
  }
  return next;
};

function Epic({ epic, onUpdate, onSave, onDelete, isExpanded, onToggle, onDeleteTask }: EpicProps) {
  const [isEdited, setIsEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updates: Partial<z.infer<typeof EpicSchema>>) => {
    setIsEdited(true);
    onUpdate(epic.id, updates);
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave(epic.id);
        setIsEdited(false);
        setIsEditing(false);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddTask = () => {
    onUpdate(epic.id, {
      tasks: [...epic.tasks, Epic.createTask()]
    });
  };

  return (
    <div className="mb-6 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          <input
            className="text-xl font-bold w-full border-b border-gray-300 focus:outline-none"
            value={epic.title}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            autoFocus
          />
        ) : (
          <div className="text-xl font-bold">
            {epic.title}
          </div>
        )}
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(epic.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </>
          )}
          {isEdited && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          )}
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setIsEdited(false);
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>
      {isEditing ? (
        <textarea
          className="mb-4 text-gray-600 w-full border rounded p-2 focus:outline-none"
          value={epic.description}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          rows={3}
        />
      ) : (
        <div className="mb-4 text-gray-600">
          {epic.description}
        </div>
      )}
      {isExpanded && (
        <div className="space-y-2">
          {epic.tasks.map((task) => (
            <Task 
              key={task.id} 
              {...task}
              onUpdate={(taskId, updates) => {
                onUpdate(epic.id, {
                  tasks: epic.tasks.map(t => 
                    t.id === taskId ? { ...t, ...updates } : t
                  )
                });
              }}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
          <button
            onClick={handleAddTask}
            className="w-full p-2 mt-2 text-gray-600 border border-dashed rounded-lg hover:bg-gray-50"
          >
            + Add Task
          </button>
        </div>
      )}
    </div>
  );
}

export default Epic; 