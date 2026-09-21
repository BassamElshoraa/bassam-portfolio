import { useCallback, useMemo } from "react";
import About from "./about/About";
import Resume from "./resume/Resume";
import Portfolio from "./portfolio/Portfolio";
import Blog from "./blog/Blog";
import Contact from "./contact/Contact";
import Navbar from "../../components/navbar/Navbar";
// import { useOutletContext } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function LandingPage() {
  // const { activeProtfolio } = useOutletContext();
  const { activePage, setActivePage } = useApp();
  // const [activePage, setActivePage] = useState(activeProtfolio);

  const handleTab = useCallback(
    (tab) => {
      if (tab !== activePage) {
        setActivePage(tab);
      }
    },
    [activePage],
  );

  // const handleTab = useCallback(
  //   (tab) => {
  //     if (tab !== activePage) setActivePage(tab);
  //   },
  //   [activePage]
  // );

  const PageComponent = useMemo(() => {
    switch (activePage) {
      case "resume":
        return Resume;
      case "portfolio":
        return Portfolio;
      case "blog":
        return Blog;
      case "contact":
        return Contact;
      default:
        return About;
    }
  }, [activePage]);

  return (
    <>
      <>
        <title>{`Bassam El-Shoraa | ${activePage}`}</title>

        <meta name="og:title" content={`Bassam El-Shoraa | ${activePage}`} />

        <meta
          name="description"
          content="API reference for the <meta> component in React DOM"
        />

        <meta
          property="og:description"
          content="Welcome to my portfolio website. Discover my projects and skills."
        />

        <meta
          property="og:image"
          content="https://bassam-portfolio.netlify.app/image/personal/bassam-elshoraa-portrait-2026.png"
        />
      </>

      <div className="relative w-full overflow-x-hidden min-[1250px]:flex-[3]">
        <Navbar
          setActivePage={handleTab}
          activePage={activePage}
          className="block max-lg:hidden"
        />

        <div className="transition-opacity duration-300 opacity-100">
          <PageComponent />
        </div>
      </div>
      <Navbar
        setActivePage={handleTab}
        activePage={activePage}
        className="!fixed !top-[93%] py-0.5 left-0 w-full !gap-0.5 rounded-tl-2xl text-sm justify-between lg:hidden"
      />
    </>
  );
}
