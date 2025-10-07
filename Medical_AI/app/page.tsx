import Link from "next/link";
import TopHeader from "./components/TopHeader";
import LogoHead from "./components/LogoHead";
import FullHeader from "./components/FullHeader";
import Navibar from "./components/NaviBar";
import LandingPage from "./components/LandingPage";

export default function Home() {
  return (
  <main>
	<FullHeader />
	<Navibar />
	<LandingPage />
	<h1>Banana Ooyu</h1>
	{/* finish rest of landing page, add floating chat/whatsapp button component here */}
</main>
  );
}
