import { useState } from 'react';

function Chatbox() {
    const [messages, setMessages] = useState<Array<{ text: string, sender: 'user' | 'ai' }>>([]);
    const [inputText, setInputText] = useState('');

    return (
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
                    onClick={() => {
                        if (inputText.trim()) {
                            setMessages([...messages, { text: inputText, sender: 'user' }]);
                            setInputText('');
                        }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chatbox