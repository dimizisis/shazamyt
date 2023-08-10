// Initialize the Plyr player
const player = new Plyr('#player');

const findButton = document.getElementById('findButton');

const SERVER = 'localhost';
const PORT = '8000';

findButton.addEventListener('click', () => {
  const url = document.getElementById('linkInput').value;
  const id = extractVideoId(url);
  const start = extractStartTimeInSecondsFromYouTubeURL(url)

  const outerPlayerDiv = document.getElementById('outerPlayerDiv');
  const resultsDiv = document.getElementById('resultsDiv');

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

const goButton = document.getElementById('goButton');

const loadingSpinnerDiv = document.getElementById('loadingSpinnerDiv');

goButton.addEventListener('click', () => {

  const startTime = parseInt(player.currentTime);
  goButton.disabled = true;
  findButton.disabled = true;
  goButton.classList.add('disabled');
  findButton.classList.add('disabled');
  loadingSpinnerDiv.style.display = 'inherit';

  const urlWithoutList = document.getElementById('linkInput').value.replace(/(\?|&)list=[^&]+/, '');
  searchForSong(urlWithoutList, secondsToHMS(startTime))

});

function extractVideoId(url) {
  const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

function extractStartTimeInSecondsFromYouTubeURL(url) {
  const searchParams = new URLSearchParams(new URL(url).search);
  const startTimeParam = searchParams.get('t');

  if (startTimeParam) {
    const startTimeInSeconds = parseInt(startTimeParam);
    return startTimeInSeconds;
  }

  return -1;
}

function secondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function searchForSong(youtubeUrl, startTime) {

  const apiUrl = `http://${SERVER}:${PORT}/youtube?url=${encodeURIComponent(youtubeUrl)}&start=${encodeURIComponent(startTime)}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {

      const albumImage = document.getElementById('albumImage');
      const songName = document.getElementById('songName');
      const artist = document.getElementById('artist');
      const outerPlayerDiv = document.getElementById('outerPlayerDiv');
      const resultsDiv = document.getElementById('resultsDiv');

      hideAllSearchComponents(outerPlayerDiv, loadingSpinnerDiv)

      if (!data.track) {
        albumImage.src = 'https://www.shazam.com/resources/f6f457227917dcdfc9538fbbb5a931f111648b3d/nocoverart.jpg'
        albumImage.classList.add('visible');
        songName.innerHTML = 'Couldn\'nt recognize the song :(';
        goButton.disabled = false;
        findButton.disabled = false;
        goButton.classList.remove('disabled');
        findButton.classList.remove('disabled');
        resultsDiv.classList.add('show');
        return;
      }

      showSongDetails(resultsDiv, albumImage, songName, artist, data)

      goButton.disabled = false;
      findButton.disabled = false;
      goButton.classList.remove('disabled');
      findButton.classList.remove('disabled');

    })
    .catch(error => console.error('Error:', error));
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
  } else {
    albumImage.src = 'https://www.shazam.com/resources/f6f457227917dcdfc9538fbbb5a931f111648b3d/nocoverart.jpg'
  }
  resultsDiv.classList.add('show');
  albumImage.classList.add('visible');
}