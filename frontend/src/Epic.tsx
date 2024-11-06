import { z } from "zod";
import Task, { TaskData } from "./Task";
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
  const [editState, setEditState] = useState({
    isEditing: false,
    isEdited: false,
    isSaving: false,
    editedTitle: epic.title,
    editedDescription: epic.description
  });

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!onSave) return;
    
    setEditState(prev => ({ ...prev, isSaving: true }));
    try {
      await onSave(epic.id);
      setEditState(prev => ({ 
        ...prev, 
        isEditing: false, 
        isEdited: false, 
        isSaving: false 
      }));
    } finally {
      setEditState(prev => ({ ...prev, isSaving: false }));
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<TaskData>) => {
    onUpdate(epic.id, {
      tasks: epic.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
    });
  };

  const handleAddTask = () => {
    onUpdate(epic.id, {
      tasks: [...epic.tasks, Epic.createTask()]
    });
  };

  const handleDone = () => {
    onUpdate(epic.id, {
      title: editState.editedTitle,
      description: editState.editedDescription
    });
    setEditState(prev => ({ 
      ...prev, 
      isEditing: false, 
      isEdited: false 
    }));
  };

  return (
    <div className="mb-6 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        {editState.isEditing ? (
          <input
            className="text-xl font-bold w-full border-b border-gray-300 focus:outline-none"
            value={editState.editedTitle}
            onChange={(e) => setEditState({ ...editState, editedTitle: e.target.value })}
            autoFocus
          />
        ) : (
          <div className="text-xl font-bold">
            {epic.title}
          </div>
        )}
        <div className="flex items-center gap-2">
          {!editState.isEditing && (
            <>
              <button
                onClick={() => setEditState({ ...editState, isEditing: true })}
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
          {editState.isEditing && (
            <>
              <button
                onClick={handleDone}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Done
              </button>
              <button
                onClick={() => {
                  setEditState({ 
                    ...editState, 
                    isEditing: false, 
                    editedTitle: epic.title,
                    editedDescription: epic.description 
                  });
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>
      {editState.isEditing ? (
        <textarea
          className="mb-4 text-gray-600 w-full border rounded p-2 focus:outline-none"
          value={editState.editedDescription}
          onChange={(e) => setEditState({ ...editState, editedDescription: e.target.value })}
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
              onUpdate={(taskId, updates) => handleTaskUpdate(taskId, updates)}
              onDelete={() => onDeleteTask(task.id)}
              isEditing={editingTaskId === task.id}
              onEditToggle={() => setEditingTaskId(
                editingTaskId === task.id ? null : task.id
              )}
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