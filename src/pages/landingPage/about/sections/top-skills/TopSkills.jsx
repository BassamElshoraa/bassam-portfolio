import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import HeadingSection from "@/components/HeadingSection";
import { useApp } from "@/context/AppContext";

const skills = [
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "SQL",
    icon: "https://www.svgrepo.com/show/331760/sql-database-generic.svg",
  },
  {
    name: "Tableau",
    icon: "https://cdn.worldvectorlogo.com/logos/tableau-software.svg",
  },
  {
    name: "Power BI",
    icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/power-bi-icon.png",
  },
  {
    name: "n8n",
    icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/n8n-icon.png",
  },
];

export default function TopSkills() {
  const navigate = useNavigate();
  const { setActivePage, setFilterSkill } = useApp();

  const handleSkillClick = (skillName) => {
    setFilterSkill(skillName);
    setActivePage("portfolio");
    navigate("/");
  };

  return (
    <section className="py-12 md:py-16 bg-light overflow-hidden">
      <div className="container mx-auto px-4">
        <HeadingSection
          title="Top Skills"
          subtitle="أدوات وتقنيات أعتمد عليها"
        />
        <div className="grid grid-cols-3 max-md:grid-cols-2 gap-6 mt-8">
          {skills.map((skill, index) => (
            <Card
              key={index}
              className="hover:-translate-y-1 border border-transparent hover:border-yellow-crayola transition duration-300"
              onClick={() => handleSkillClick(skill.name)}
            >
              <CardContent className="flex flex-col items-center gap-y-4 p-6 drop-shadow-md cursor-pointer">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="text-dark font-bold text-lg">{skill.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
// import { useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import Autoplay from "embla-carousel-autoplay";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import { Card, CardContent } from "@/components/ui/card";
// import HeadingSection from "@/components/HeadingSection";
// import { useApp } from "@/context/AppContext"; // استورد السياق

// const skills = [
//   {
//     name: "Python",
//     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
//   },
//   {
//     name: "SQL",
//     icon: "https://www.svgrepo.com/show/331760/sql-database-generic.svg",
//   },
//   {
//     name: "Tableau",
//     icon: "https://cdn.worldvectorlogo.com/logos/tableau-software.svg",
//   },
//   {
//     name: "Power BI",
//     icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/power-bi-icon.png",
//   },
//   {
//     name: "n8n",
//     icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/n8n-icon.png",
//   },
// ];

// export default function TopSkills() {
//   const navigate = useNavigate();
//   const { setActivePage, setFilterSkill } = useApp(); // استخدم السياق

//   const autoplay = useRef(
//     Autoplay({
//       delay: 2000, // التمرير التلقائي كل 2 ثانية
//       stopOnInteraction: true, // يتوقف عند تفاعل المستخدم
//       stopOnMouseEnter: true,
//     }),
//   );

//   const handleSkillClick = (skillName) => {
//     // تعيين الفلتر بالمهارة المختارة
//     setFilterSkill(skillName);
//     // الانتقال إلى صفحة portfolio (تغيير activePage)
//     setActivePage("portfolio");
//     // إذا كنت بحاجة لتغيير الرابط (URL) يمكنك استخدام navigate
//     navigate("/"); // أو المسار الذي يظهر فيه الـ LandingPage
//   };

//   return (
//     <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
//       <div className="container mx-auto px-4">
//         <HeadingSection
//           title="Top Skills"
//           subtitle="أدوات وتقنيات أعتمد عليها"
//         />

//         <Carousel
//           opts={{
//             loop: true,
//             align: "start",
//             dragFree: true, // يسمح بالسحب الحر لعدة عناصر
//             slidesToScroll: 1,
//             duration: 30,
//           }}
//           plugins={[autoplay.current]}
//           className="w-full cursor-grab active:cursor-grabbing"
//           aria-label="قائمة المهارات التقنية"
//         >
//           <CarouselContent className="-ml-2 md:-ml-4">
//             {skills.map((skill, index) => (
//               <CarouselItem
//                 key={index}
//                 className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4"
//               >
//                 <Card
//                   className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-40 h-40 flex items-center justify-center cursor-pointer group"
//                   onClick={() => handleSkillClick(skill.name)}
//                 >
//                   <CardContent className="flex flex-col items-center gap-y-4 p-4">
//                     <img
//                       src={skill.icon}
//                       alt={skill.name}
//                       className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
//                       onError={(e) =>
//                         (e.currentTarget.src = "/fallback-icon.svg")
//                       }
//                     />
//                     <h3 className="text-dark dark:text-white font-bold text-lg">
//                       {skill.name}
//                     </h3>
//                   </CardContent>
//                 </Card>
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//         </Carousel>
//       </div>
//     </section>
//   );
// }

// import { useRef } from "react";
// import Autoplay from "embla-carousel-autoplay";

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";

// import { Card, CardContent } from "@/components/ui/card";
// import HeadingSection from "@/components/HeadingSection";

// const skills = [
//   {
//     name: "Python",
//     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
//   },
//   {
//     name: "SQL",
//     icon: "https://www.svgrepo.com/show/331760/sql-database-generic.svg",
//   },
//   {
//     name: "Tableau",
//     icon: "https://cdn.worldvectorlogo.com/logos/tableau-software.svg",
//   },
//   {
//     name: "Power BI",
//     icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/power-bi-icon.png",
//   },
//   {
//     name: "n8n",
//     icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/n8n-icon.png",
//   },
// ];

// export default function TopSkills() {
//   const autoplay = useRef(
//     Autoplay({
//       delay: 0,
//       speed: 0.5,
//       stopOnInteraction: false,
//       stopOnMouseEnter: true,
//     }),
//   );

//   return (
//     <section className="color-and-padding-component py-10 mt-8 overflow-hidden border-none">
//       <div className="container mx-auto px-4">
//         <HeadingSection title="Top Skills" />

//         <Carousel
//           opts={{
//             loop: true,
//             dragFree: true,
//             dragMinInteractions: 20,
//             duration: 2000,
//           }}
//           plugins={[autoplay.current]}
//           className="w-full cursor-grab active:cursor-grabbing"
//         >
//           <CarouselContent className="gap-2">
//             {skills.map((skill, index) => (
//               <CarouselItem key={index} className="md:basis-1/4 basis-1/2">
//                 <Card className="bg-light border border-gray-border shadow-xl rounded-2xl h-40 flex items-center justify-center hover:border-yellow-crayola transition-all duration-500">
//                   <CardContent className="flex flex-col items-center gap-y-4">
//                     <img
//                       src={skill.icon}
//                       alt={skill.name}
//                       draggable={false}
//                       loading="lazy"
//                       className="w-16 h-16 object-contain pointer-events-none"
//                     />
//                     <h3 className="text-dark font-bold text-lg tracking-wide">
//                       {skill.name}
//                     </h3>
//                   </CardContent>
//                 </Card>
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//         </Carousel>
//       </div>
//     </section>
//   );
// }
