import { lazy, Suspense, useState, useMemo, useEffect } from "react";
import ProjectCardLoading from "./components/ProjectCardLoading";
import { useLoaderData } from "react-router-dom";
import { cn } from "@/lib/utils";
import PageLayout from "@/layout/PageLayout";
import { useApp } from "@/context/AppContext";

const ProjectCard = lazy(() => import("./components/ProjectCard"));

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { projects } = useLoaderData();
  const { filterSkill, setFilterSkill } = useApp();

  // مزامنة filterSkill مع activeFilter عند تحميل المشاريع أو تغيير الفلتر
  useEffect(() => {
    if (filterSkill && projects?.length) {
      const skillToId = {
        python: "python",
        sql: "sql",
        "power bi": "power-bi",
        excel: "excel",
      };
      const mappedId = skillToId[filterSkill.toLowerCase()];
      if (mappedId && mappedId !== activeFilter) {
        setActiveFilter(mappedId);
        // بعد التطبيق، نمسح filterSkill لمنع إعادة التطبيق مرة أخرى
        setFilterSkill(null);
      }
    }
  }, [filterSkill, projects, activeFilter, setFilterSkill]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const normalizeText = (text) => {
    return text?.toLowerCase().replace(/\s+/g, "-") || "";
  };

  const hasBadge = (project, badgeName) => {
    return project?.badges?.some(
      (badge) => normalizeText(badge) === normalizeText(badgeName),
    );
  };

  const filterOptions = useMemo(() => {
    if (!projects) return [];

    return [
      { id: "all", label: "All Projects", count: projects.length },
      {
        id: "power-bi",
        label: "Power BI",
        count: projects.filter((p) => hasBadge(p, "power bi")).length,
      },
      {
        id: "excel",
        label: "Excel",
        count: projects.filter((p) => hasBadge(p, "excel")).length,
      },
      {
        id: "python",
        label: "Python",
        count: projects.filter((p) => hasBadge(p, "python")).length,
      },
      {
        id: "sql",
        label: "SQL",
        count: projects.filter((p) => hasBadge(p, "sql")).length,
      },
    ];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    if (activeFilter === "all") return projects;

    const badgeMap = {
      python: "python",
      sql: "sql",
      "power-bi": "power bi",
      excel: "excel",
    };
    const badgeName = badgeMap[activeFilter];
    return projects.filter((project) => hasBadge(project, badgeName));
  }, [projects, activeFilter]);

  return (
    <PageLayout title="Portfolio">
      {/* ... باقي المكون كما هو ... */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-yellow-crayola mb-3">
            Explore My Work
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Filter through my projects by technology and tools
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {filterOptions?.map((filter) => (
            <button
              key={filter?.id}
              onClick={() => setActiveFilter(filter?.id)}
              className={cn(
                "group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border-2",
                "flex items-center gap-2 min-w-[120px] justify-center",
                activeFilter === filter?.id
                  ? "border-yellow-crayola bg-dark text-white shadow-lg shadow-yellow-crayola/25 scale-105"
                  : "border-gray-700 bg-light text-dark hover:border-gray-500 hover:text-white hover:scale-105 hover:bg-dark cursor-pointer",
              )}
            >
              <span>{filter.label}</span>
              <span
                className={cn(
                  "px-2 py-1 text-xs rounded-full transition-colors",
                  activeFilter === filter?.id
                    ? "bg-light text-dark"
                    : "bg-dark text-light group-hover:bg-light group-hover:text-dark",
                )}
              >
                {filter?.count}
              </span>
            </button>
          ))}
        </div>

        <div className="text-center mt-6">
          <span className="text-sm text-gray-400">
            Showing {filteredProjects.length} of {projects?.length} projects
            {activeFilter !== "all" && (
              <span className="text-yellow-crayola ml-1">
                • {filterOptions.find((f) => f.id === activeFilter)?.label}
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-8">
        <Suspense
          fallback={
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProjectCardLoading key={index} />
              ))}
            </div>
          }
        >
          {!filteredProjects.length && (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {activeFilter === "all"
                  ? "There are no projects available at the moment."
                  : `No projects found for "${filterOptions.find((f) => f.id === activeFilter)?.label}". Try another filter.`}
              </p>
              {activeFilter !== "all" && (
                <button
                  onClick={() => setActiveFilter("all")}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Show All Projects
                </button>
              )}
            </div>
          )}

          {filteredProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </Suspense>
      </div>
    </PageLayout>
  );
}

// import { lazy, Suspense, useState, useMemo, useEffect } from "react";
// import ProjectCardLoading from "./components/ProjectCardLoading";
// import { useLoaderData } from "react-router-dom";
// import { cn } from "@/lib/utils";
// import PageLayout from "@/layout/PageLayout";
// import { useApp } from "@/context/AppContext";

// const ProjectCard = lazy(() => import("./components/ProjectCard"));

// export default function Portfolio() {
//   const [activeFilter, setActiveFilter] = useState("all");
//   const { projects } = useLoaderData();

//     const { filterSkill } = useApp();

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   const normalizeText = (text) => {
//     return text?.toLowerCase().replace(/\s+/g, "-") || "";
//   };

//   const hasBadge = (project, badgeName) => {
//     return project?.badges?.some(
//       (badge) => normalizeText(badge) === normalizeText(badgeName),
//     );
//   };

//   // حساب عدد المشاريع لكل فلتر
//   const filterOptions = useMemo(() => {
//     if (!projects) return [];

//     return [
//       {
//         id: "all",
//         label: "All Projects",
//         count: projects.length,
//       },

//       {
//         id: "power-bi",
//         label: "Power BI",
//         count: projects.filter((p) => hasBadge(p, "power bi")).length,
//       },
//       {
//         id: "excel",
//         label: "Excel",
//         count: projects.filter((p) => hasBadge(p, "excel")).length,
//       },
//       {
//         id: "python",
//         label: "Python",
//         count: projects.filter((p) => hasBadge(p, "python")).length,
//       },
//       {
//         id: "sql",
//         label: "SQL",
//         count: projects.filter((p) => hasBadge(p, "sql")).length,
//       },
//     ];
//   }, [projects]);

//   const filteredProjects = useMemo(() => {
//     if (!projects) return [];

//     if (activeFilter === "all") {
//       return projects;
//     }

//     const badgeMap = {
//       python: "python",
//       sql: "sql",
//       "power-bi": "power bi",
//       excel: "excel",
//     };

//     const badgeName = badgeMap[activeFilter];
//     return projects.filter((project) => hasBadge(project, badgeName));
//   }, [projects, activeFilter]);

//   return (
//     <PageLayout title="Portfolio">
//       {/* Enhanced Filter Section */}
//       <div className="mb-12">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-yellow-crayola mb-3">
//             Explore My Work
//           </h2>
//           <p className="text-gray-400 max-w-2xl mx-auto">
//             Filter through my projects by technology and tools
//           </p>
//         </div>

//         {/* Enhanced Filter Buttons */}
//         <div className="flex flex-wrap items-center justify-center gap-4">
//           {filterOptions?.map((filter) => (
//             <button
//               key={filter?.id}
//               onClick={() => setActiveFilter(filter?.id)}
//               className={cn(
//                 "group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border-2",
//                 "flex items-center gap-2 min-w-[120px] justify-center",
//                 activeFilter === filter?.id
//                   ? "border-yellow-crayola bg-dark text-white shadow-lg shadow-yellow-crayola/25 scale-105"
//                   : "border-gray-700 bg-light text-dark hover:border-gray-500 hover:text-white hover:scale-105 hover:bg-dark cursor-pointer",
//               )}
//             >
//               <span>{filter.label}</span>
//               <span
//                 className={cn(
//                   "px-2 py-1 text-xs rounded-full transition-colors",
//                   activeFilter === filter?.id
//                     ? "bg-light text-dark"
//                     : "bg-dark text-light group-hover:bg-light group-hover:text-dark",
//                 )}
//               >
//                 {filter?.count}
//               </span>

//               {/* Active indicator */}
//               {/* {activeFilter === filter.id && (
//                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-crayola rounded-full" />
//               )} */}
//             </button>
//           ))}
//         </div>

//         {/* Active Filter Indicator */}
//         <div className="text-center mt-6">
//           <span className="text-sm text-gray-400">
//             Showing {filteredProjects.length} of {projects?.length} projects
//             {activeFilter !== "all" && (
//               <span className="text-yellow-crayola ml-1">
//                 • {filterOptions.find((f) => f.id === activeFilter)?.label}
//               </span>
//             )}
//           </span>
//         </div>
//       </div>

//       {/* Enhanced Projects Grid */}
//       <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-8">
//         <Suspense
//           fallback={
//             <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-8">
//               {Array.from({ length: 6 }).map((_, index) => (
//                 <ProjectCardLoading key={index} />
//               ))}
//             </div>
//           }
//         >
//           {/* No Projects State */}
//           {!filteredProjects.length && (
//             <div className="col-span-full text-center py-16">
//               <div className="text-6xl mb-4">🔍</div>
//               <h3 className="text-xl font-semibold text-gray-300 mb-2">
//                 No projects found
//               </h3>
//               <p className="text-gray-500 max-w-md mx-auto">
//                 {activeFilter === "all"
//                   ? "There are no projects available at the moment."
//                   : `No projects found for "${filterOptions.find((f) => f.id === activeFilter)?.label}". Try another filter.`}
//               </p>
//               {activeFilter !== "all" && (
//                 <button
//                   onClick={() => setActiveFilter("all")}
//                   className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:scale-105 transition-transform"
//                 >
//                   Show All Projects
//                 </button>
//               )}
//             </div>
//           )}

//           {/* Projects List */}
//           {filteredProjects.map((project, index) => (
//             <ProjectCard
//               key={index}
//               project={project}
//               // className="hover:scale-105 transition-transform duration-300"
//             />
//           ))}
//         </Suspense>
//       </div>
//     </PageLayout>
//   );
// }
