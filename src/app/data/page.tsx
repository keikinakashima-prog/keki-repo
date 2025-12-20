import fs from 'fs';
import path from 'path';
import React from 'react';

export default function DataPage() {
    const filePath = path.resolve(process.cwd(), 'data.csv');
    let content = '';
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        content = '';
    }

    const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
    const looksLikeCsv = lines.length > 0 && lines.some((l) => l.includes(','));

    if (looksLikeCsv) {
        const rows = lines.map((l) => l.split(','));
        const header = rows[0] ?? [];
        const body = rows.slice(1);
        return (
            <div style={{ padding: 24 }}>
                <h1>data.csv - Table view</h1>
                <div style={{ overflowX: 'auto', marginTop: 12 }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                {header.map((h, i) => (
                                    <th key={i} style={{ border: '1px solid #ddd', padding: 8, textAlign: 'left', background: '#f6f6f6' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {body.map((r, ri) => (
                                <tr key={ri}>
                                    {r.map((c, ci) => (
                                        <td key={ci} style={{ border: '1px solid #eee', padding: 8 }}>{c}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <h1>data.csv - Raw content</h1>
            <p style={{ color: '#666' }}>このファイルはCSV形式に見えません。生データを表示します。</p>
            <pre style={{ whiteSpace: 'pre-wrap', background: '#111', color: '#eee', padding: 12, borderRadius: 6 }}>{content || '(ファイルが空か存在しません)'}</pre>
        </div>
    );
}






































































































