import { useState } from 'react';
import axios from 'axios';
import { z } from "zod";
import Task, { TaskData } from "./Task";

// Zod schemas
const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
const StatusEnum = z.enum(["Pending", "In Progress", "Completed", "Archived"]);
const ExtractedTaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    priority: PriorityEnum,
    status: StatusEnum.optional().default("Pending"),
});
const TaskResponseSchema = z.object({
    tasks: z.array(ExtractedTaskSchema),
});

function App() {
  const [tasks, setTasks] = useState<TaskData[]>([
  ]);
  const [messages, setMessages] = useState<Array<{ text: string, sender: 'user' | 'ai' }>>([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL+"/chat";
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, sender: 'user' }]);
      setInputText('');
      axios.post(backendUrl, {
        message: inputText
      }).then((response) => {
        const parsedResponse = TaskResponseSchema.parse(response.data);
        
        // Add tasks to the tasks state
        setTasks(prevTasks => [...prevTasks, ...parsedResponse.tasks.map(task => ({
          ...task,
          id: crypto.randomUUID(),
        }))]);

        // Create message for chat
        const tasksMessage = parsedResponse.tasks
          .map(task => (
            `📌 ${task.title}\n` +
            `📝 ${task.description}\n` +
            `🎯 Priority: ${task.priority}\n`
          ))
          .join('\n');
        setMessages(prevMessages => [...prevMessages, { text: tasksMessage, sender: 'ai' }]);
      });
    }
  };

  const handleUpdateTask = (taskId: string, updatedData: Partial<TaskData>) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, ...updatedData } : task
    ));
  };

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col w-1/2 h-screen p-4 border-r">
        <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
        <div className="flex-grow overflow-y-auto">
          {tasks.map((task) => (
            <Task 
              key={task.id} 
              id={task.id}
              title={task.title} 
              description={task.description} 
              status={task.status} 
              priority={task.priority}
              onUpdate={handleUpdateTask}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col w-1/2 h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Chatbox</h1>
        <div className="flex-grow border border-gray-300 rounded-lg overflow-y-auto mb-4 p-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-2 p-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-100 ml-auto' 
                  : 'bg-gray-100'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message" 
            className="flex-grow p-2 border rounded-lg"
          />
          <button 
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App
