import Plyr from 'plyr';

// Initialize the Plyr player
const player = new Plyr('#player');

const findButton = document.getElementById('findButton') as HTMLButtonElement;

const SERVER = 'localhost';
const PORT = '8000';

findButton.addEventListener('click', () => {
  const url = (document.getElementById('linkInput') as HTMLInputElement).value;
  const id = extractVideoId(url);
  const start = extractStartTimeInSecondsFromYouTubeURL(url);

  const outerPlayerDiv = document.getElementById('outerPlayerDiv') as HTMLDivElement;
  const resultsDiv = document.getElementById('resultsDiv') as HTMLDivElement;

  if (id === null) return;

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

  player.on('ready', function (event: Event) {
    if (start !== -1) {
      player.forward(start);
    }
  });
});

const goButton = document.getElementById('goButton') as HTMLButtonElement;

const loadingSpinnerDiv = document.getElementById('loadingSpinnerDiv') as HTMLDivElement;

goButton.addEventListener('click', () => {
  const startTime = parseInt(player.currentTime.toString());
  goButton.disabled = true;
  findButton.disabled = true;
  goButton.classList.add('disabled');
  findButton.classList.add('disabled');
  loadingSpinnerDiv.style.display = 'inherit';
  searchForSong((document.getElementById('linkInput') as HTMLInputElement).value, secondsToHMS(startTime));
});

function extractVideoId(url: string): string | null {
  const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

function extractStartTimeInSecondsFromYouTubeURL(url: string): number {
  const searchParams = new URLSearchParams(new URL(url).search);
  const startTimeParam = searchParams.get('t');

  if (startTimeParam) {
    const startTimeInSeconds = parseInt(startTimeParam);
    return startTimeInSeconds;
  }

  return -1;
}

function secondsToHMS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function searchForSong(youtubeUrl: string, startTime: string): void {
  const apiUrl = `http://${SERVER}:${PORT}/youtube?url=${encodeURIComponent(youtubeUrl)}&start=${encodeURIComponent(startTime)}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const albumImage = document.getElementById('albumImage') as HTMLImageElement;
      const songName = document.getElementById('songName') as HTMLParagraphElement;
      const artist = document.getElementById('artist') as HTMLParagraphElement;
      const outerPlayerDiv = document.getElementById('outerPlayerDiv') as HTMLDivElement;
      const resultsDiv = document.getElementById('resultsDiv') as HTMLDivElement;

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
    .catch(error => console.error('Error:', error));
}

function hideAllSearchComponents(outerPlayerDiv: HTMLDivElement, loadingSpinnerDiv: HTMLDivElement): void {
  outerPlayerDiv.style.display = 'none';
  loadingSpinnerDiv.style.display = 'none';
}

function showSongDetails(resultsDiv: HTMLDivElement, albumImage: HTMLImageElement, songName: HTMLParagraphElement, artist: HTMLParagraphElement, data: any): void {
  songName.innerHTML = data.track.title;
  artist.innerHTML = data.track.subtitle;
  if (data.track.images && data.track.images.coverart) {
    albumImage.src = data.track.images.coverart;
  } else {
    albumImage.src = 'https://www.shazam.com/resources/f6f457227917dcdfc9538fbbb5a931f111648b3d/nocoverart.jpg';
  }
  resultsDiv.classList.add('show');
  albumImage.classList.add('visible');
}
