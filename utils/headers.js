const headers = {
    cache: {'Cache-Control': 'no-cache, must-revalidate, max-age=3600'},
    sse: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    }
    }

module.exports = headers