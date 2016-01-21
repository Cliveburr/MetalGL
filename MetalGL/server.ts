require('./Extenders');
import httpServer = require('./Http/HttpServer');
import files = require('./Http/Files');
import webSocket = require('./Http/WebSocket');

var port = process.env.port || 1337

var server = new httpServer.Server({
    rootApp: __dirname + '\\..\\MetalGL.WebUI'
});

server.configureServices((services) => {

    var ws = new webSocket.Server(services.httpServer);
    ws.on('connection', (client: any) => {
        var id = setInterval(function () {
            client.send(JSON.stringify(process.memoryUsage()), function () { /* ignore errors */ });
        }, 100);
        console.log('started client interval');
        client.on('close', function () {
            console.log('stopping client interval');
            clearInterval(id);
        });
    });

});

server.configure((app) => {

    app.use(files.DefaultFiles);

    app.use(files.StaticFiles);

    app.useErrorNotFound();

});

server.listen(port);