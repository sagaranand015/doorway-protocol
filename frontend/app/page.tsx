import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import OfflineUsecase from "@/components/About/OfflineUsecase";
import OnlineUsecase from "@/components/About/OnlineUseCase";
import AllPlans from "@/components/AllPlans";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Plan from "@/components/Plan";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <Video />
      <Plan />
      <AllPlans />
      <OfflineUsecase />
      <OnlineUsecase />
      {/* <Brands /> */}
      {/* <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Pricing />
      <Blog />
      <Contact /> */}
    </>
  );
}
