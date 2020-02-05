import "@babel/polyfill";
const musicContainer = document.getElementById("music-container");
const playlist = document.getElementById("playlist");
const audio = document.getElementById("audio");
const cover = document.getElementById("img");
const title = document.getElementById("title");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const nextBtn = document.getElementById("next");
const playBtn = document.getElementById("play");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");

let tracks = [];

// SONG TRACK
let songIndex = Math.floor(Math.random() * 8);

const getTracks = async () => {
  const tracks = await (
    await fetch("http://5dd1894f15bbc2001448d28e.mockapi.io/playlist")
  ).json();
  return tracks;
};

const loadPlaylist = tracks => {
  let html = `<div class="card" id="%ID%">
                <img class="card__img" src="%COVER%" alt="Albumn Art" />
                <h3 class="card__artist">%ARTIST%</h3>
                <p class="card__track-name">%TRACK%</p>
              </div>`;
  const newHTML = tracks
    .map(track => {
      let htmlString = html.replace("%ID%", track.id);
      htmlString = htmlString.replace("%COVER%", track.albumCover);
      htmlString = htmlString.replace("%TRACK%", track.track);
      htmlString = htmlString.replace("%ARTIST%", track.artist);
      return htmlString;
    })
    .join(" ");

  playlist.innerHTML = newHTML;
};

const songHandler = e => {
  const songCard = e.target.closest(".card");
  songIndex = songCard.id * 1 - 1;
  loadSong(tracks[songIndex]);
  playSong();
};

// Update song details
const loadSong = song => {
  artist.innerText = song.artist;
  title.innerText = song.track;
  audio.src = song.file;
  cover.src = song.albumCover;
};

// Play song
const playSong = () => {
  musicContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.remove("fa-play");
  playBtn.querySelector("i.fas").classList.add("fa-pause");

  audio.play();
};

// Pause song
const pauseSong = () => {
  musicContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.add("fa-play");
  playBtn.querySelector("i.fas").classList.remove("fa-pause");

  audio.pause();
};

// Previous song
const prevSong = () => {
  songIndex--;

  if (songIndex < 0) {
    songIndex = tracks.length - 1;
  }

  loadSong(tracks[songIndex]);

  playSong();
};

const shuffle = () => {
  songIndex = Math.floor(Math.random() * tracks.length);
  loadSong(tracks[songIndex]);
  playSong();
};

// Next song
const nextSong = () => {
  songIndex++;

  if (songIndex > tracks.length - 1) {
    songIndex = 0;
  }

  loadSong(tracks[songIndex]);

  playSong();
};

// Update progress bar
const updateProgress = e => {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
};

// Set progress bar
const setProgress = e => {
  const width = e.target.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
};

(async () => {
  try {
    tracks = await getTracks();
    tracks = tracks.splice(0, tracks.length - 1);

    // Initially load song details into DOM
    loadSong(tracks[songIndex]);

    if (playlist) {
      loadPlaylist(tracks);
    }
    prevBtn.addEventListener("click", prevSong);
    nextBtn.addEventListener("click", nextSong);
    shuffleBtn.addEventListener("click", shuffle);
    playBtn.addEventListener("click", () => {
      const isPlaying = musicContainer.classList.contains("play");

      if (isPlaying) {
        pauseSong();
      } else {
        playSong();
      }
    });

    // Time/song update
    audio.addEventListener("timeupdate", updateProgress);

    // Click on progress bar
    progressContainer.addEventListener("click", setProgress);

    // Song ends
    audio.addEventListener("ended", nextSong);
    playlist.addEventListener("click", songHandler);
  } catch (err) {
    console.log(err);
  }
})();
