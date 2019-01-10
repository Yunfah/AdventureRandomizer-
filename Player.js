const SPOTIFY_API = 'https://api.spotify.com/v1';

(function() {
    const ACCESS_TOKEN_URL = '/accessToken'
    let accessToken;
    let currentArea;
    let currentTrack = 0;
    let playerSource;

    const areas = {
        EUROPE: 0,
        ASIA: 1,
    }

    const playlist = {
        [areas.EUROPE]: [
            '37ato9JpxggrmZsqaXa3qN',
            '2TpxZ7JUBn3uw46aR7qd6V',
            '51NTQCV8t4jFoFjSMWE2ZR',
        ],
    };

    function init(area, source) {
        currentArea = area;
        playerSource = source;
        setAccessToken(play);
    }

    function play() {
        playTrack(playlist[currentArea][currentTrack]);
    }

    function nextTrack() {
        currentTrack += 1;
        if (!playlist[currentArea][currentTrack]) {
            currentTrack = 0;
        }
        play();
    }

    function playTrack(track) {
        $.ajax({
            type: 'GET',
            url: SPOTIFY_API + '/tracks/' + track,
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
            error: function(error) {
                // Access token no longer valid
                if (error.status === 400) {
                    // Generate new
                    setAccessToken(function() {
                        playTrack(track);
                    });
                }
            },
        })
        .done(function(data) {
            const previewUrl = data.preview_url;
            document.getElementById('player').innerHTML = '<audio id="audio" controls autoplay src="'+ previewUrl +'" type="audio/mpeg">';

            const audio = document.getElementById('audio');

            audio.onended = function() {
                nextTrack();
            }
        })
    }

    function setAccessToken(onAccessTokenSet) {
        $.ajax({
            type: 'GET',
            url: ACCESS_TOKEN_URL,
        })
        .done(function(data){
            accessToken = data;

            onAccessTokenSet();
        })
    }

    // Public functions
    window.Player = {
        init: init,
        areas: areas,
        nextTrack: nextTrack,
    };
})();
