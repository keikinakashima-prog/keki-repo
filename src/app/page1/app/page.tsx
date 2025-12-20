"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    const goBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={{ marginTop: 0, fontSize: 48, fontWeight: "bold" }}>404</h1>
                <h2 style={{ marginTop: 8 }}>ページが見つかりません</h2>
                <p style={{ color: "#666", marginBottom: 24 }}>申し訳ございませんが、ご指定のページは見つかりませんでした。</p>
                <div style={styles.btnRow}>
                    <button style={styles.button} onClick={goBack}>
                        ← 戻る
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "#f5f7fb",
    },
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "#fff5f5",
    },
    card: {
        width: 480,
        maxWidth: "95%",
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        background: "#fff",
    },
    btnRow: {
        marginTop: 16,
        display: "flex",
        alignItems: "center",
    },
    button: {
        padding: "8px 14px",
        borderRadius: 6,
        border: "1px solid #ddd",
        background: "#fff",
        cursor: "pointer",
    },
};