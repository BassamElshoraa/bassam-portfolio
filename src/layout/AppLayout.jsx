// import { useState, useMemo } from "react";
// import { Outlet } from "react-router";
// import Sidebar from "../components/sidebar/Sidebar";

// export const AppLayout = () => {
//   const [activePortfolio, setActivePortfolio] = useState("about");

//   const outletContext = useMemo(
//     () => ({
//       activePortfolio,
//       setActivePortfolio,
//     }),
//     [activePortfolio]
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-charcoal-black">
//       <main className="container mx-auto py-8 px-4 lg:px-8">
//         <div className="flex items-start gap-8 lg:flex-row flex-col">
//           <Sidebar />

//           {/* Main Content Area */}
//           <div className="flex-1 min-w-0 w-full transition-all duration-300">
//             <Outlet context={outletContext} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/sidebar/Sidebar";
import { AppProvider } from "@/context/AppContext";

export const AppLayout = () => {
  const [activeProtfolio, setActiveProtfolio] = useState("about");

  return (
    <AppProvider>
      <div>
        <main className="container mx-auto mt-16 mb-16 px-1 flex items-start justify-center gap-6 max-[1250px]:flex-col max-sm:mt-3.5">
          <Sidebar />

          <Outlet context={{ activeProtfolio, setActiveProtfolio }} />
        </main>
      </div>
    </AppProvider>
  );
};
