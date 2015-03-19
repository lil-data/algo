var socket = io('https://algorave.herokuapp.com/');

setInterval(function(){
    socket.emit("key", "message");
    console.log("test");
},1000);