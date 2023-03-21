import toStream from "it-to-stream";
import  pushable  from "it-pushable";
import {serializeSSEEvent, transformAsyncIterable} from "./sse.js";
import {isAsyncIterable} from "./util.js";


export const plugin = async function (instance, options) {
    instance.decorateReply("sse", function (source)
    {
        const context = this.raw
        if (!this.raw?.headersSent) {
            this.sseContext = {source};
            this.sseContext.source = pushable()
            Object.entries(this.getHeaders()).forEach(([key, value]) => {
                this.raw.setHeader(key, value ?? "");
            });
            this.raw.setHeader("Content-Type", "text/event-stream");
            this.raw.setHeader("Connection", "keep-alive");
            this.raw.setHeader("Cache-Control", "no-cache,no-transform");
            this.raw.setHeader("x-no-compression", 1);
            this.raw.write(
                serializeSSEEvent({retry: options.retryDelay || 3000})
            );
            handleAsyncIterable(context, this.sseContext.source);
        }
        if(source.event === 'end') {
            this.sseContext.source.end()
            return
        }
        if (isAsyncIterable(source)) {
            return handleAsyncIterable(context, source);
        } else {
            this.sseContext.source.push(source);
            return;
        }
    })
};

function handleAsyncIterable(reply, source) {
    toStream(transformAsyncIterable(source)).pipe(reply);
}