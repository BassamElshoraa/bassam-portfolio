import { useEffect, useMemo, useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import {
  FaGithub,
  FaLink,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaCode,
  FaLightbulb,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import { useApp } from "@/context/AppContext";

// function CustomBackHandler() {
//   const { setActiveProtfolio } = useOutletContext();

//   const handlePopState = useCallback(() => {
//     setActiveProtfolio("portfolio");
//   }, [setActiveProtfolio]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     handlePopState();
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [handlePopState]);

//   return null;
// }

export default function ProjectDetails() {
  const { setActivePage } = useApp();

  const { project } = useLoaderData();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // إصلاح مسار الصورة
  const getImagePath = (imagePath) => {
    if (!imagePath) return "/fallback-image.jpg";

    if (imagePath.startsWith("image/")) {
      return `/${imagePath}`;
    }

    if (imagePath.includes("public/")) {
      return imagePath.replace("public/", "");
    }

    return imagePath;
  };

  // إنشاء iframe للعرض بناءً على نوع المشروع
  const projectIframe = useMemo(() => {
    if (!project) return null;

    if (project.demo && project.demo.includes("powerbi.com")) {
      return (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl z-10 pointer-events-none"></div>
          <iframe
            src={project.demo}
            className="w-full h-[600px] rounded-2xl border border-gray-700 shadow-2xl transition-all duration-300 group-hover:shadow-blue-500/20"
            loading="lazy"
            title={`${project.title} Dashboard`}
          />
        </div>
      );
    }

    return null;
  }, [project]);

  // عرض محتوى بديل للمشاريع غير Power BI
  const projectContent = useMemo(() => {
    if (!project) return null;

    if (!projectIframe) {
      return (
        <div className="relative bg-light rounded-2xl p-8 text-center drop-shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-dark drop-shadow-lg rounded-full flex items-center justify-center">
              {project.github ? (
                <FaCode className="w-8 h-8 text-white" />
              ) : (
                <FaLightbulb className="w-8 h-8 text-white" />
              )}
            </div>

            <h4 className="text-xl font-semibold mb-4 text-dark">
              {project.github ? "Source Code Available" : "Project Overview"}
            </h4>

            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              {project.github
                ? "This project contains well-structured code files. Visit the GitHub repository to explore the source code and implementation details."
                : "This project showcases unique features and capabilities. Contact me for more details about the implementation."}
            </p>

            {project.github && (
              <Link
                to={project.github}
                target="_blank"
                className="inline-flex items-center gap-3 px-6 py-3 bg- text-dark rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                <FaGithub className="w-5 h-5" />
                <span className="font-medium">View Source Code</span>
                <FaExternalLinkAlt className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      );
    }

    return projectIframe;
  }, [project, projectIframe]);

  if (!project) return <Loader />;

  return (
    <>
      {/* Meta Tags */}
      <>
        <meta name="description" content={project.description} />
        <title>{project.title} | Portfolio</title>
        <meta property="og:title" content={`${project.title} | Portfolio`} />
        <meta property="og:description" content={project.description} />
        <meta property="og:image" content={getImagePath(project.image)} />
      </>

      {/* <CustomBackHandler /> */}

      {/* min-h-screen bg-gradient-to-b from-charcoal-black to-jet py-8 */}
      <section className="border rounded-2xl overflow-hidden py-8 bg-charcoal-black border-gray-border min-[1250px]:flex-[3]">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              onClick={() => setActivePage("portfolio")}
              className="group inline-flex text-light font-medium items-center gap-3 px-6 py-3 bg-dark backdrop-blur-sm border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:border-vegas-gold"
            >
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="">Back to Projects</span>
            </Link>

            {(project.github || project.demo) && (
              <div className="flex gap-3">
                {project.github && (
                  <Link
                    to={project.github}
                    target="_blank"
                    className="inline-flex items-center text-sm font-medium gap-2 px-4 py-2 bg-dark backdrop-blur-sm border border-gray-700 rounded-xl text-light hover:bg-gray-700/50 transition-all duration-300 hover:border-green-400"
                  >
                    <FaGithub className="w-4 h-4" />
                    <span className="">Code</span>
                  </Link>
                )}
                {project.demo && !project.demo.includes("powerbi.com") && (
                  <Link
                    to={project.demo}
                    target="_blank"
                    className="inline-flex items-center font-medium gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-500/30 rounded-xl text-light hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    <FaExternalLinkAlt className="w-4 h-4" />
                    <span className="text-sm">Live Demo</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="animate-pop">
            {/* Project Image */}
            {project.image && (
              <div className="relative mb-8 group">
                <div className="relative overflow-hidden rounded-2xl border border-gray-700 shadow-2xl">
                  <img
                    src={getImagePath(project.image)}
                    alt={project.title}
                    loading="lazy"
                    className={`w-full h-64 md:h-96 object-cover transition-all duration-700 ${
                      imageLoaded
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/fallback-image.jpg";
                      e.currentTarget.alt = "Image not available";
                    }}
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60"></div>

                  {/* Title on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                      {project.title}
                    </h1>
                    {project.subtitle && (
                      <p className="text-xl text-gray-300 font-light">
                        {project.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Project Grid */}
            <div className="flex flex-col gap-8">
              {/* Main Content - 2/3 width */}
              <div className="lg:col-span-2 space-y-8">
                {/* Project Display */}

                {/* Description */}
                {project.description && (
                  <div className="bg-light backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                      <h3 className="text-xl font-semibold text-dark">
                        Project Overview
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {project.description}
                    </p>
                  </div>
                )}

                {/* Sidebar - 1/3 width */}
                <div className="flex max-md:flex-col gap-2 justify-between">
                  {/* Skills & Technologies */}
                  {project.badges && project.badges.length > 0 && (
                    <div className="bg-light backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-6 bg-yellow-crayola rounded-full"></div>
                        <h3 className="text-xl font-semibold text-dark">
                          Technologies Used
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {project.badges.map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-dark border border-gray-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:scale-105"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Links */}
                  {(project.github || project.demo) && (
                    <div className="bg-light backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-6 bg-yellow-crayola rounded-full"></div>
                        <h3 className="text-xl font-semibold text-dark">
                          Project Links
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {project.github && (
                          <Link
                            to={project.github}
                            target="_blank"
                            className="flex items-center gap-3 p-4 bg-dark rounded-xl text-white hover:text-dark hover:bg-light border border-dark transition-all duration-300 group"
                          >
                            <FaGithub className="w-5 h-5" />
                            <span className="font-medium flex-1">
                              GitHub Repository
                            </span>
                            <FaExternalLinkAlt className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        )}
                        {project.demo &&
                          !project.demo.includes("powerbi.com") && (
                            <Link
                              to={project.demo}
                              target="_blank"
                              className="flex items-center gap-3 p-4 bg-dark border border-blue-500/30 rounded-xl text-white hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 group"
                            >
                              <FaLink className="w-5 h-5 text-blue-400" />
                              <span className="font-medium flex-1">
                                Live Demo
                              </span>
                              <FaExternalLinkAlt className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {/* <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h3 className="text-xl font-semibold text-white">
                      Project Info
                    </h3>
                  </div>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="font-medium">Type</span>
                      <span className="text-white">
                        {project.type || "Web Application"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="font-medium">Status</span>
                      <span className="text-green-400 font-medium">
                        Completed
                      </span>
                    </div>
                    {project.date && (
                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium">Date</span>
                        <span className="text-white">{project.date}</span>
                      </div>
                    )}
                  </div>
                </div> */}
                </div>

                <div className="bg-light rounded-2xl drop-shadow-lg">
                  {projectContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// import { useEffect, useMemo, useCallback } from "react";
// import { useLoaderData, useOutletContext, Link } from "react-router-dom";
// import { FaGithub, FaLink } from "react-icons/fa";
// import Loader from "../../components/Loader";

// function CustomBackHandler() {
//   const { setActiveProtfolio } = useOutletContext();

//   const handlePopState = useCallback(() => {
//     setActiveProtfolio("portfolio");
//   }, [setActiveProtfolio]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });

//     handlePopState();

//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [handlePopState]);

//   return null;
// }

// export default function ProjectDetails() {
//   const { setActiveProtfolio } = useOutletContext();
//   const { project } = useLoaderData();

//   // إنشاء iframe للعرض بناءً على نوع المشروع
//   const projectIframe = useMemo(() => {
//     if (!project) return null;

//     // إذا كان المشروع يحتوي على رابط demo (Power BI)
//     if (project.demo && project.demo.includes("powerbi.com")) {
//       return (
//         <iframe
//           src={project.demo}
//           className="w-full h-[800px] rounded-2xl"
//           loading="lazy"
//           title={`${project.title} Dashboard`}
//         />
//       );
//     }

//     // إذا كان المشروع يحتوي على رابط GitHub (للملفات البرمجية)
//     if (project.github) {
//       // تحويل رابط GitHub إلى رابط nbviewer للملفات البرمجية
//       const githubPath = project.github.replace("https://github.com/", "");
//       const nbviewerUrl = `https://nbviewer.jupyter.org/github/${githubPath}`;

//       return (
//         <iframe
//           src={nbviewerUrl}
//           loading="lazy"
//           width="95%"
//           className="mx-auto rounded-2xl h-[600px] max-lg:h-[500px] min-[1250px]:h-[800px]"
//           height="800px"
//           title={`${project.title} Code`}
//         />
//       );
//     }

//     return null;
//   }, [project]);

//   // إنشاء iframes إضافية للملفات البرمجية إذا كانت متوفرة
//   const additionalIframes = useMemo(() => {
//     if (!project || !project.additionalFiles) return [];

//     return project.additionalFiles.map((file, index) => {
//       if (file.url.includes("powerbi.com")) {
//         return (
//           <iframe
//             key={index}
//             src={file.url}
//             className="w-full h-[800px] rounded-2xl"
//             loading="lazy"
//             title={`${project.title} - ${file.name || `File ${index + 1}`}`}
//           />
//         );
//       } else {
//         // افتراض أن الملف برمجي وعرضه عبر nbviewer
//         const githubPath = file.url.replace("https://github.com/", "");
//         const nbviewerUrl = `https://nbviewer.jupyter.org/github/${githubPath}`;

//         return (
//           <iframe
//             key={index}
//             src={nbviewerUrl}
//             loading="lazy"
//             width="95%"
//             className="mx-auto rounded-2xl h-[600px] max-lg:h-[500px] min-[1250px]:h-[800px]"
//             height="800px"
//             title={`${project.title} - ${file.name || `Code ${index + 1}`}`}
//           />
//         );
//       }
//     });
//   }, [project]);

//   console.log("project: ", project);
//   if (!project) return <Loader />;

//   return (
//     <>
//       <>
//         <meta name="description" content={project.description} />
//         <title>{project.title} | Portfolio</title>
//         <meta property="og:title" content={`${project.title} | Portfolio`} />
//         <meta property="og:description" content={project.description} />
//         <meta property="og:image" content={project.image} />
//       </>

//       <CustomBackHandler />

//       <section className="w-full animate-pop">
//         <div className="flex mb-6">
//           <Link
//             to="/"
//             onClick={() => setActiveProtfolio("portfolio")}
//             className="inline-flex items-center px-3.5 py-1.5 text-xs border border-bittersweet-shimmer rounded-full hover:text-vegas-gold transition-all duration-200"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-3.5 h-3.5 mr-1.5"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
//               />
//             </svg>
//             All projects
//           </Link>
//         </div>

//         <div className="relative border rounded-2xl overflow-hidden bg-charcoal-black border-gray-border">
//           {project.image && (
//             <img
//               src={project.image}
//               alt={project.title}
//               loading="lazy"
//               className="w-full rounded-2xl border border-gray-200"
//             />
//           )}

//           <div className="p-6">
//             <h3 className="text-3xl font-semibold mb-4">{project.title}</h3>

//             <div className="space-y-10">
//               {/* العرض الرئيسي للمشروع */}
//               {projectIframe}

//               {/* العروض الإضافية إذا كانت متوفرة */}
//               {additionalIframes.length > 0 && additionalIframes}

//               {/* إذا لم يكن هناك أي iframe متاح، عرض رسالة */}
//               {!projectIframe && additionalIframes.length === 0 && (
//                 <div className="text-center py-10">
//                   <p className="text-gray-500">
//                     No preview available for this project
//                   </p>
//                 </div>
//               )}
//             </div>

//             {(project.github || project.demo) && (
//               <div className="mt-8">
//                 <h3 className="text-sm uppercase font-mono mb-2">
//                   Project links
//                 </h3>
//                 <div className="flex justify-center gap-4">
//                   {project.github && (
//                     <Link to={project.github} target="_blank">
//                       <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full text-sm text-gray-900 hover:text-ds_blue hover:underline">
//                         <FaGithub className="w-5 h-5" />
//                         GitHub
//                       </span>
//                     </Link>
//                   )}
//                   {project.demo && (
//                     <Link to={project.demo} target="_blank">
//                       <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full text-sm text-gray-900 hover:text-ds_blue hover:underline">
//                         <FaLink className="w-5 h-5" />
//                         Demo
//                       </span>
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             )}

//             {project.badges && project.badges.length > 0 && (
//               <div className="mt-8">
//                 <h3 className="text-sm uppercase font-mono mb-2">Skills</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {project.badges.map((skill, i) => (
//                     <span
//                       key={i}
//                       className="px-3 py-1 bg-jet text-white rounded-full text-sm"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {project.description && (
//               <div className="mt-8">
//                 <h3 className="text-sm uppercase font-mono mb-2">
//                   About this project
//                 </h3>
//                 <p className="text-md max-w-5xl">{project.description}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// import { useEffect, useMemo, useCallback } from "react";
// import { useLoaderData, useOutletContext, Link } from "react-router-dom";
// import { FaGithub, FaLink } from "react-icons/fa";
// import Loader from "../../components/Loader";

// function CustomBackHandler() {
//   const { setActiveProtfolio } = useOutletContext();

//   const handlePopState = useCallback(() => {
//     setActiveProtfolio("portfolio");
//   }, [setActiveProtfolio]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });

//     handlePopState();

//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, [handlePopState]);

//   return null;
// }

// export default function ProjectDetails() {
//   const { setActiveProtfolio } = useOutletContext();

//   const { project } = useLoaderData();

//   const codeIframes = useMemo(() => {
//     return (project && project?.codeFiles ? project?.codeFiles : []).map(
//       (file, i) => {
//         const pathPart = file?.url?.split("github.com")[1];
//         const src = pathPart.includes("powerbi.com/view")
//           ? pathPart
//           : `https://nbviewer.jupyter.org/github${pathPart}`;
//         return (
//           <iframe
//             key={i}
//             src={src}
//             loading="lazy"
//             width="95%"
//             className="mx-auto rounded-2xl h-[600px] max-lg:h-[500px] min-[1250px]:h-[800px]"
//             height="800px"
//           />
//         );
//       }
//     );
//   }, [project]);

//   console.log("project: ", project);
//   if (project === null) return <Loader />;

//   return (
//     <>
//       <>
//         <meta name="description" content={project?.description} />
//         <title>{project?.title} | Portfolio</title>
//         <meta property="og:title" content={`${project?.title} | Portfolio`} />
//         <meta property="og:description" content={project?.description} />
//         <meta property="og:image" content={project?.image} />
//       </>

//       <CustomBackHandler />

//       <section className="w-full animate-pop">
//         <div className="flex mb-6">
//           <Link
//             to="/"
//             onClick={() => setActiveProtfolio("portfolio")}
//             className="inline-flex items-center px-3.5 py-1.5 text-xs border border-bittersweet-shimmer rounded-full hover:text-vegas-gold transition-all duration-200"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-3.5 h-3.5 mr-1.5"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
//               />
//             </svg>
//             All projects
//           </Link>
//         </div>

//         <div className="relative border rounded-2xl overflow-hidden bg-charcoal-black border-gray-border">
//           {project?.image && (
//             <img
//               src={project?.image}
//               alt={project?.title}
//               loading="lazy"
//               decoding="async"
//               onError={(e) => {
//                 e.currentTarget.onerror = null;
//                 e.currentTarget.src = "/fallback-image.jpg";
//               }}
//               className="w-full rounded-2xl border border-gray-200"
//             />
//           )}

//           <div className="p-6">
//             <h3 className="text-3xl font-semibold mb-4">{project?.title}</h3>

//             <div className="space-y-10">
//               {codeIframes}

//               {project?.demoUrl && (
//                 <iframe
//                   src={project?.demoUrl}
//                   className="w-full h-[800px] rounded-2xl"
//                   loading="lazy"
//                 />
//               )}
//             </div>

//             {(project?.projectUrl || project?.demoUrl) && (
//               <div className="mt-8">
//                 <h3 className="text-sm uppercase font-mono mb-2">
//                   Project links
//                 </h3>
//                 <div className="flex justify-center gap-4">
//                   {project?.projectUrl && (
//                     <Link to={project?.projectUrl} target="_blank">
//                       <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full text-sm text-gray-900 hover:text-ds_blue hover:underline">
//                         <FaGithub className="w-5 h-5" />
//                         GitHub
//                       </span>
//                     </Link>
//                   )}
//                   {project?.demoUrl && (
//                     <Link to={project?.demoUrl} target="_blank">
//                       <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full text-sm text-gray-900 hover:text-ds_blue hover:underline">
//                         <FaLink className="w-5 h-5" />
//                         Demo
//                       </span>
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             )}

//             {project?.skills?.length > 0 && (
//               <div className="mt-8">
//                 <h3 className="text-sm uppercase font-mono mb-2">Skills</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {project?.skills.map((skill, i) => (
//                     <span
//                       key={i}
//                       className="px-3 py-1 bg-jet text-white rounded-full text-sm"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {project?.description && (
//               <div className="mt-8">
//                 <h3 className="text-sm uppercase font-mono mb-2">
//                   About this project
//                 </h3>
//                 <p className="text-md max-w-5xl">{project?.description}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
