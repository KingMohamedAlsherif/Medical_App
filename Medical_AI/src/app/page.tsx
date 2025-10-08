import Link from "next/link";
import TopHeader from "@/app/components/TopHeader";
import LogoHead from "@/app/components/LogoHead";
import FullHeader from "@/app/components/FullHeader";
import Navibar from "@/app/components/NaviBar";
import LandingPage from "@/app/components/LandingPage";
import HomePage from "@/app/components/HomePage";

export default function Home() {
  return (
  <main>
	{/* <FullHeader />
	<Navibar />
	<LandingPage />
	<h1>Banana Ooyu</h1> */}

	<HomePage />
</main>
  );
}
