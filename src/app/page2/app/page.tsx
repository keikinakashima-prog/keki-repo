// ...existing code...
import React from "react";

export default function Page(): JSX.Element {
    return (
        <main
            style={{
                minHeight: "100vh",
                margin: 0,
                padding: "2rem",
                backgroundColor: "#0d9f00ff", // 緑色
                color: "#012a4a",
                boxSizing: "border-box",
            }}
        >
            <h1>緑の背景</h1>
            <p>このページは緑の背景で表示されます。</p>

            


            <p>
                <a
                    href="https://broken-mausoleum-5vvrjq4wrq9cp76w-3000.app.github.dev/"
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
                </a>
            </p>
        </main>
    );
}
// ...existing code...