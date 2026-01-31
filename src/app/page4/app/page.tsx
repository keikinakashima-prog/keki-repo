'use client';

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
// PhotosGallery is available as a separate component but we only fetch on demand

export default function Page4() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [useUsers, setUseUsers] = useState(false);
  const [lang, setLang] = useState<'ja' | 'en'>('ja');

  const translations: Record<string, Record<string, string>> = {
    ja: {
      title: 'AIチャット',
      useWebSearch: 'ウェブ検索を使用',
      useUsers: 'ユーザーデータを使用',
      placeholder: 'メッセージを入力...',
      send: '送信',
      error: '申し訳ありません。エラーが発生しました。',
    },
    en: {
      title: 'AI Chat',
      useWebSearch: 'Use web search',
      useUsers: 'Use user data',
      placeholder: 'Type your message...',
      send: 'Send',
      error: 'Sorry, an error occurred.',
      markBy: 'Mark: KOTONOHA WORKS',
    },
  };

  const t = translations[lang];

  type Photo = { id: number; url: string; thumbnailUrl: string; title: string; };

  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [photosAll, setPhotosAll] = useState<Photo[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 40;

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
      const errorMessage = { role: 'assistant', content: t.error };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const renderContent = (content: string) => {
    // try JSON
    try {
      const obj: unknown = JSON.parse(content);
      if (
        obj &&
        typeof obj === 'object' &&
        'photos' in obj &&
        Array.isArray((obj as { photos: unknown }).photos)
      ) {
        const photos = (obj as { photos: Photo[] }).photos;
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {photos.map((p: Photo) => (
              <div key={p.id} className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="block">
                  <Image src={p.thumbnailUrl} alt={p.title} width={100} height={96} className="w-full h-24 object-cover transition-transform duration-200 hover:scale-105" />
                </a>
                <div className="p-2 text-xs">{p.title}</div>
              </div>
            ))}
          </div>
        );
      }

      return (
        <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(obj, null, 2)}
        </pre>
      );
    } catch {
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-700 drop-shadow-sm">{t.title}</h1>
          <div className="flex items-center">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'ja' | 'en')}
              className="border rounded-md p-1 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
            <a
              href="https://kotonohaworks.com/free-icons/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 ml-3 opacity-80 hover:opacity-100 transition"
            >
              {t.markBy}
            </a>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="webSearch"
              checked={useWebSearch}
              onChange={(e) => setUseWebSearch(e.target.checked)}
              className="mr-2 accent-blue-600"
            />
            <label htmlFor="webSearch" className="text-sm">{t.useWebSearch}</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useUsers"
              checked={useUsers}
              onChange={(e) => setUseUsers(e.target.checked)}
              className="mr-2 accent-blue-600"
            />
            <label htmlFor="useUsers" className="text-sm">{t.useUsers}</label>
          </div>
        </div>
        <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-white/60 backdrop-blur-sm">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block max-w-[80%] p-3 rounded-lg shadow-sm transition-all ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none' : 'bg-white text-gray-800 border rounded-tl-none'}`}>
                {renderContent(msg.content)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 border border-gray-300 rounded-l-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder={t.placeholder}
          />
          <button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-r-md transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {t.send}
          </button>
          <button
            onClick={async () => {
              if (loadingPhotos) return;
              setLoadingPhotos(true);
              try {
                const res = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=5000');
                if (!res.ok) throw new Error('Fetch failed');
                const data = await res.json();
                setPhotosAll(data);
              } catch (err) {
                console.error('Photos fetch failed', err);
                setPhotosAll(null);
                const errorMessage = { role: 'assistant', content: t.error };
                setMessages(prev => [...prev, errorMessage]);
              } finally {
                setLoadingPhotos(false);
              }
            }}
            className="bg-white border border-gray-200 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-50 transition shadow-sm"
          >
            {loadingPhotos ? '...' : lang === 'ja' ? '写真を表示' : 'Show photos'}
          </button>
        </div>
        {photosAll && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">All Photos</h2>
            <div className="text-center mb-2">
              <div className="text-2xl font-bold">Photos</div>
              <div className="mt-1">
                {(() => {
                  const total = Math.ceil(photosAll.length / photosPerPage);
                  const buttons: React.ReactNode[] = [];
                  for (let i = 1; i <= total; i++) {
                    buttons.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`mx-1 px-2 py-1 text-xs rounded-md ${currentPage === i ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return <div className="inline-block">{buttons}</div>;
                })()}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {photosAll.slice((currentPage - 1) * photosPerPage, currentPage * photosPerPage).map((p: Photo) => (
                <div key={p.id} className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="block">
                    <Image src={p.thumbnailUrl} alt={p.title} width={100} height={96} className="w-full h-24 object-cover transition-transform duration-200 hover:scale-105" />
                  </a>
                  <div className="p-2 text-xs">{p.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}