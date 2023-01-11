
export function serializeSSEEvent(chunk) {
    let payload = "";
    if (chunk.id) {
        payload += `id: ${chunk.id}\n`;
    }
    if (chunk.event) {
        payload += `event: ${chunk.event}\n`;
    }
    if (chunk.data) {
        payload += `data: ${chunk.data}\n`;
    }
    if (chunk.retry) {
        payload += `retry: ${chunk.retry}\n`;
    }
    if (!payload) {
        return "";
    }
    payload += "\n";
    return payload;
}

export async function* transformAsyncIterable(source) {
    for await (var message of source) {
         yield serializeSSEEvent(message);
    }
    yield serializeSSEEvent({ event: "end", data: "Stream closed" });
}