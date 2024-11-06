import { z } from "zod";
import Task from "./Task";
import { EpicSchema} from './schemas';

interface EpicProps {
  epic: z.infer<typeof EpicSchema> & { id: string };
  onUpdate: (epicId: string, updatedData: Partial<z.infer<typeof EpicSchema>>) => void;
  onAddTask: (epicId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

function Epic({ epic, onUpdate, onAddTask, isExpanded, onToggle }: EpicProps) {
  return (
    <div className="mb-6 p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <input
          className="text-xl font-bold w-full border-b border-transparent hover:border-gray-300 focus:border-gray-300 focus:outline-none"
          value={epic.title}
          onChange={(e) => onUpdate(epic.id, { title: e.target.value })}
        />
        <button
          onClick={onToggle}
          className="ml-2 p-1 hover:bg-gray-100 rounded"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      <textarea
        className="mb-4 text-gray-600 w-full border-b border-transparent hover:border-gray-300 focus:border-gray-300 focus:outline-none"
        value={epic.description}
        onChange={(e) => onUpdate(epic.id, { description: e.target.value })}
      />
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
            />
          ))}
          <button
            onClick={() => onAddTask(epic.id)}
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