<template>
    <div class="video-container" @mousemove="showControls" @mouseleave="hideControls">
      <video ref="video" src="../../../assets/videos/video1.mp4" @timeupdate="updateProgress" @loadedmetadata="setDuration" @play="hideControls" @pause="showControls"></video>
      
      <div class="controls" :class="{ 'hidden': controlsHidden }">
        <button @click="togglePlay">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <input type="range" v-model="progress" @input="seek" min="0" :max="duration" step="0.1" />
        <button @click="toggleFullScreen">
          <i class="fas fa-expand"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    setup() {
      const video = ref(null);
      const isPlaying = ref(false);
      const progress = ref(0);
      const duration = ref(0);
      const volume = ref(1);
      const controlsHidden = ref(false);
      
      const togglePlay = () => {
        if (video.value.paused) {
          video.value.play();
          isPlaying.value = true;
          hideControls();
        } else {
          video.value.pause();
          isPlaying.value = false;
          showControls();
        }
      };
      
      const updateProgress = () => {
        progress.value = video.value.currentTime;
      };
      
      const seek = () => {
        video.value.currentTime = progress.value;
      };
      
      const setDuration = () => {
        duration.value = video.value.duration;
      };
      
      const toggleFullScreen = () => {
        if (video.value.requestFullscreen) {
          video.value.requestFullscreen();
        }
      };
      
      const changeVolume = () => {
        video.value.volume = volume.value;
      };
      
      const showControls = () => {
        controlsHidden.value = false;
      };
      
      const hideControls = () => {
        if (isPlaying.value) {
          controlsHidden.value = true;
        }
      };
      
      watch(volume, changeVolume);
      
      return {
        video,
        isPlaying,
        progress,
        duration,
        volume,
        controlsHidden,
        togglePlay,
        updateProgress,
        seek,
        setDuration,
        toggleFullScreen,
        changeVolume,
        showControls,
        hideControls
      };
    }
  };
  </script>
  
  <style scoped>
  .video-container {
    position: relative;
    width: 90%;
    margin: auto;
    background: black;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  }
  video {
    width: 100%;
    display: block;
    border-radius: 12px;
  }
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    bottom: 0;
    width: 100%;
    transition: opacity 0.3s;
    border-radius: 0 0 12px 12px;
    opacity: 1;
  }
  .controls.hidden {
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }
  .controls button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 20px;
    padding: 5px 10px;
  }
  .controls button:hover {
    color: var(--cor-secundaria);
  }
  .controls input[type="range"] {
    flex: 1;
    margin: 0 10px;
    cursor: pointer;
  }
  </style>