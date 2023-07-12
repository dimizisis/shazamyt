// Initialize the Plyr player
const player = new Plyr('#player');

const goButton = document.getElementById('goButton');

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
  const currentTime = player.currentTime;

  // Perform any necessary actions with the selected time span
  console.log('Start Time: ' + currentTime);
});

function extractVideoId(url) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})(?:\S+)?$/;
    const match = url.match(regex);
  
    if (match && match[1]) {
      return match[1];
    }
  
    return null;
  }