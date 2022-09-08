const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#mainAudio"),
pausePlayBtn = wrapper.querySelector("#pausePlayBtn"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector('.progress-area'),
progressBar = wrapper.querySelector('.progress-bar')

//load new music on refresh
//let musicIndex = 2
let musicIndex = Math.floor((Math.random()* song.length + 1))

window.addEventListener('load', ()=>{
    loadMusic(musicIndex)
    playingNow() 
})
function loadMusic(indexNumb){
    musicName.innerText = song[indexNumb -1].Title
    musicArtist.innerText = song[indexNumb -1].artiste
    musicImg.src = `img/${song[indexNumb -1].img}.jpg`
    mainAudio.src = `audio/${song[indexNumb -1].src}.mp3`
}

//play music
function  PlayMusic(){
    wrapper.classList.add("paused")
    mainAudio.play()
    pausePlayBtn.src = `svg/pausebtn.svg`
}
//paused music
function  pauseMusic(){
    wrapper.classList.remove("paused")
    mainAudio.pause()
    pausePlayBtn.src = `svg/1718976.svg`
}
function nextMusic(){
    musicIndex++
    musicIndex > song.length ?  musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex)
    PlayMusic()
    playingNow()
}
function prevMusic() {
    musicIndex--
    musicIndex < 1 ?  musicIndex = song.length : musicIndex = musicIndex
    loadMusic(musicIndex)
    PlayMusic() 
    playingNow()
}
pausePlayBtn.addEventListener('click', ()=>{
    const isPlayMusic = wrapper.classList.contains("paused")
    isPlayMusic ? pauseMusic() : PlayMusic()
    playingNow()
})

//next music
nextBtn.addEventListener('click', ()=>{
    nextMusic()
})
//prev music
prevBtn.addEventListener('click', ()=>{
    prevMusic()
})
mainAudio.addEventListener('timeupdate', (e)=>{
   const currentTime = e.target.currentTime
   const duration = e.target.duration
   let progressWidth = (currentTime / duration)*100
   progressBar.style.width = `${progressWidth}%`



   let musicCurrentTime = wrapper.querySelector('.current')
   let musicDuration= wrapper.querySelector('.duration')


   mainAudio.addEventListener('loadeddata', ()=>{
    //updating audio duration 
    let audioDuration = mainAudio.duration
    let totalMin = Math.floor(audioDuration / 60)
    let totalSec = Math.floor(audioDuration % 60)
    if (totalSec < 10) {
        totalSec = `0${totalSec}`
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`
   })
   //updating audio current time
   let currentMin = Math.floor(currentTime / 60)
   let currentSec = Math.floor(currentTime % 60)
   if (currentSec < 10) {
       currentSec = `0${currentSec}`
   }
   musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})

//ability to click the progrressbar
progressArea.addEventListener('click', (e)=>{
    let progressWidthVal = progressArea.clientWidth
    let clickedOffsetX = e.offsetX
    let songDuration = mainAudio.duration
    mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration
    PlayMusic()
})
mainAudio.addEventListener('ended', ()=>{
   nextMusic()
   playingNow()
})


const ulTag = document.querySelector("ul")
for (let i = 0; i < song.length; i++) {
    let liTag = `
    <li li-index="${i + 1}">
            <div class="row">
                <span>${song[i].Title}</span>
                <p>${song[i].artiste}</p>
            </div>
            <audio  class="${song[i].src}" src="audio/${song[i].src}.mp3"></audio>
            <span id="${song[i].src}" class="audio-description"></span>
        </li>
    `
    ulTag.insertAdjacentHTML("beforeend", liTag)
    let LiAudioDuration = ulTag.querySelector(`#${song[i].src}`)
    let LiAudioTag = ulTag.querySelector(`.${song[i].src}`)

    LiAudioTag.addEventListener('loadeddata', ()=>{
        let audioDuration = LiAudioTag.duration
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60)
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        LiAudioDuration.innerText = `${totalMin}:${totalSec}`
        LiAudioDuration.setAttribute("t-duration",  `${totalMin}:${totalSec}` )
    })
}

//clicking particular songs clicked to play
const allLiTags = ulTag.querySelectorAll('li')
function playingNow() {
    for (let d = 0; d < allLiTags.length; d++) {
        let audioTag = allLiTags[d].querySelector('.audio-description')
        //removing playing class from other li
        if (allLiTags[d].classList.contains("playing")){
            allLiTags[d].classList.remove("playing")
            //getting the duration of the song
            let adDuration = audioTag.getAttribute('t-duration')
            audioTag.innerText = adDuration
        }
        //adding playing class from other li
        if (allLiTags[d].getAttribute("li-index") == musicIndex) {
            allLiTags[d].classList.add("playing")
            audioTag.innerText = "playing"
        }
        allLiTags[d].setAttribute("onclick"," clicked(this)")
    }
}

function clicked(element) {
    //getting li index of particular clicked li tag
    let getLiIndex =element.getAttribute("li-index")
    musicIndex = getLiIndex
    loadMusic(musicIndex)
    PlayMusic()
    playingNow() 
}
