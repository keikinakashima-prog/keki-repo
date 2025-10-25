// ...existing code...
'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Op = "+" | "-" | "×" | "÷";

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(): { a: number; b: number; op: Op; answer: number } {
    const ops: Op[] = ["+", "-", "×", "÷"];
    const op = ops[randInt(0, ops.length - 1)];
    let a = 0;
    let b = 1;
    let answer = 0;

    if (op === "+") {
        a = randInt(0, 50);
        b = randInt(0, 50);
        answer = a + b;
    } else if (op === "-") {
        a = randInt(0, 50);
        b = randInt(0, a); // 結果を非負に
        answer = a - b;
    } else if (op === "×") {
        a = randInt(0, 12);
        b = randInt(0, 12);
        answer = a * b;
    } else {
        // ÷ は割り切れるように作る
        b = randInt(1, 12);
        answer = randInt(0, 12);
        a = b * answer;
    }

    return { a, b, op, answer };
}

export default function Page(): JSX.Element {
    const [problem, setProblem] = useState(() => generateProblem());
    const [input, setInput] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);

    // タイムアタック関連（有無切替対応）
    const [isTimed, setIsTimed] = useState(false);
    const [timeLimit, setTimeLimit] = useState(60); // 秒
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [problem]);

    // isTimed がオンになったときに timeLeft をセット
    useEffect(() => {
        if (isTimed) {
            setTimeLeft(timeLimit);
        } else {
            setTimeLeft(null);
        }
    }, [isTimed, timeLimit]);

    // タイマー処理（isTimed 時のみ）
    useEffect(() => {
        if (!isTimed) return;
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            // 時間切れ時の処理（入力無効化は UI 側で行う）
            return;
        }
        timerRef.current = window.setInterval(() => {
            setTimeLeft((t) => (t !== null ? t - 1 : t));
        }, 1000);
        return () => {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isTimed, timeLeft]);

    function nextProblem(correct?: boolean) {
        if (correct) setScore((s) => s + 1);
        setTotal((t) => t + 1);
        setProblem(generateProblem());
        setInput("");
        inputRef.current?.focus();
    }

    function checkAnswer() {
        if (isTimed && (timeLeft === null || timeLeft <= 0)) return;
        const user = Number(input);
        if (Number.isNaN(user)) {
            setMessage("数値で答えてください。");
            return;
        }
        const correct = Math.abs(user - problem.answer) < 1e-9;
        if (correct) {
            setMessage("正解！🎉");
        } else {
            setMessage(`不正解。正しい答えは ${problem.answer} です。`);
        }
        nextProblem(correct);
    }

    function restart() {
        setScore(0);
        setTotal(0);
        setProblem(generateProblem());
        setInput("");
        setMessage(null);
        if (isTimed) {
            setTimeLeft(timeLimit);
        } else {
            setTimeLeft(null);
        }
        inputRef.current?.focus();
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                margin: 0,
                padding: "2rem",
                backgroundColor: "#0d9f00ff", // 緑色
                color: "#012a4a",
                boxSizing: "border-box",
                fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            }}
        >
            <h1>計算ゲーム</h1>

            <div style={{ marginBottom: "1rem" }}>
                <label style={{ marginRight: 12 }}>
                    <input
                        type="checkbox"
                        checked={isTimed}
                        onChange={(e) => setIsTimed(e.target.checked)}
                    />{" "}
                    タイムアタックを有効にする
                </label>

                {isTimed && (
                    <label style={{ marginLeft: 8 }}>
                        秒数:
                        <input
                            type="number"
                            min={5}
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Math.max(5, Number(e.target.value || 0)))}
                            style={{ width: 70, marginLeft: 8 }}
                        />
                    </label>
                )}

                {isTimed && (
                    <span style={{ marginLeft: 16 }}>
                        残り時間: <strong>{timeLeft ?? timeLimit}s</strong>
                    </span>
                )}

                {!isTimed && <p style={{ margin: "0.5rem 0 0 0" }}>制限時間なしで遊べます。</p>}
            </div>

            <div
                style={{
                    background: "rgba(255,255,255,0.9)",
                    padding: "1rem",
                    borderRadius: 8,
                    display: "inline-block",
                    minWidth: 320,
                }}
            >
                <p style={{ fontSize: 20, margin: "0 0 0.5rem 0" }}>
                    問題: <strong>{problem.a} {problem.op} {problem.b} = ?</strong>
                </p>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                        ref={inputRef}
                        type="number"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") checkAnswer();
                        }}
                        style={{
                            padding: "0.5rem",
                            fontSize: "1rem",
                            flex: 1,
                            borderRadius: 4,
                            border: "1px solid #ccc",
                        }}
                        disabled={isTimed && (timeLeft ?? 0) <= 0}
                    />
                    <button
                        onClick={checkAnswer}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#023e8a",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                        disabled={isTimed && (timeLeft ?? 0) <= 0}
                    >
                        回答
                    </button>
                </div>

                {message && <p style={{ marginTop: "0.5rem" }}>{message}</p>}

                <p style={{ marginTop: "0.5rem" }}>
                    スコア: <strong>{score}</strong> / {total}
                </p>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button
                        onClick={restart}
                        style={{
                            padding: "0.4rem 0.8rem",
                            backgroundColor: "#012a4a",
                            color: "#bfefff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                    >
                        リスタート
                    </button>

                    <button
                        onClick={() => {
                            setProblem(generateProblem());
                            setInput("");
                            setMessage(null);
                            inputRef.current?.focus();
                        }}
                        style={{
                            padding: "0.4rem 0.8rem",
                            backgroundColor: "#6c757d",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                    >
                        次の問題
                    </button>
                </div>
            </div>

            <p style={{ marginTop: "1.5rem" }}>
                <Link
                    href="/page1"
                    style={{
                        display: "inline-block",
                        padding: "0.5rem 1rem",
                        backgroundColor: "#023e8a",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "4px",
                    }}
                >
                    戻る
                </Link>
            </p>
            
        </main>
    );
}
// ...existing code...