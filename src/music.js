let player = null;
let ready = false;
let wanted = false;
let resumeOnVisible = false;
let onChange = () => {};

function setPlaying(value) {
  onChange(value);
}

export function initMusic({ youtubeId, startAt = 0, volume = 60 }, { onStateChange } = {}) {
  if (!youtubeId) return false;
  onChange = onStateChange ?? onChange;

  const host = document.createElement('div');
  host.className = 'yt-host';
  host.setAttribute('aria-hidden', 'true');
  host.innerHTML = '<div id="yt-player"></div>';
  document.body.append(host);

  window.onYouTubeIframeAPIReady = () => {
    player = new window.YT.Player('yt-player', {
      width: 200,
      height: 200,
      videoId: youtubeId,
      playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1, rel: 0, start: startAt },
      events: {
        onReady() {
          ready = true;
          player.setVolume(volume);
          if (wanted) player.playVideo();
        },
        onStateChange({ data }) {
          const { PLAYING, ENDED } = window.YT.PlayerState;
          if (data === ENDED) {
            player.seekTo(startAt, true);
            player.playVideo();
            return;
          }
          setPlaying(data === PLAYING);
        },
      },
    });
  };

  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  document.head.append(script);

  document.addEventListener('visibilitychange', () => {
    if (!ready) return;
    if (document.hidden && wanted) {
      resumeOnVisible = true;
      player.pauseVideo();
    } else if (!document.hidden && resumeOnVisible) {
      resumeOnVisible = false;
      player.playVideo();
    }
  });
  return true;
}

export function playMusic() {
  wanted = true;
  if (ready) player.playVideo();
}

export function pauseMusic() {
  wanted = false;
  if (ready) player.pauseVideo();
}

export const musicWanted = () => wanted;
