var Downloader = require("./Downloader");
var dl = new Downloader();
var i = 0;

dl.getMP3({videoId: "weewaTuUheQ", name: "Saber's Edge.mp3"}, function(err,res){
    i++;
    if(err)
        throw err;
    else{
        console.log("Song "+ i + " was downloaded: " + res.file);
    }
});