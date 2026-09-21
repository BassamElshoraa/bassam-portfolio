import { useLoaderData, Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { memo, useMemo } from "react";
import PageLayout from "../../../layout/PageLayout";
import { ExternalLink } from "lucide-react";

function extractImage(contentHtml) {
  const doc = new DOMParser().parseFromString(contentHtml, "text/html");
  return doc.querySelector("img")?.src ?? null;
}

// const BlogCard = memo(function BlogCard({ item, feedData }) {
//   const imageUrl = item?.thumbnail || extractImage(item?.content);
//   return (
//     <article className="border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
//       <Link to={item.link} target="_blank" className="block">
//         {imageUrl && (
//           <img
//             src={imageUrl}
//             alt={item.title}
//             className="w-full h-48 object-cover"
//             loading="lazy"
//           />
//         )}
//         <div className="p-4">
//           <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
//         </div>
//       </Link>
//       <div className="flex items-center px-4 pb-4">
//         <img
//           src={feedData.image}
//           alt={item.author}
//           className="w-10 h-10 rounded-full mr-3"
//         />
//         <div>
//           <p className="text-sm font-medium">{item.author}</p>
//           <Link
//             to={feedData.link}
//             target="_blank"
//             className="text-xs flex items-center text-blue-600 hover:underline"
//           >
//             Read on Medium <FaExternalLinkAlt className="ml-1" />
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// });

const BlogCard = memo(function BlogCard({ item, feedData }) {
  const imageUrl = item?.thumbnail || extractImage(item?.content);

  return (
    <Link
      to={item.link}
      target="_blank"
      className="block drop-shadow-md bg-light overflow-hidden rounded-xl"
    >
      <div className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-crayola/20">
        {/* خلفية البطاقة - نفس تصميم ProjectCard */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl -z-10" /> */}
        {/* <div className="absolute inset-0.5 bg-light rounded-xl -z-10" /> */}

        {/* صورة المقال */}
        <div className="relative overflow-hidden rounded-t-xl">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          )}

          {/* تأثير التدرج عند التحويم */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* شارة "قراءة المقال" - بدلاً من "Quick View" */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-crayola/90 backdrop-blur-sm rounded-full text-xs font-semibold text-light opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            Read Article
          </div>
        </div>

        {/* قسم المحتوى */}
        <div className="p-5 space-y-3">
          {/* عنوان المقال */}
          <h3 className="text-lg font-bold text-dark group-hover:text-yellow-crayola transition-colors duration-300 line-clamp-2">
            {item.title}
          </h3>

          {/* تفاصيل الكاتب والمصدر */}
          <div className="flex items-center pt-2 border-t border-gray-700/50">
            <img
              src={feedData.image}
              alt={item.author}
              className="w-8 h-8 rounded-full mr-3 border border-gray-600"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-200">{item.author}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{feedData.title}</p>
                <div className="inline-flex items-center gap-1 text-xs font-medium text-yellow-crayola hover:text-yellow-crayola transition-colors duration-200">
                  <span>Read</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default function Blog() {
  const { blogLoaderData } = useLoaderData();
  const { feed, items } = blogLoaderData;

  const feedData = useMemo(() => feed, [feed]);

  return (
    <PageLayout title="Blog">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {items.map((item) => (
          <BlogCard key={item.guid} item={item} feedData={feedData} />
        ))}
      </div>
    </PageLayout>
  );
}
