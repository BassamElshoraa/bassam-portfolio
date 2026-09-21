import { Link } from "react-router";
import ContentIcons from "./components/ContentIcons";
import IconSocialMedia from "./components/IconSocialMedia";
import LogoAndTextSidebar from "./components/LogoAndTextSidebar";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

export default function Sidebar() {
  return (
    <aside className="relative color-and-padding-component w-80 max-w-full px-8 pb-8 pt-16 space-y-5 min-[1250px]:flex-1 max-[1250px]:w-full">
      <LogoAndTextSidebar />

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden space-y-5 ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <hr className="border-0 h-px bg-gray-border" />

        <ContentIcons />

        <hr className="border-0 h-px bg-gray-border" />

        <IconSocialMedia />
      </div>

      <Link
        className={
          "group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border-2 flex items-center gap-2 justify-center border-gray-700 bg-dark text-gray-300 hover:border-gray-500 hover:text-dark hover:bg-light"
        }
        target="_blank"
        to={`https://flowcv.com/resume/g5n4fcbmwj`}
      >
        <Download className="w-5 h-5" />
        Download Resume
      </Link>
    </aside>
  );
}
