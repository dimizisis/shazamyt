"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var plyr_1 = __importDefault(require("plyr"));
// Initialize the Plyr player
var player = new plyr_1.default('#player');
var findButton = document.getElementById('findButton');
var SERVER = 'localhost';
var PORT = '8000';
findButton.addEventListener('click', function () {
    var url = document.getElementById('linkInput').value;
    var id = extractVideoId(url);
    var start = extractStartTimeInSecondsFromYouTubeURL(url);
    var outerPlayerDiv = document.getElementById('outerPlayerDiv');
    var resultsDiv = document.getElementById('resultsDiv');
    if (id === null)
        return;
    outerPlayerDiv.style.display = 'inherit';
    outerPlayerDiv.style.visibility = 'visible';
    resultsDiv.classList.remove('show');
    player.source = {
        type: 'video',
        sources: [
            {
                src: id,
                provider: 'youtube',
            },
        ],
    };
    player.on('ready', function (event) {
        if (start !== -1) {
            player.forward(start);
        }
    });
});
var goButton = document.getElementById('goButton');
var loadingSpinnerDiv = document.getElementById('loadingSpinnerDiv');
goButton.addEventListener('click', function () {
    var startTime = parseInt(player.currentTime.toString());
    goButton.disabled = true;
    findButton.disabled = true;
    goButton.classList.add('disabled');
    findButton.classList.add('disabled');
    loadingSpinnerDiv.style.display = 'inherit';
    searchForSong(document.getElementById('linkInput').value, secondsToHMS(startTime));
});
function extractVideoId(url) {
    var regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
    var match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}
function extractStartTimeInSecondsFromYouTubeURL(url) {
    var searchParams = new URLSearchParams(new URL(url).search);
    var startTimeParam = searchParams.get('t');
    if (startTimeParam) {
        var startTimeInSeconds = parseInt(startTimeParam);
        return startTimeInSeconds;
    }
    return -1;
}
function secondsToHMS(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;
    return "".concat(hours.toString().padStart(2, '0'), ":").concat(minutes.toString().padStart(2, '0'), ":").concat(remainingSeconds.toString().padStart(2, '0'));
}
function searchForSong(youtubeUrl, startTime) {
    var apiUrl = "http://".concat(SERVER, ":").concat(PORT, "/youtube?url=").concat(encodeURIComponent(youtubeUrl), "&start=").concat(encodeURIComponent(startTime));
    fetch(apiUrl)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var albumImage = document.getElementById('albumImage');
        var songName = document.getElementById('songName');
        var artist = document.getElementById('artist');
        var outerPlayerDiv = document.getElementById('outerPlayerDiv');
        var resultsDiv = document.getElementById('resultsDiv');
        hideAllSearchComponents(outerPlayerDiv, loadingSpinnerDiv);
        if (!data.track) {
            albumImage.src = 'https://www.shazam.com/resources/f6f457227917dcdfc9538fbbb5a931f111648b3d/nocoverart.jpg';
            albumImage.classList.add('visible');
            songName.innerHTML = 'Couldn\'nt recognize the song :(';
            goButton.disabled = false;
            findButton.disabled = false;
            goButton.classList.remove('disabled');
            findButton.classList.remove('disabled');
            resultsDiv.classList.add('show');
            return;
        }
        showSongDetails(resultsDiv, albumImage, songName, artist, data);
        goButton.disabled = false;
        findButton.disabled = false;
        goButton.classList.remove('disabled');
        findButton.classList.remove('disabled');
    })
        .catch(function (error) { return console.error('Error:', error); });
}
function hideAllSearchComponents(outerPlayerDiv, loadingSpinnerDiv) {
    outerPlayerDiv.style.display = 'none';
    loadingSpinnerDiv.style.display = 'none';
}
function showSongDetails(resultsDiv, albumImage, songName, artist, data) {
    songName.innerHTML = data.track.title;
    artist.innerHTML = data.track.subtitle;
    if (data.track.images && data.track.images.coverart) {
        albumImage.src = data.track.images.coverart;
    }
    else {
        albumImage.src = 'https://www.shazam.com/resources/f6f457227917dcdfc9538fbbb5a931f111648b3d/nocoverart.jpg';
    }
    resultsDiv.classList.add('show');
    albumImage.classList.add('visible');
}
