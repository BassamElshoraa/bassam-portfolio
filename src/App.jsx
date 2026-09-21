import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ArticlePage from "./portfolio/ArticlePage.jsx";
import { ContentProvider, ThemeProvider } from "./portfolio/context.jsx";
import Dashboard from "./portfolio/Dashboard.jsx";
import Home from "./portfolio/Home.jsx";
import ProjectPage from "./portfolio/ProjectPage.jsx";
import Projects from "./portfolio/Projects.jsx";
import { Shell } from "./portfolio/Shell.jsx";

function NotFound() {
  return (
    <section className="inner-page section-pad error-state">
      <span className="eyebrow">404</span>
      <h1>This page does not exist.</h1>
      <Link className="button" to="/">Return home</Link>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
      <ThemeProvider>
        <ContentProvider>
          <Routes>
            <Route element={<Shell />}>
              <Route index element={<Home />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:slug" element={<ProjectPage />} />
              <Route path="articles/:slug" element={<ArticlePage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="dashboard" element={<Dashboard />} />
          </Routes>
        </ContentProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
