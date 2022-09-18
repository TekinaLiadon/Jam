const header = require('../../utils/headers')

const sendInterval = 30000;

function connect (req, res) {
    res.writeHead(200, header.sse)
    res.flushHeaders()

    const sseId = (new Date()).toLocaleTimeString();

    setInterval(function() {
        writeServerSendEvent(res, sseId, (new Date()).toLocaleTimeString());
    }, sendInterval);
    // Запрос на сервер а после вызов функции

    writeServerSendEvent(res, sseId, (new Date()).toLocaleTimeString());
}

function writeServerSendEvent(res, sseId, data) {
    res.write('id: ' + sseId + '\n');
    res.write("data: new server event " + data + '\n\n');
}
function countdown(res, count) {
    res.write("data: " + count + "\n\n")
    if (count)
        setTimeout(() => countdown(res, count-1), 1000)
    else
        res.end()
}

module.exports = /*connect*/ countdown