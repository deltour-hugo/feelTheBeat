/* ON FAIT DES QUERY DE LA MAJORIT2 DES SELECTEURS DONT ON AURA BESOIN. */
const player = document.querySelector(".player"),
musicImg = player.querySelector(".image__area img"),
musicName = player.querySelector(".song-details .name"),
musicArtist = player.querySelector(".song-details .artist"),
mainAudio = player.querySelector("#main-audio"),
playPauseBtn = player.querySelector(".play-pause"),
prevBtn = player.querySelector("#prev"),
nextBtn = player.querySelector("#next"),
progressArea = player.querySelector(".progress-area"),
progressBar = player.querySelector(".progress-bar");

/* INDEX DE LA MUSIQUE EN COURS DE LECTURE. */
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

/* AU CHARGEMENT DE LA PAGE ON LOAD LA MUSIQUE ET ON LUI APPLIQUE UNE CLASSE. */
window.addEventListener('load', () => {
    loadMusic(musicIndex);
    nowPlaying();
})

/* CHARGE LES PROPRIÉTÉS DE LA MUSIQUE SÉLECTIONNÉE. */
function loadMusic (indexNumb)
{
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `../assets/imgs/${allMusic[indexNumb - 1].img}`;
    mainAudio.src = `../music/${allMusic[indexNumb - 1].src}.mp3`;
}

/* PERMET DE LIRE LA MUSIQUE. */
function playMusic ()
{
    player.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

/* PERMET DE METTRE EN PAUSE LA MUSIQUE. */
function pauseMusic ()
{
    player.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

/* CHARGE LA MUSIQUE SUIVANTE. */
function nextMusic ()
{
    musicIndex++;
    if (musicIndex > allMusic.length) {
        musicIndex = 1;
    } else {
        musicIndex = musicIndex;
    }
    loadMusic(musicIndex);
    playMusic();
    nowPlaying();
}

/* CHARGE LA MUSIQUE SUIVANTE. */
function prevMusic ()
{
    musicIndex--;
    if (musicIndex < 1) {
        musicIndex = allMusic.length;
    } else {
        musicIndex = musicIndex;
    }
    loadMusic(musicIndex);
    playMusic();
    nowPlaying();
}

/* DÉTECTE LE 'CLICK' DU BOUTON 'PLAY / PAUSE' ET ARRÊTE OU LANCE LA MUSIQUE. */
playPauseBtn.addEventListener('click', () => {
    const isMusicPaused = player.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    nowPlaying();
});

/* DETECTE LE 'CLICK' DU BOUTON 'NEXT' ET LANCE LA MUSIQUE SUIVANTE. */
nextBtn.addEventListener('click', () => {
    nextMusic();
});

prevBtn.addEventListener('click', () => {
    prevMusic();
});

mainAudio.addEventListener('timeupdate', (event) => {
    const currentTime = event.target.currentTime;
    const duration = event.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    let musicCurrentTime = player.querySelector(".current"),
    musicDuration = player.querySelector(".duration");
    
    mainAudio.addEventListener('loadeddata', () => {
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener('click', (event) => {
    let progressWidthValue = progressArea.clientWidth;
    let clickedOffSetX = event.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffSetX / progressWidthValue) * songDuration;
    playMusic();
});

const repeatBtn = player.querySelector("#repeat-playList");
repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Titre Looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Lecture Aléatoire");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist Looped");
            break;
    }
});

mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
    nowPlaying();
            break;
    }
});

function showPlayer ()
{
    player.classList.add('player__is-opened');
    player.classList.remove('player');
}

function hidePlayer ()
{
    if (player.classList.contains('player__is-opened')) {
        player.classList.add('player');
        player.classList.remove('player__is-opened');
    }
}

const ulSongsTag = document.querySelector(".songs__list");
for (let i = 0; i < allMusic.length; i++) {
    let liSongTag = `<li class="song" li-index="${i + 1}">
                        <img class="song__image" src="../assets/imgs/${allMusic[i].img}">
                        <p class="song__title">${allMusic[i].name.length > 20 ? allMusic[i].name.substring(0, 20) + '...' : allMusic[i].name}</p>
                        <p class="song__artist">${allMusic[i].artist}</p>
                        <audio class="${allMusic[i].src}" src="../music/${allMusic[i].src}.mp3"></audio>
                        <span id="${allMusic[i].src}" class="song__duration"></span>
                    </li>`;
    ulSongsTag.insertAdjacentHTML("beforeend", liSongTag);
    let liAudioDuration = ulSongsTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulSongsTag.querySelector(`.${allMusic[i].src}`); 
    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`)
    });
}

const allLiSongsTags = ulSongsTag.querySelectorAll("li");

function nowPlaying ()
{
    for (let j = 0; j < allLiSongsTags.length; j++) {
        let audioTag = allLiSongsTags[j].querySelector(".song__duration");
        if (allLiSongsTags[j].classList.contains("playing")) {
            allLiSongsTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        if (allLiSongsTags[j].getAttribute("li-index") == musicIndex) {
            allLiSongsTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        allLiSongsTags[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked (element)
{
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    nowPlaying();
}

function removeDuplicate (table)
{
    return table.filter((item, index) => table.indexOf(item) === index);
}

const ulAlbumsTag = document.querySelector(".albums__list");
let albums = allMusic.map(function (key) {
    return key, key.album;
});

for (let i = 0; i < removeDuplicate(albums).length; i++) {
    let liAlbumTag = `<div class="album__card" id="${removeDuplicate(albums)[i]}" onclick="showCurrentAlbum(), getClickedAlbumID(this.id)">
                            <img class="album__card--image" src="../assets/imgs/${allMusic[i].img}">
                            <p class="album__card--name">${removeDuplicate(albums)[i]}</p>
                        </div>`;
    ulAlbumsTag.insertAdjacentHTML("beforeend", liAlbumTag);
}

const currentAlbumTitle = document.querySelector('.currentAlbum__title');
let albumSongsList = document.querySelector('.albumSongsList');
function getClickedAlbumID (id)
{
    let elementID = id;
    currentAlbumTitle.innerText = elementID;
    const albumSongResult = allMusic.filter(function(music) {
        if (music.album == elementID) {
            filteredMusic = `<div>
                                <span>${music.name}</span>
                            </div>`;
        } else {
            return false;
        }
    });
    albumSongsList.insertAdjacentHTML('beforeend', filteredMusic);
}

const ulArtistsTag = document.querySelector(".artists__list");
let artists = allMusic.map(function (key) {
    return key, key.artist;
});

for (let i = 0; i < removeDuplicate(artists).length; i++) {
    let liArtistTag = `<div class="artists__card">
                            <img class="artists__card--image" src="">
                            <p class="artists__card--title">${removeDuplicate(artists)[i]}</p>
                        </div>`;
    ulArtistsTag.insertAdjacentHTML("beforeend", liArtistTag);
}

let currentAlbum = document.querySelector('.currentAlbum');
function showCurrentAlbum ()
{
    currentAlbum.classList.add('currentAlbum__is-opened');
    currentAlbum.classList.remove('currentAlbum');
}

function hideCurrentAlbum ()
{
    currentAlbum.classList.add('currentAlbum');
    currentAlbum.classList.remove('currentAlbum__is-opened');
}