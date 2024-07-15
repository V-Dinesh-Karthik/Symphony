import axios from "axios";
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Slider } from "./ui/slider";

const spotifyApiUrl = "https://api.spotify.com/v1";

const sendDeviceIdToSpotify = async (device_id: string, tk: string) => {
  try {
    await axios.put(
      "https://api.spotify.com/v1/me/player",
      { device_ids: [device_id] },
      {
        headers: {
          Authorization: `Bearer ${tk}`,
        },
      }
    );

    console.log("Device ID sent to Spotify successfully.");
  } catch (error) {
    console.error("Error sending device ID to Spotify:", error);
  }
};

interface track {
  name: "";
  album: {
    images: [{ url: "" }];
  };
  artists: [{ name: "" }];
}

const Playback = () => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [currentTrack, setTrack] = useState<track | null>(null);
  const [is_paused, setPaused] = useState<boolean>(false);
  const [is_active, setActive] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);

  const { state, dispatch } = useStateProvider();

  const { token } = state;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Symphony Playback",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        dispatch({ type: ActionTypes.SET_DEVICE, payload: device_id });
        sendDeviceIdToSpotify(device_id, token as string);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        console.log("Player state changed: ", state);

        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();

      // player.addListener("ready", () => {
      //   player.activateElement();
      //   setActive(true);
      // });
    };
  }, [token, dispatch]);

  const handleTogglePlay = () => {
    if (player) {
      if (is_paused) {
        player.resume();
      } else {
        player.pause();
      }
    }
  };

  const handlePrev = () => {
    if (player) {
      player.previousTrack();
    }
  };

  const handleNext = () => {
    if (player) {
      player.nextTrack();
    }
  };

  const handleRepeat = async () => {
    let { repeat } = state;
    repeat = repeat === "off" ? "track" : "off";
    const accessToken = token as string;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    await axios.put(
      `${spotifyApiUrl}/me/player/repeat?state=${repeat}`,
      {},
      { headers }
    );
    dispatch({ type: ActionTypes.SET_REPEAT, payload: repeat });
  };

  const handleShuffle = async () => {
    const { shuffle } = state;
    const accessToken = token as string;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    await axios.put(
      `${spotifyApiUrl}/me/player/shuffle?state=${!shuffle}`,
      {},
      {
        headers,
      }
    );
    dispatch({ type: ActionTypes.SET_SHUFFLE, payload: !shuffle });
  };

  const handleVolumeChange = async (newVolume: number) => {
    try {
      const accessToken = token as string;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      await axios.put(
        `${spotifyApiUrl}/me/player/volume`,
        {},
        { params: { volume_percent: newVolume }, headers }
      );
      setVolume(newVolume);
    } catch (error) {
      console.error("Error updating volume:", error);
    }
  };

  return (
    <div className="flex justify-between items-center bg-lime-200 pl-2 pr-2 ">
      {/* CurrentlyPlaying */}
      <div className="flex space-x-2 items-center ">
        <img src={currentTrack?.album.images[0].url} className="w-20 h-20" />
        <div className="flex flex-col">
          <p>{currentTrack?.name}</p>
          <p>{currentTrack?.artists[0].name}</p>
        </div>
      </div>
      {/* Music Control */}
      <div>
        <button onClick={handleShuffle}>
          <Shuffle />
        </button>
        <button onClick={handlePrev}>
          <SkipBack />
        </button>
        <button onClick={handleTogglePlay}>
          {is_paused ? <Play /> : <Pause />}
        </button>
        <button onClick={handleNext}>
          <SkipForward />
        </button>
        <button onClick={handleRepeat}>
          <Repeat />
        </button>
        <div></div>
      </div>
      {/* Volume */}
      <div className="flex items-center space-x-2">
        <div>
          {volume === 0 ? (
            <VolumeX />
          ) : volume <= 35 ? (
            <Volume1 />
          ) : (
            <Volume2 />
          )}
        </div>
        <div className="w-44 pr-10">
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            onValueChange={(v) => handleVolumeChange(v[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default Playback;
