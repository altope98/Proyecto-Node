var express = require('express');
var app= express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


var siofu = require('socketio-file-upload'); 

var contador=0;

io.on('connection', socket => {
  console.log("conectado usuario");
  

  socket.on('new-usuario', function(nombre){
      contador++;
      socket.broadcast.emit('usuario-conectado', nombre);
      io.emit('contador', contador);

      var uploader=new siofu();
      uploader.dir="./public/assets";
      uploader.on('complete', function(e){
        io.emit('archivo', {'nombre':nombre, 'name':e.file.name});
        console.log("Envia archivo"+ e.file.name)
      })
      uploader.listen(socket) 

      socket.on('stream', function(data){
        socket.broadcast.emit('stream', data);
      });

      socket.on('mensaje', function(m){
        io.emit('mensaje', {'nombre':nombre, 'mensaje':m});
      });
  });

  socket.on('escribiendo', function(nombre){
      socket.broadcast.emit('escribiendo', nombre);
  });
  socket.on('disconnect', function(nombre){
      if(contador>=0){
        contador--;
      }
      socket.broadcast.emit('usuario-desconectado', nombre);
      io.emit('contador', contador);
  });

})

app.use(siofu.router).use(express.static(__dirname+ '/public')); 

const PORT = process.env.PORT || 3000
http.listen(PORT, function(){
  console.log('listening on *:3000');
});