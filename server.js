var express = require('express');
var app= express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

/* 
var siofu = require('socketio-file-upload'); */

var contador=0;
app.use(express.static(__dirname+ '/public'));
/* app.use(siofu.router).use(express.static(__dirname+ '/public')); */

io.on('connection', socket => {
  console.log("conectado usuario");
 /*  var uploader=new siofu();
  uploader.dir="./public/files";
  uploader.on('complete', function(e){console.log("Envia archivo"+ e.file.name)})
  uploader.listen(socket) */
  socket.on('stream', function(data){
    socket.broadcast.emit('stream', data);
  });
    socket.on('new-usuario', function(nombre){
      
      

      contador++;
      socket.broadcast.emit('usuario-conectado', nombre);
      io.emit('contador', contador);

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


http.listen(3000, function(){
  console.log('listening on *:3000');
});