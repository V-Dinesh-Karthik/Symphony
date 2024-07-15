import { useEffect } from "react";
import "./App.css";
import Login from "./pages/Login";
import { useBearState } from "./utils/zustand";
import Playback from "./components/Playback";

function App() {
  const token = useBearState((state) => state.token);
  const setToken = useBearState((state) => state.setToken);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const tk = hash.substring(1).split("&")[0].split("=")[1];
      if (tk) {
        history.replaceState(null, document.title, window.location.pathname);
        setToken(tk);
      }
    }
  }, [setToken]);

  if (token) {
    return (
      <>
        <Playback />
      </>
    );
  } else {
    return <Login />;
  }
}

export default App;
