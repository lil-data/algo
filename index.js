if(process.env.NODETIME_ACCOUNT_KEY) {
    require('nodetime').profile({
        accountKey: process.env.NODETIME_ACCOUNT_KEY,
        appName: 'Zocket'
    });
}

var express = require('express');
var app = express();
var connections = 0;

app.set('port', (process.env.PORT || 5000));

var http = require('http').Server(app);
var io = require('socket.io')(http);

//// stuff
function extract(string){
    var reg = /{(.*?)}/g;
    var object = {};
    var matches = string.match(reg);
    for (var i=0; i < matches.length; i++) {
        var stuff = matches[i].split("|");
        stuff[stuff.length -1] = stuff[stuff.length - 1].replace("}", "");
        stuff[0] = stuff[0].replace("{", "");
        object[stuff[0]] = stuff.splice(1);
    }
    return object;
}
var st ="The user of the future will {fly|fly|grow} her own computer. She will own and control her own identity and her own data. She will even host her own apps. She will not be part of someone else's Big Data. She will be her own Little Data. Unless she's a really severe geek, she will pay some service to store and execute her ship - but she can move it anywhere else, anytime, for the cost of the bandwidth. So called \"{size|big|lil} data\" is a cringeworthy buzzword birthed from the loins of Silicon Valley and corporate board rooms. Yet the constellation of technologies to which it refers also presents a singular problem for contemporary theorists and practitioners across all fields. To paraphrase Deleuze: we ask endlessly whether algorithmic data analytics systems are {morality|good|evil}, are novel or merely digital hype, but we rarely do we ask what an \“algorithm\” can do. However, the transformations taking place are {speed|fast|slow}-paced and often too little debated or contested in the mainstream media and legislature, with disruptive technical and social innovations taking root and expanding rapidly before we have time to digest the implications or consider the need for oversight. In its technocratic utopianism, data analytics systems render multidimensional processes into numbers subject to mining, dependent upon a logic of smoothness in order to function. This necessarily reduces the {complexity|complex|simple} social world into terms of calculation and irruption that can only be understood by machines. Both software and cities are complex, open systems. Using software to run and manage city services and infrastructures exposes them to {glitch|viruses|glitches}, crashes, and security hacks. \'I used to think my job was all about arrests. Chasing bad guys. Now I see my work differently. We analyze crime data, spot patterns, and figure out where to send patrols. It’s helped some US cities cut {crime|serious|silly} crime by up to 30% by stopping it before it happens. Let’s build a smarter planet.\' As city systems become more complicated, interconnected, and dependent on software, producing stable, robust and {paranoia|secure|paranoid} devices and infrastructures will become more of a challenge. Collectively what all of these examples demonstrate is that the everyday practices we enact, and the places in which we live, are now {depth|deeply|shallowly} augmented, monitored and regulated by dense assemblages of data-enabled infrastructures and technologies on behalf of a small number of entities.";
var v = 0;
var options = extract(st);
var worldstate = {};

//connections
io.on('connection', function(socket){
    connections++;
    console.log('a user connected', connections);

    io.to(socket.id).emit('init', worldstate);


    // on disconnect
    socket.on('disconnect', function(){
        connections--;
        console.log('user disconnected');
    });

    //on everychange
    socket.on("change", function(key, value){
        worldstate[key] = options[key][value];
        socket.broadcast.emit("change", key, value);
    });
});

setInterval(function(){
    io.emit("users", connections);
}, 1000);

http.listen(app.get('port'), function() {
  console.log("Node app is running at port:" + app.get('port'));
});
