import { memo } from "react";
import { Link } from "react-router";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default memo(function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project?.slug}`} className="block drop-shadow-xl">
      <div className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-light">
        {/* خلفية البطاقة */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl -z-10" /> */}
        {/* <div className="absolute inset-[1px] bg-gradient-to-br from-gray-900 to-black rounded-xl -z-10" /> */}

        {/* صورة المشروع */}
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            loading="lazy"
            className="w-full h-48 object-cover object-top transition-transform duration-700 group-hover:scale-110"
            src={project?.image}
            alt={project?.title}
          />

          {/* تأثير التدرج عند التحويم */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}

          {/* الشارة العلوية */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-crayola/90 backdrop-blur-sm rounded-full text-xs font-semibold text-black opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            Quick View
          </div>
        </div>

        {/* قسم المحتوى */}
        <div className="p-5 space-y-3">
          {/* العنوان */}
          <h3 className="text-lg font-bold text-dark group-hover:text-yellow-crayola transition-colors duration-300 line-clamp-2">
            {project?.title}
          </h3>

          {/* الوصف يظهر فقط عند hover */}
          <div className="relative">
            {/* إضافة CSS class لتحديد عدد الأسطر */}
            <p className="text-gray-300 text-sm mt-2 line-clamp-3">
              {project?.description}
            </p>
          </div>

          {/* المهارات */}
          <div className="flex flex-wrap gap-2 mt-2">
            {Boolean(project?.skills?.length) &&
              project?.skills?.slice(0, 3)?.map((badge, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium bg-gray-800/80 text-yellow-crayola rounded-full border border-yellow-crayola/30 hover:border-yellow-crayola/60 transition-all duration-200"
                >
                  {badge}
                </span>
              ))}
            {project?.skills?.length > 3 && (
              <span className="px-3 py-1 text-xs font-medium bg-gray-800/80 text-gray-400 rounded-full border border-gray-600/30">
                +{project?.skills?.length - 3}
              </span>
            )}
          </div>

          {/* الزر */}
          {/* <Button
            variant="ghost"
            // className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-yellow-crayola hover:text-yellow-crayola transition-colors duration-200 group/link mt-2"
          >
            <span>Learn More</span>
            <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Button> */}
        </div>
      </div>
    </Link>
  );
});
