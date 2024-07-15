import { Button } from "@/components/ui/button";
import Spotify from "../assets/spotify.png";

const handleClick = () => {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const spotifyAccountsUrl = import.meta.env.VITE_SPOTIFY_ACCOUNTS_URL;

  const scope = [
    "streaming",
    "user-read-private",
    "user-read-email",
    "user-modify-playback-state",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-top-read",
    "playlist-read-private",
    "playlist-read-collaborative",
  ];
  window.location.href = `${spotifyAccountsUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope.join(
    " "
  )}&response_type=token&show_dialog=true`;
};

const Login = () => {
  return (
    <div>
      <div className="h-dvh flex justify-center items-center">
        <Button
          variant={"ghost"}
          className="flex space-x-2"
          onClick={handleClick}
        >
          <img src={Spotify} className="w-9 h-9" />
          <span>Login with Spotify!</span>
        </Button>
      </div>
    </div>
  );
};

export default Login;
