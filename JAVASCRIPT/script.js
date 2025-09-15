let audio = new Audio();
let playbar = document.querySelector(".playbar");
let song_info = document.querySelector(".SongInfo");

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

let CreateBrowse_btn = Array.from(document.getElementsByClassName("create-browse"));
CreateBrowse_btn.forEach(btn => {
    btn.addEventListener("click", () => {
        addSongs("Your-Library");
    });
});


let currFolder;
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/Assets/songs/${currFolder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let song = [];
    let as = Array.from(div.getElementsByTagName("a"));
    as.forEach(a => {
        if (a.href.endsWith(".mp3")) {
            song.push(a.href);
        }
    });
    return song;
}


let playlist = document.querySelector(".playlist");
const addSongs = async (folder) => {
    let Songs = await getSongs(folder);
    playlist.innerHTML = "";

    for (const song of Songs) {
        if (!playlist.style.backgroundColor) {
            playlist.style.background = "linear-gradient(to right, #8e2de2, #4a00e0)";
        }
        let Name = song.split("mixkit-")[1].replaceAll("-", " ").replaceAll("%20", "").toUpperCase();
        let song_name = Name.slice(0, Name.length - 4);
        playlist.innerHTML += `<div class="play-card flex align-items border pad-0 cursor-pointer">
                    <img id="music" src="Assets/Images/SVG/music.svg" alt="Music-icon">
                    <div class="details dx-small pad-0">
                        <div class="text-align">${song_name}</div>
                        <div class="text-align creator">Himanshu, The OG</div>
                    </div>
                    <div class="play flex align-items pad-0">
                        <div class="small">Play-now</div>
                        <div class="sizeup play-icon"><img class="invert increase" src="Assets/Images/SVG/play.svg" alt="Play"></div>
                    </div>
                </div>`;
    }


    // To Play the Song
    Array.from(playlist.querySelectorAll(".play-icon")).forEach(element => {
        element.addEventListener("click", () => {
            playbar.classList.remove("hide");
            let track = element.parentElement.previousElementSibling.firstElementChild.innerHTML.trim();
            console.log(track);
            PlayMusic(track);
            song_info.innerHTML = track;
        })
    })

}

// Listen to timeupdate function for currentTime and duration
let time = document.querySelector(".time");
audio.addEventListener("timeupdate", () => {
    time.innerHTML = `${secondsToMinutesSeconds(audio.currentTime)} / ${secondsToMinutesSeconds(audio.duration)}`;
    document.querySelector(".circle").style.left = (audio.currentTime / audio.duration) * 100 + "%";
});


const PlayMusic = async (track) => {
    play_btn.src = "Assets/Images/SVG/pause.svg";
    let songs = await getSongs(currFolder);
    audio.volume = 0.6;

    for (const song of songs) {
        let songName = song.split("mixkit-")[1].replaceAll("-", " ").replaceAll("%20", "").toUpperCase().trim();

        if (songName.includes(track)) {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }

            audio.src = song;
            audio.play()
            break;
        }
    }
}

// used to add functionality to the playbar
let play_btn = document.getElementById("play");
play_btn.addEventListener("click", () => {
    if (audio.paused) {
        play_btn.src = "Assets/Images/SVG/pause.svg";
        audio.play();
    }
    else {
        play_btn.src = "Assets/Images/SVG/play.svg";
        audio.pause();
    }
})

// seekbar for playing the song
let seekbar = document.querySelector(".seekbar");
seekbar.addEventListener("click", e => {
    document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    audio.currentTime = (e.offsetX / e.target.getBoundingClientRect().width) * audio.duration;
})

//Hamburger for larger size than phone
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".ham-btn").classList.toggle("toogle");

    if (document.querySelector(".ham-btn").classList.contains("toogle")) {
        document.querySelector(".ham-icon").src = "Assets/Images/SVG/hamburger.svg";
    }
    else {
        document.querySelector(".ham-icon").src = "Assets/Images/SVG/cross.svg";
    }
})

// Hamburger for phone
document.querySelector(".hamburger-Container").addEventListener("click", () => {
    document.querySelector(".ham-container").setAttribute("style", "display: block; left: 0%; transition: left 600ms");

    document.querySelector(".ham-container").querySelector(".close").addEventListener("click", () => {
        document.querySelector(".ham-container").setAttribute("style", "display: none; left: -110%; transition: left 600ms");
    })
})


// For your library button in smaller screen size
document.querySelector(".Library").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".a").innerHTML = `<img class="invert close cursor-pointer" src="Assets/Images/SVG/cross.svg" alt="Close">`;

    document.querySelector(".left").querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
        document.querySelector(".a").innerHTML = `<img class="invert close" src="Assets/Images/SVG/cross.svg" alt="Close">`;
    })
})

// Search icon for smaller size
document.querySelector(".search-tab").addEventListener("click", () => {
    if (window.getComputedStyle(document.querySelector(".none")).display === "block") {
        return;
    }
    document.querySelectorAll(".z").forEach(element => {
        element.classList.remove("none");
    })
    document.getElementsByTagName("form")[0].style.width = "254px";
    document.querySelector(".clear-all").style.display = "block";
    document.querySelector(".search-tab").classList.add("width");
    document.getElementsByTagName("nav")[0].style.overflowX = "hidden";
    document.querySelector(".Library").style.display = "none";
})

// Removing the content of search icon after clicking on it 
document.querySelector(".clear-all").addEventListener("click", (e) => {
    document.querySelectorAll(".z").forEach(element => {
        element.classList.add("none");
    })
    document.getElementsByTagName("form")[0].style.width = "auto";
    document.querySelector(".clear-all").style.display = "none";
    document.querySelector(".search-tab").classList.remove("width");
    document.querySelector(".Library").style.display = "block";
    e.stopPropagation();
})

// used for showing all the songs
document.querySelectorAll(".show-btn").forEach(element => {
    element.addEventListener("click", (e) => {
        if (element.innerHTML.trim() === "Show all") {
            let parent = element.parentElement.parentElement;
            parent.querySelector(".cards").setAttribute("style", "display: flex; flex-wrap: wrap; justify-content: center; overflow-x: visible;");
            element.innerHTML = "Close all";
            parent.querySelectorAll(".card").forEach(elem=>{
                elem.setAttribute("style","width: 260px;")
            })
            parent.querySelectorAll(".play-button").forEach(elem=>{
                elem.setAttribute("style","top: 219px; right: 25px;");
            })
            parent.querySelectorAll(".play-hover").forEach(elem=>{
                elem.setAttribute("style","top: 215px");
            })
        }
        else {
            let parent = element.parentElement.parentElement;
            parent.querySelector(".cards").setAttribute("style", "display: flex; flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto;");
            element.innerHTML = "Show all";
            parent.querySelectorAll(".card").forEach(elem=>{
                elem.setAttribute("style","width: 192px;")
            })
            parent.querySelectorAll(".play-button").forEach(elem=>{
                
                elem.setAttribute("style","top: 134px; right: 15px;");
            })
            parent.querySelectorAll(".play-hover").forEach(elem=>{
                elem.setAttribute("style","top: 130px");
            })
        }
    })
})

// Previous song will be played
document.getElementById("previous").addEventListener("click", () => {
    (async function () {
        let songs = await getSongs(currFolder);
        for (let song of songs) {
            if (audio.src.includes(song)) {
                let index = songs.indexOf(song);
                if (index - 1 >= 0) {
                    let track = songs[index - 1].split("mixkit-")[1].replaceAll("-", " ").replaceAll("%20", "").toUpperCase();
                    PlayMusic(track);
                    song_info.innerHTML = track.slice(0, track.length - 4);
                }
                else {
                    console.log("out of bounds");
                }
            }
        }
    })();
})

// The next song will be played
document.getElementById("next").addEventListener("click", () => {
    (async function () {
        let songs = await getSongs(currFolder);
        for (let song of songs) {
            if (audio.src.includes(song)) {
                let index = songs.indexOf(song);
                if (index + 1 < songs.length) {
                    let track = songs[index + 1].split("mixkit-")[1].replaceAll("-", " ").replaceAll("%20", "").toUpperCase();
                    PlayMusic(track);
                    song_info.innerHTML = track.slice(0, track.length - 4);
                }
                else {
                    console.log("out of bounds");
                }
            }
        }
    })();
})

// adjusts the volume of the song using the input range block
document.getElementById("volume").addEventListener("input", (e) => {
    const newVolume = e.target.value / 100;
    audio.volume = newVolume;

    if (newVolume === 0) {
        document.querySelector(".vol").src = `Assets/Images/SVG/mute.svg`;
    }
    else if (newVolume > 0 && newVolume < 0.5) {
        document.querySelector(".vol").src = `Assets/Images/SVG/partialVol.svg`;
    }
    else {
        document.querySelector(".vol").src = `Assets/Images/SVG/volume.svg`;
    }
});

document.querySelector(".vol").addEventListener("click", () => {
    if (document.querySelector(".vol").src.includes(`Assets/Images/SVG/volume.svg`) || document.querySelector(".vol").src.includes(`Assets/Images/SVG/partialVol.svg`)) {
        document.querySelector(".vol").src = `Assets/Images/SVG/mute.svg`;
        audio.volume = 0;
        document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;
    }
    else {
        document.querySelector(".vol").src = `Assets/Images/SVG/volume.svg`;
        audio.volume = 0.6;
         document.querySelector(".volume").getElementsByTagName("input")[0].value = 55;
    }
})

function displayCard(Image, Song_Name, Singer) {
    document.getElementsByClassName("cards")[0].innerHTML += `<div class="card trending-card">
                        <img src="Assets/Images/Image/${Image}.jpeg" alt="lorem">
                        <div class="white underline">${Song_Name}</div>
                        <div class="small small-width bold light-color underline">${Singer}</div>
                        <div class="play-button cursor-pointer">
                            <svg data-encore-id="icon" role="img" aria-hidden="true"
                                class="e-91000-icon e-91000-baseline" viewBox="0 0 24 24">
                                <path
                                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606">
                                </path>
                            </svg>
                        </div>
                    </div>`
}

displayCard("Image-1", "For A Reason", "Karan Aujla, Ikky");
displayCard("Image-2", "Arz Kiya Hai | Coke Studio Bharat", "Anuv Jain");
displayCard("Image-3", 'Oorum Blood - From "Dude"', "Sai Abhyankkar, Paal Dabba");
displayCard("Image-4", 'Deewaniyat-(From-"Ek Deewnane ki...', "Vishal Mishra, Kaushik-Guddu,kunnal Verma");
displayCard("Image-5", "Jutti Meri (LIVE) ", "Neha Bhasin");
displayCard("Image-8", "Sheriya", "ARJN, KDS, RONN");
displayCard("Image-9", "AZUL", "Guru Randhawa, Gurjit Gill");
displayCard("Image-10", "Pal Pal", "Rehman Ansar");
displayCard("Image-6", "Guzzara", "Josh Brar, Kumaar, Bunty Bains,...");
displayCard("Image-7", 'Badli Si Hawa Ha (From-"The Ba****ds...', "Anirudh Ravichander, Arijit Singh");

function displayArtist(Image, Artist_Name) {
    document.getElementsByClassName("cards")[1].innerHTML += `<div class="card artist-card">
                        <img src="Assets/Images/Image/${Image}.jpeg" alt="lorem">
                        <div class="white underline">${Artist_Name}</div>
                        <div class="small small-width bold light-color underline">Artist</div>
                        <div class="play-button cursor-pointer">
                            <svg data-encore-id="icon" role="img" aria-hidden="true"
                                class="e-91000-icon e-91000-baseline" viewBox="0 0 24 24">
                                <path
                                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606">
                                </path>
                            </svg>
                        </div>
                    </div>`
}

displayArtist("Artist-1", "Pritam");
displayArtist("Artist-2", "Pritam");
displayArtist("Artist-3", "Pritam");
displayArtist("Artist-4", "Pritam");
displayArtist("Artist-5", "Pritam");
displayArtist("Artist-6", "Pritam");
displayArtist("Artist-7", "Pritam");
displayArtist("Artist-8", "Pritam");
displayArtist("Artist-9", "Pritam");
displayArtist("Artist-10", "Pritam");


let card = Array.from(document.getElementsByClassName("card"));

card.forEach(cardCont => {
    let btn = cardCont.querySelector(".play-button");
    cardCont.addEventListener("mouseover", () => {
        btn.classList.add("play-hover");
    });
    cardCont.addEventListener("mouseout", () => {
        btn.classList.remove("play-hover");
    });
});

let trending_cards = Array.from(document.querySelectorAll(".trending-card"));
trending_cards.forEach(element => [
    element.addEventListener("click", async () => {
        let index = trending_cards.indexOf(element);
        let songs = await getSongs("Trending-Songs");
        let Name = songs[index].split("mixkit-")[1].replaceAll("-", " ").replaceAll("%20", "").toUpperCase();
        let song_name = Name.slice(0, Name.length - 4);
        playbar.classList.remove("hide");
        PlayMusic(song_name);
        song_info.innerHTML = song_name;
    })
])