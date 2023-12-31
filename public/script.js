

const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");

// import Peer from 'peerjs';
// const peer = new Peer();
const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
//   port: "3030", // Corrected to be a number, not a string
  port: "8888", // Corrected to be a number, not a string
});

myVideo.muted = true;
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    //this will fetch audio and video from the browser so basically its a promise
    video: true,
    audio: "true", //set these true
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      //   connectToNewUser(userId, stream);
      setTimeout(connectToNewUser, 1000, userId, stream);
    });
  });

peer.on("open", (id) => {
  // console.log(id);
  socket.emit("join-room", ROOM_ID, id);
});

// const connectToNewUser = (userId, stream) => {
//   // console.log(`user id ${userId}`);
//   const call = peer.call(userId, stream);
//   const video = document.createElement("video");
//   call.on("stream", (userVideoStream) => {
//     addVideoStream(video, userVideoStream);
//   });
// };
const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
let text = $('input')
// console.log(text);
$('html').keydown((e)=>{
    if(e.which == 13 && text.val().lenth!==0){
        console.log(text.val());
        socket.emit('message',text.val())
        text.val('')
    }
})
socket.on('create-message',(message)=>{
    $('ul').append(`<li class = "message"><b>user</b><br/>${message}</li>`)
    scrollToBottom()
})
const scrollToBottom = ()=>{
    var d = $('.main__chat_window')
    d.scrollTop(d.prop("scrollHeight"))
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }

  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i> 
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }