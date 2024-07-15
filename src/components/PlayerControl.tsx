import {
  useSpotifyPlayer,
  useWebPlaybackSDKReady,
  usePlayerDevice,
} from "react-spotify-web-playback-sdk";
import { Button } from "./ui/button";
import { useEffect } from "react";

const PlayerControl = () => {
  const player = useSpotifyPlayer();

  const handlePreviousTrack = () => {
    if (player) {
      player.previousTrack();
    }
  };

  const handleTogglePlay = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const handleNextTrack = () => {
    if (player) {
      player.nextTrack();
    }
  };

  const handlePause = () => {
    if (player) {
      player.pause();
    }
  };

  const handleResume = () => {
    if (player) {
      player.resume();
    }
  };

  const handleConnect = () => {
    if (player) {
      player.connect();
    }
  };

  const handleDisconnect = () => {
    if (player) {
      player.disconnect();
    }
  };

  const WebPlaybackSDKReady = useWebPlaybackSDKReady();

  const playerDevice = usePlayerDevice();

  useEffect(() => {
    if (playerDevice?.device_id === undefined) return;

    fetch(`https://api.spotify.com/v1/me/player`, {
      method: "PUT",
      body: JSON.stringify({
        device_ids: [playerDevice.device_id],
        play: false,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  }, [playerDevice?.device_id]);

  return (
    <div>
      {WebPlaybackSDKReady ? <div>Connected</div> : <div>Disconnected</div>}
      {playerDevice?.device_id === undefined ? (
        <div>No device id</div>
      ) : (
        <div>{playerDevice?.device_id}</div>
      )}
      <div>
        <Button onClick={handlePreviousTrack}>
          <code>player.previousTrack</code>
        </Button>
        <Button onClick={handleTogglePlay}>
          <code>player.togglePlay</code>
        </Button>
        <Button onClick={handleNextTrack}>
          <code>player.nextTrack</code>
        </Button>
        <Button onClick={handlePause}>
          <code>player.pause</code>
        </Button>
        <Button onClick={handleResume}>
          <code>player.resume</code>
        </Button>
        <Button onClick={handleConnect}>
          <code>player.connect</code>
        </Button>
        <Button onClick={handleDisconnect}>
          <code>player.disconnect</code>
        </Button>
      </div>
    </div>
  );
};

export default PlayerControl;
