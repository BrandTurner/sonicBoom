var axios = require('axios');

function processPlaylist(playlistItems) {
    console.log(playlistItems);
    return (playlistItems.data.items.map(function (playlistItems) {
        return {
            thumbnail: playlistItems.snippet.thumbnails.default.url,
            title: playlistItems.snippet.title,
            playlistId: playlistItems.id
        };
    }));
}
https://content.googleapis.com/youtube/v3/playlistItems?maxResults=50&part=snippet&playlistId=PLNXQWMqiSM3ANXivcNXdp5At4DDlSmOVN&key=AIzaSyD-a9IF8KKYgoC3cpgS-Al7hLQDbugrDcw
var helpers = {
    getPlaylists: function (token) {
        var meta = {
            headers: {'authorization': 'Bearer ' + token },
            params: {
                mine: true,
                part: 'snippet',
                maxResults: 50
            }
        };

        return axios.get('https://content.googleapis.com/youtube/v3/playlists', meta)
            .then(processPlaylist)
            .then(function (playlistIds) {
                console.log('16 hours');
                return(playlistIds);
        });
    },
    
    getTracks: function (token, playlistId) {
        var meta = {
            headers: {'authorization': 'Bearer ' + token },
            params: {
                playlistId: playlistId,
                part: 'snippet',
                maxResults: 50
            }
        };


        // TODO return array of title, thumbnail objs
        return axios.get('https://content.googleapis.com/youtube/v3/playlists', meta)
            .then(processPlaylist)
            .then(function (playlistIds) {
                console.log('16 hours');
                return(playlistIds);
        });
    }
};

module.exports = helpers;
