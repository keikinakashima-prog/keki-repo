"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ← これがポイント！
import Image from "next/image";

export default function Home() {
  const [count, setCount] = useState(0);
  const router = useRouter(); // ← ルーターを使えるようにする！

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => setCount(count - 1);
  const handleReset = () => setCount(0);
  const goToPage1 = () => router.push("/page1/app"); // ← ページ移動関数！
    const goToPage2 = () => router.push("/page2/app"); // ← ページ移動関数！
    const goToPage3 = () => router.push("/page3/app"); // ← ページ移動関数！
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">感謝しています先生</li>
          <li className="tracking-[-.01em]">尊敬しています先生</li>
        </ol>

        <div className="text-xl font-bold">カウント: {count}</div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleIncrement}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ＋1
          </button>
          <button
            onClick={handleDecrement}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            −1
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            リセット
          </button>
          <button
            onClick={goToPage1}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Page1へ移動</button>
          <button
            onClick={goToPage2}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Page2へ移動
            
          </button>
          <button
            onClick={goToPage3}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Page3へ移動
          </button>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
