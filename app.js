var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};

app.get('/', function(req, res){
  res.send('Server rodando!');
});

io.on("connection", function (client) {
    client.on("join", function(name){
    	console.log("Joined: " + name);
        clients[client.id] = name;
        client.emit("update", "Você está conectado no chat.");
        io.emit("add_user_list_online", name);
        client.broadcast.emit("update", name + " entrou no chat.");
    });

    client.on("send", function(msg){
    	console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
    	console.log("Disconnect");
        io.emit("update", clients[client.id] + " saiu do chat.");
        delete clients[client.id];
    });
});


http.listen(3000, function(){
  console.log('escutando na porta 3000');
});
