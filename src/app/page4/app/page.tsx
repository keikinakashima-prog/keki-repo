'use client';

import { useState } from 'react';

export default function Page4() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [useUsers, setUseUsers] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          useWebSearch,
          useUsers,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, an error occurred.' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const renderContent = (content: string) => {
    // try JSON
    try {
      const obj = JSON.parse(content);
      return (
        <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(obj, null, 2)}
        </pre>
      );
    } catch (e) {
      // not JSON
    }

    // simple CSV detection: multiple lines and commas
    if (content.includes('\n') && content.includes(',')) {
      const rows = content.trim().split('\n').map((r) => r.split(','));
      return (
        <div className="overflow-auto">
          <table className="min-w-full table-fixed border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {rows[0].map((h, i) => (
                  <th key={i} className="text-left px-2 py-1 border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, ri) => (
                <tr key={ri} className="even:bg-white odd:bg-gray-50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-2 py-1 border text-sm">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // plain text (preserve line breaks)
    return <div className="whitespace-pre-wrap text-sm">{content}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">AI Chat</h1>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="webSearch"
              checked={useWebSearch}
              onChange={(e) => setUseWebSearch(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="webSearch" className="text-sm">Use web search</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useUsers"
              checked={useUsers}
              onChange={(e) => setUseUsers(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="useUsers" className="text-sm">Use user data</label>
          </div>
        </div>
        <div className="h-96 overflow-y-auto border border-gray-300 rounded p-4 mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block max-w-[80%] p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-black border'}`}>
                {renderContent(msg.content)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 border border-gray-300 rounded-l p-2"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
