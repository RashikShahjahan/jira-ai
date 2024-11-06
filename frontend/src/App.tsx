import { useState } from 'react';
import axios from 'axios';
import { z } from "zod";
import Epic from "./Epic";
import { EpicSchema, EpicResponseSchema } from './schemas';



function App() {
  const [state, setState] = useState({
    epics: [] as (z.infer<typeof EpicSchema> & { id: string })[],
    messages: [] as Array<{ text: string, sender: 'user' | 'ai' }>,
    inputText: '',
    expandedEpics: new Set<string>()
  });

  const handleSendMessage = () => {
    if (!state.inputText.trim()) return;

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, 
        { text: state.inputText, sender: 'user' },
        { text: "Thinking...", sender: 'ai' }
      ],
      inputText: ''
    }));

    axios.post(import.meta.env.VITE_BACKEND_URL + "/chat", {
      message: state.inputText
    }).then((response) => {
      const parsedResponse = EpicResponseSchema.parse(response.data);
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages.slice(0, -1), { 
          text: formatEpicsMessage(parsedResponse.epics), 
          sender: 'ai' 
        }],
        epics: [...prev.epics, ...parsedResponse.epics.map(addIds)]
      }));
    });
  };

  // Helper functions
  const addIds = (epic: z.infer<typeof EpicSchema>) => ({
    ...epic,
    id: crypto.randomUUID(),
    tasks: epic.tasks.map(task => ({
      ...task,
      id: crypto.randomUUID(),
    }))
  });

  const formatEpicsMessage = (epics: z.infer<typeof EpicSchema>[]) => {
    return epics.map(epic => (
      `Epic: ${epic.title}\n` +
      `Description: ${epic.description}\n` +
      `Tasks:\n` +
      epic.tasks.map(task => (
        `  • ${task.title} (${task.priority})\n` +
        `    ${task.description}`
      )).join('\n')
    )).join('\n\n');
  };

  const handleUpdateEpic = (epicId: string, updatedData: Partial<z.infer<typeof EpicSchema>>) => {
    setState(prev => ({
      ...prev,
      epics: prev.epics.map(epic => 
        epic.id === epicId ? Epic.update(epic, updatedData) : epic
      )
    }));
  };

  const toggleEpic = (epicId: string) => {
    setState(prev => ({
      ...prev,
      expandedEpics: Epic.toggle(prev.expandedEpics, epicId)
    }));
  };

  const handleSaveEpic = async (epicId: string) => {
    const epic = state.epics.find(e => e.id === epicId);
    if (!epic) return;
    console.log('Saving epic:', epic);
  };

  const handleDeleteEpic = (epicId: string) => {
    setState(prev => ({
      ...prev,
      epics: prev.epics.filter(epic => epic.id !== epicId)
    }));
  };

  const handleDeleteTask = (epicId: string, taskId: string) => {
    setState(prev => ({
      ...prev,
      epics: prev.epics.map(epic => 
        epic.id === epicId 
          ? { ...epic, tasks: epic.tasks.filter(task => task.id !== taskId) }
          : epic
      )
    }));
  };

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col w-1/2 h-screen p-4 border-r">
        <h1 className="text-2xl font-bold mb-4">Epic Manager</h1>
        <div className="flex-grow overflow-y-auto">
          {state.epics.map((epic) => (
            <Epic
              key={epic.id}
              epic={epic}
              onUpdate={handleUpdateEpic}
              onSave={handleSaveEpic}
              onDelete={() => handleDeleteEpic(epic.id)}
              isExpanded={state.expandedEpics.has(epic.id)}
              onToggle={() => toggleEpic(epic.id)}
              onDeleteTask={(taskId) => handleDeleteTask(epic.id, taskId)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col w-1/2 h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Chatbox</h1>
        <div className="flex-grow border border-gray-300 rounded-lg overflow-y-auto mb-4 p-4">
          {state.messages.map((message, index) => (
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
            value={state.inputText}
            onChange={(e) => setState(prev => ({ ...prev, inputText: e.target.value }))}
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
