// Initialize the Plyr player
const player = new Plyr('#player');

const goButton = document.getElementById('goButton');

const SERVER = 'localhost';
const PORT = '8000';

goButton.addEventListener('click', () => {
  const id = extractVideoId(document.getElementById('linkInput').value);

  const outerPlayerDiv = document.getElementById('outerPlayerDiv');

  if (id === null)
    return;

  outerPlayerDiv.style.visibility = 'visible';

  player.source = {
    type: 'video',
    sources: [
      {
        src: id,
        provider: 'youtube',
      },
    ],
  };
});

// Get the select button
const selectButton = document.getElementById('selectButton');

// Add event listener to the select button
selectButton.addEventListener('click', () => {
  // Get the start and end times from the input fields
  const startTime = parseInt(player.currentTime);

  // Perform any necessary actions with the selected time span
  console.log('Start Time: ' + secondsToHMS(startTime));

  displayYouTubeImage(document.getElementById('linkInput').value, secondsToHMS(startTime))

});

function extractVideoId(url) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
    const match = url.match(regex);
  
    if (match && match[1]) {
      return match[1];
    }
  
    return null;
  }

function secondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
    
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function displayYouTubeImage(youtubeUrl, startTime) {

  const apiUrl = `http://${SERVER}:${PORT}/youtube?url=${encodeURIComponent(youtubeUrl)}&start=${encodeURIComponent(startTime)}`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          const albumImage = document.getElementById('albumImage');
          const songName = document.getElementById('songName');
          const artist = document.getElementById('artist');
          songName.innerHTML = data.track.title;
          artist.innerHTML = data.track.subtitle;
          if (data.track.images && data.track.images.coverart) {
            albumImage.src = data.track.images.coverart;
          } else {
            albumImage.src = 'https://www.shazam.com/resources/f6f457227917dcdfc9538fbbb5a931f111648b3d/nocoverart.jpg'
          }
          albumImage.classList.add('visible');
      })
      .catch(error => console.error('Error:', error));
}