// import { Link } from "react-router";
// import { IconsData } from "../../../store/dataClasses";
// import { memo, useCallback, useState } from "react";

// const SocialIcon = memo(({ item, isHovered, onHover }) => (
//   <Link
//     to={item.link}
//     target="_blank"
//     rel="noopener noreferrer"
//     className="relative group block"
//     onMouseEnter={() => onHover(item.id)}
//     onMouseLeave={() => onHover(null)}
//   >
//     {/* Animated Background */}
//     <div
//       className={`
//       absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl
//       transition-all duration-500 transform
//       ${
//         isHovered
//           ? "scale-110 opacity-20 rotate-3"
//           : "scale-100 opacity-0 rotate-0"
//       }
//     `}
//     />

//     {/* Icon Container */}
//     <div
//       className={`
//       relative p-3 rounded-xl border bg-gray-800/40 backdrop-blur-md
//       transition-all duration-300 transform group-hover:scale-105
//       ${
//         isHovered
//           ? "border-blue-400 shadow-lg shadow-blue-500/30"
//           : "border-gray-600/50"
//       }
//     `}
//     >
//       <span
//         className={`
//         text-xl transition-all duration-300
//         ${isHovered ? "text-white scale-110" : "text-gray-300"}
//       `}
//       >
//         {item.icon}
//       </span>
//     </div>

//     {/* Enhanced Tooltip */}
//     <div
//       className={`
//       absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3
//       px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-xs
//       rounded-lg border border-gray-700 transition-all duration-300
//       ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"}
//       whitespace-nowrap pointer-events-none
//     `}
//     >
//       {item.name}
//       <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
//     </div>
//   </Link>
// ));

// export default function IconSocialMedia() {
//   const repo = new IconsData();
//   const data = repo.getIconsData();
//   const [hoveredIcon, setHoveredIcon] = useState(null);

//   const handleHover = useCallback((id) => setHoveredIcon(id), []);

//   return (
//     <div className="flex items-center justify-center gap-4">
//       {data?.map((item) => (
//         <SocialIcon
//           key={item.id}
//           item={item}
//           isHovered={hoveredIcon === item.id}
//           onHover={handleHover}
//         />
//       ))}
//     </div>
//   );
// }
import { Link } from "react-router";
import { IconsData } from "../../../store/dataClasses";

export default function IconSocialMedia() {
  const repo = new IconsData();
  const data = repo.getIconsData();

  return (
    //  max-[1250px]:justify-start
    <div className="flex items-center justify-center text-dark gap-4">
      {data?.map((item) => (
        <Link
          key={item.id}
          to={item.link}
          target="_blank"
          //   rel="noopener noreferrer"
          className="flex items-center justify-center flex-col gap-1.5 hover:text-yellow-crayola"
        >
          <span className="text-2xl mx-auto">{item.icon}</span>

          <span className="text-xs">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}
