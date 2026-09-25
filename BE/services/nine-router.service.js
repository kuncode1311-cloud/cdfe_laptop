const DEFAULT_BASE_URL = 'https://api-trikun.up.railway.app/v1';
const DEFAULT_MODEL = 'ag/gemini-3.8-flash';

function layCauHinhNineRouter() {
    return {
        apiKey: (process.env.NINE_ROUTER_API_KEY || '').trim(),
        baseUrl: (process.env.NINE_ROUTER_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, ''),
        model: (process.env.NINE_ROUTER_MODEL || DEFAULT_MODEL).trim()
    };
}

async function goiNineRouter({ systemPrompt, userPrompt, lichSuChat = [], generationConfig = {}, onChunk }) {
    const { apiKey, baseUrl, model } = layCauHinhNineRouter();
    if (!apiKey) throw new Error('Chưa cấu hình NINE_ROUTER_API_KEY');

    const messages = [{ role: 'system', content: systemPrompt }];
    for (const item of Array.isArray(lichSuChat) ? lichSuChat.slice(-10) : []) {
        const content = item?.content || item?.text;
        if (typeof content === 'string' && content.trim()) {
            messages.push({
                role: item.role === 'assistant' || item.role === 'model' ? 'assistant' : 'user',
                content: content.trim()
            });
        }
    }
    messages.push({ role: 'user', content: userPrompt });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);
    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: generationConfig.temperature ?? 0.7,
                max_tokens: generationConfig.maxOutputTokens ?? 1024,
                stream: Boolean(onChunk)
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`9Router HTTP ${response.status}`);
        }
        if (onChunk) {
            if (!response.body) throw new Error('9Router không hỗ trợ stream');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let content = '';
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
                    const events = buffer.split(/\r?\n\r?\n/);
                    buffer = events.pop();
                    for (const event of events) {
                        const dataLine = event.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trim()).join('');
                        if (!dataLine || dataLine === '[DONE]') continue;
                        const chunk = JSON.parse(dataLine);
                        const delta = chunk?.choices?.[0]?.delta?.content;
                        if (typeof delta === 'string' && delta) {
                            content += delta;
                            onChunk(content);
                        }
                    }
                    if (done) break;
                }
            } finally {
                reader.releaseLock();
            }
            if (!content.trim()) throw new Error('9Router trả về nội dung rỗng');
            return content;
        }
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content !== 'string' || !content.trim()) {
            throw new Error('9Router trả về nội dung rỗng');
        }
        return content;
    } finally {
        clearTimeout(timeoutId);
    }
}

module.exports = { goiNineRouter, layCauHinhNineRouter };
