function isJapanese(text: string): boolean {
    const japaneseRegex = /[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FFF]/g;
    return japaneseRegex.test(text);
}

function isGreeting(text: string): boolean {
    const greetings = ['hello!', 'hi!', 'こんにちは', 'おはよう', 'hello', 'hi'];
    const normalizedText = text.toLowerCase().trim();
    return greetings.includes(normalizedText);
}

function containsTimeDateWeatherKeywords(text: string): boolean {
    const keywords = ['時間', '日付', '天気', 'time', 'date', 'weather', 'now', 'today', 'current', '明日', '昨日', 'tomorrow', 'yesterday'];
    const lowerText = text.toLowerCase();
    return keywords.some(keyword => lowerText.includes(keyword));
}

function getCurrentInfo(text: string): string {
    const now = new Date();
    const lowerText = text.toLowerCase();
    let response = '';

    if (lowerText.includes('時間') || lowerText.includes('time') || lowerText.includes('now')) {
        const time = now.toLocaleTimeString('en-US');
        response += `Current time: ${time}\n`;
    }

    if (lowerText.includes('日付') || lowerText.includes('date') || lowerText.includes('today') || lowerText.includes('明日') || lowerText.includes('tomorrow') || lowerText.includes('昨日') || lowerText.includes('yesterday')) {
        let targetDate = now;
        if (lowerText.includes('明日') || lowerText.includes('tomorrow')) {
            targetDate = new Date(now);
            targetDate.setDate(now.getDate() + 1);
        } else if (lowerText.includes('昨日') || lowerText.includes('yesterday')) {
            targetDate = new Date(now);
            targetDate.setDate(now.getDate() - 1);
        }
        const date = targetDate.toLocaleDateString('en-US');
        const dateLabel = lowerText.includes('明日') || lowerText.includes('tomorrow') ? 'Tomorrow\'s date' : 
                         lowerText.includes('昨日') || lowerText.includes('yesterday') ? 'Yesterday\'s date' : 'Current date';
        response += `${dateLabel}: ${date}\n`;
    }

    if (lowerText.includes('天気') || lowerText.includes('weather')) {
        response += `Weather: Sunny (demo)\n`;
    }

    return response.trim() || 'Current information: No matching information found.';
}

async function callOpenAI(message: string) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant. Reply in English and keep responses concise.' },
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
            }),
        });

        if (!res.ok) {
            console.error('OpenAI returned', res.status);
            return null;
        }

        const data = await res.json();
        return data.choices?.[0]?.message?.content || null;
    } catch (e) {
        console.error('OpenAI call error:', e);
        return null;
    }
}

async function callGoogle(query: string) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    if (!apiKey || !cx) return null;

    try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(query)}&num=3`;
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) {
            console.error('Google CSE returned', res.status);
            return null;
        }
        const data = await res.json();
        const items = data.items || [];
        return items.map((it: any) => ({ title: it.title, snippet: it.snippet, link: it.link }));
    } catch (e) {
        console.error('Google call error:', e);
        return null;
    }
}

async function callJsonPlaceholderUsers() {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) {
            console.error('JSONPlaceholder returned', res.status);
            return null;
        }
        const users = await res.json();
        return users;
    } catch (e) {
        console.error('JSONPlaceholder call error:', e);
        return null;
    }
}

export async function POST(request: Request) {
    try {
        // parse request body once
        const body = await request.json().catch(() => ({}));
        const messages = body?.messages || [];
        const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';

        if (!lastUserMessage) {
            return new Response(
                JSON.stringify({ reply: 'Invalid message format' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if the message is a greeting
        if (isGreeting(lastUserMessage)) {
            return new Response(JSON.stringify({ reply: lastUserMessage }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // Check if the message contains time/date/weather keywords
        if (containsTimeDateWeatherKeywords(lastUserMessage)) {
            const currentInfo = getCurrentInfo(lastUserMessage);
            return new Response(JSON.stringify({ reply: currentInfo }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // If the user is asking for photos, try to extract a search term and fetch from JSONPlaceholder
        function isPhotoRequest(text: string) {
            const lower = text.toLowerCase();
            const photoKeywords = ['photo', 'photos', 'image', 'images', '写真', '画像', 'フォト', '写真を見せて', '見せて'];
            return photoKeywords.some(k => lower.includes(k));
        }

        function extractPhotoQuery(text: string) {
            const lower = text.toLowerCase();
            // patterns like "photos of cats", "show photos cats", "写真 猫", "猫の写真"
            const ofMatch = lower.match(/(?:photos?|images?|写真|画像|フォト)\s+(?:of\s+)?(.+)/i);
            if (ofMatch && ofMatch[1]) return ofMatch[1].trim();
            const japaneseMatch = lower.match(/(.+?)の?(写真|画像)/);
            if (japaneseMatch && japaneseMatch[1]) return japaneseMatch[1].trim();
            // fallback: try last word(s)
            const parts = lower.split(/\s+/);
            if (parts.length > 1) return parts.slice(-2).join(' ').trim();
            return '';
        }

        if (isPhotoRequest(lastUserMessage)) {
            const queryTerm = extractPhotoQuery(lastUserMessage);
            try {
                let url = 'https://jsonplaceholder.typicode.com/photos?_limit=8';
                if (queryTerm) {
                    url = `https://jsonplaceholder.typicode.com/photos?title_like=${encodeURIComponent(queryTerm)}&_limit=8`;
                }
                let res = await fetch(url);
                let photos = [];
                if (res.ok) {
                    photos = await res.json();
                }
                // If no photos found with queryTerm, fall back to unfiltered fetch
                if ((!photos || photos.length === 0) && queryTerm) {
                    res = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=8');
                    if (res.ok) photos = await res.json();
                }

                if (photos && photos.length > 0) {
                    return new Response(JSON.stringify({ reply: JSON.stringify({ photos }) }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }
            } catch (e) {
                console.error('Photos fetch error:', e);
            }
            return new Response(JSON.stringify({ reply: '写真を取得できませんでした。' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const useWeb = !!body?.useWebSearch;
        const useUsers = !!body?.useUsers;

        // If useUsers requested, fetch JSONPlaceholder users and synthesize via OpenAI if available
        if (useUsers) {
            const users = await callJsonPlaceholderUsers();
            if (users && users.length > 0) {
                const userSummary = users.map((u: any) => `${u.id}: ${u.name} (${u.email}) - ${u.company?.name || 'N/A'}`).join('\n');

                // If OpenAI available, ask it to synthesize using user data
                const openaiReply = await callOpenAI(`Use the following user data from JSONPlaceholder to answer the question.\n\n${userSummary}\n\nQuestion: ${lastUserMessage}`);
                if (openaiReply) {
                    return new Response(JSON.stringify({ reply: openaiReply }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }

                // Otherwise return formatted user data
                const reply = `ユーザー情報:\n\n${userSummary}`;
                return new Response(JSON.stringify({ reply }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            // If fetch failed, continue to other options below
        }

        // If web search requested, try Google Custom Search then synthesize via OpenAI if available
        if (useWeb && process.env.GOOGLE_API_KEY && process.env.GOOGLE_CX) {
            const results = await callGoogle(lastUserMessage);
            if (results && results.length > 0) {
                const summary = results.map((r: any, i: number) => `${i + 1}. ${r.title}\n${r.snippet}\n${r.link}`).join('\n\n');

                // If OpenAI available, ask it to synthesize using search results
                const openaiReply = await callOpenAI(`Use the following web search results to answer the question.\n\n${summary}\n\nQuestion: ${lastUserMessage}`);
                if (openaiReply) {
                    return new Response(JSON.stringify({ reply: openaiReply }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }

                // Otherwise return formatted search results
                const reply = `検索結果:\n\n${summary}`;
                return new Response(JSON.stringify({ reply }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            // If search failed, continue to OpenAI fallback below
        }

        // Try OpenAI directly
        const openaiReply = await callOpenAI(lastUserMessage);
        if (openaiReply) {
            return new Response(
                JSON.stringify({ reply: openaiReply }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Fallback safe reply (language-aware)
        const reply = 'Got it. How would you like me to help?';

        return new Response(JSON.stringify({ reply }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ reply: 'Sorry, an error occurred. Please try again.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
}
