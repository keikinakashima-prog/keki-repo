'use client';

import React, { useEffect, useState } from 'react';

type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

const PHOTOS_PER_GROUP = 40;

export default function PhotosGallery({ limit = 64 }: { limit?: number }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data: Photo[]) => {
        if (!mounted) return;
        setPhotos(data.slice(0, limit));
        setCurrentPage(0);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Error fetching photos');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [limit]);

  if (loading) return <div className="mb-4 text-sm text-gray-600">Loading photos...</div>;
  if (error) return <div className="mb-4 text-sm text-red-600">Error: {error}</div>;

  const startIdx = currentPage * PHOTOS_PER_GROUP;
  const endIdx = startIdx + PHOTOS_PER_GROUP;
  const currentPhotos = photos.slice(startIdx, endIdx);
  const totalPages = Math.ceil(photos.length / PHOTOS_PER_GROUP);

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Photos (64分割 - 1まとまり40枚)</h2>
      <div className="grid grid-cols-8 gap-1 mb-4">
        {currentPhotos.map((p) => (
          <div key={p.id} className="bg-white rounded overflow-hidden shadow-sm aspect-square">
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
            </a>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
        >
          前へ
        </button>
        <span className="text-sm text-gray-700">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
