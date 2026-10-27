import { PlayerProvider } from "./context/player";
import { UIProvider } from "./context/ui";
import { Nav } from "./components/Nav";
import { Hero, Marquee } from "./components/Hero";
import { News } from "./components/News";
import { Profile } from "./components/Profile";
import { Discography } from "./components/Discography";
import { Videos } from "./components/Videos";
import { Anime } from "./components/Anime";
import { Denon } from "./components/Denon";
import { Goods } from "./components/Goods";
import { Live } from "./components/Live";
import { FanZone } from "./components/FanZone";
import { Footer } from "./components/Footer";
import { PlayerBar } from "./components/PlayerBar";

export default function App() {
  return (
    <PlayerProvider>
      <UIProvider>
        <div className="grain min-h-screen overflow-x-clip bg-abyss text-foam">
          <Nav />
          <main>
            <Hero />
            <Marquee />
            <News />
            <Profile />
            <Discography />
            <Videos />
            <Anime />
            <Denon />
            <Goods />
            <Live />
            <FanZone />
          </main>
          <Footer />
          <PlayerBar />
        </div>
      </UIProvider>
    </PlayerProvider>
  );
}
