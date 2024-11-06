import { useState } from 'react';
import axios from 'axios';
import { z } from "zod";
import Task from "./Task";

// Updated Zod schemas
const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
const StatusEnum = z.enum(["Pending", "In Progress", "Completed", "Archived"]);
const TaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    priority: PriorityEnum,
    status: StatusEnum.optional().default("Pending"),
});
const EpicSchema = z.object({
    title: z.string(),
    description: z.string(),
    tasks: z.array(TaskSchema),
    status: StatusEnum.optional().default("Pending"),
});
const EpicResponseSchema = z.object({
    epics: z.array(EpicSchema),
});

function App() {
  const [epics, setEpics] = useState<(z.infer<typeof EpicSchema> & { id: string })[]>([]);
  const [messages, setMessages] = useState<Array<{ text: string, sender: 'user' | 'ai' }>>([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL+"/chat";
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, sender: 'user' }]);
      setInputText('');
      
      // Add loading state
      setMessages(prevMessages => [...prevMessages, { text: "Thinking...", sender: 'ai' }]);
      
      axios.post(backendUrl, {
        message: inputText
      }).then((response) => {
        const parsedResponse = EpicResponseSchema.parse(response.data);
        
        // Remove loading message
        setMessages(prevMessages => prevMessages.slice(0, -1));
        
        setEpics(prevEpics => [...prevEpics, ...parsedResponse.epics.map(epic => ({
          ...epic,
          id: crypto.randomUUID(),
          tasks: epic.tasks.map(task => ({
            ...task,
            id: crypto.randomUUID(),
          }))
        }))]);

        const epicsMessage = parsedResponse.epics
          .map(epic => (
            `📊 Epic: ${epic.title}\n` +
            `📝 ${epic.description}\n` +
            `Tasks:\n` +
            epic.tasks.map(task => (
              `  • ${task.title} (${task.priority})\n` +
              `    ${task.description}`
            )).join('\n')
          ))
          .join('\n\n');
        setMessages(prevMessages => [...prevMessages, { text: epicsMessage, sender: 'ai' }]);
      });
    }
  };

  const handleUpdateEpic = (epicId: string, updatedData: Partial<z.infer<typeof EpicSchema>>) => {
    setEpics(prevEpics => prevEpics.map(epic => 
      epic.id === epicId ? { ...epic, ...updatedData } : epic
    ));
  };

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col w-1/2 h-screen p-4 border-r">
        <h1 className="text-2xl font-bold mb-4">Epic Manager</h1>
        <div className="flex-grow overflow-y-auto">
          {epics.map((epic) => (
            <div key={epic.id} className="mb-6 p-4 border rounded-lg">
              <h2 className="text-xl font-bold mb-2">{epic.title}</h2>
              <p className="mb-4 text-gray-600">{epic.description}</p>
              <div className="space-y-2">
                {epic.tasks.map((task) => (
                  <Task 
                    key={task.id} 
                    {...task}
                    onUpdate={(taskId, updates) => {
                      handleUpdateEpic(epic.id, {
                        tasks: epic.tasks.map(t => 
                          t.id === taskId ? { ...t, ...updates } : t
                        )
                      });
                    }}
                  />
                ))}
              </div>
            </div>
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
