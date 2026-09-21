import { useState, useCallback, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import HeadingSection from "@/components/HeadingSection";
import { cn } from "@/lib/utils";

const CertificatePopup = ({ certificate, isOpen, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        ref={popupRef}
        className="bg-charcoal-black border border-gray-border rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-pop"
      >
        {/* الهيدر */}
        <div className="flex justify-between items-center p-6 border-b border-gray-border">
          <div>
            <h3 className="text-2xl font-bold text-dark mb-2">
              {certificate.title}
            </h3>
            {certificate.issuer && (
              <p className="text-yellow-crayola">from: {certificate.issuer}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-dark hover:text-light transition-colors duration-200 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-dark cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="mb-6 flex justify-center">
            <img
              src={certificate.imageUrl}
              alt={certificate.title}
              className="max-w-full max-h-[500px] object-contain rounded-xl border border-gray-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-yellow-crayola font-semibold mb-2">
                  Information
                </h3>
                <div className="space-y-2">
                  {certificate.date && (
                    <div className="flex justify-between border-b border-gray-border pb-2">
                      <span className="text-light-gray">the date:</span>
                      <span className="text-white">{certificate.date}</span>
                    </div>
                  )}
                  {certificate.duration && (
                    <div className="flex justify-between border-b border-gray-border pb-2">
                      <span className="text-light-gray">Duration:</span>
                      <span className="text-white">{certificate.duration}</span>
                    </div>
                  )}
                  {certificate.level && (
                    <div className="flex justify-between border-b border-gray-border pb-2">
                      <span className="text-light-gray">Level:</span>
                      <span className="text-white">{certificate.level}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-yellow-crayola font-semibold mb-2">
                Description
              </h3>
              <p className="text-light-gray leading-7">
                {certificate.description ||
                  "A certified certificate proving successful completion of requirements and demonstrating the level of skill and experience in the field."}
              </p>
            </div>
          </div>

          {/* المهارات */}
          {certificate?.skills && (
            <div className="mt-6">
              <h3 className="text-yellow-crayola font-semibold mb-3">
                Acquired skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {certificate?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="badg bg-gradient-to-r from-yellow-crayola to-vegas-gold text-jet px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CertificateCard = ({ cert, isActive, onClick }) => (
  <div
    className={`relative transition-all duration-500 transform cursor-pointer ${
      isActive ? "scale-110 z-20 shadow-2xl" : "scale-90 opacity-60 z-10"
    }`}
    onClick={onClick}
  >
    <div
      className={`
      bg-gradient-onyx rounded-2xl shadow-lg overflow-hidden 
      transition-all duration-500 border-2
      ${
        isActive
          ? "border-yellow-crayola shadow-yellow-crayola/20"
          : "border-gray-border hover:border-yellow-crayola/30"
      }
    `}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] relative">
          <img
            src={cert.imageUrl}
            alt={cert.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-700 ${
              isActive ? "scale-105" : "hover:scale-110"
            }`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-charcoal-black via-transparent to-transparent ${
              isActive ? "opacity-100" : "opacity-0 hover:opacity-100"
            } transition-opacity duration-300`}
          />

          <div
            className={`absolute inset-0 flex items-center justify-center ${
              isActive ? "opacity-100" : "opacity-0 hover:opacity-100"
            } transition-opacity duration-300`}
          >
            <div
              className={cn(
                `px-4 py-2 rounded-full text-light font-bold flex items-center gap-2 transition-all duration-300`,
                isActive
                  ? "bg-yellow-crayola translate-y-0"
                  : "bg-yellow-crayola/90 translate-y-4 hover:translate-y-0",
              )}
            >
              <span>View details</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3
          className={cn(
            `font-bold text-dark text-lg mb-2 line-clamp-2 leading-tight`,
            isActive && "text-yellow-crayola",
          )}
        >
          {cert.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {cert.issuer && (
            <span
              className={`badg text-xs ${
                isActive
                  ? "bg-yellow-crayola text-jet"
                  : "bg-dark-charcoal text-yellow-crayola"
              }`}
            >
              {cert.issuer}
            </span>
          )}
          {cert.date && (
            <span className="badg bg-dark-charcoal text-light-gray text-xs">
              {cert.date}
            </span>
          )}
        </div>

        {cert.description && (
          <p className="text-light-gray text-sm line-clamp-2 leading-6">
            {cert.description}
          </p>
        )}
      </div>
    </div>

    {/* مؤشر النشاط */}
    {isActive && (
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <div className="bg-yellow-crayola text-light text-xs px-3 py-1 rounded-full font-bold animate-pulse">
          Active
        </div>
      </div>
    )}
  </div>
);

const CertificateSkeleton = () => (
  <div className="px-3">
    <div className="bg-gradient-onyx rounded-2xl border border-gray-border overflow-hidden">
      <div className="aspect-[4/3] bg-gradient-to-r from-gray-border via-dark-charcoal to-gray-border animate-pulse" />
      <div className="p-4">
        <div className="h-5 bg-gray-border rounded mb-3 animate-pulse w-3/4" />
        <div className="flex gap-2 mb-3">
          <div className="h-6 bg-gray-border rounded animate-pulse w-20" />
          <div className="h-6 bg-gray-border rounded animate-pulse w-16" />
        </div>
        <div className="h-4 bg-gray-border rounded animate-pulse w-full mb-2" />
        <div className="h-4 bg-gray-border rounded animate-pulse w-2/3" />
      </div>
    </div>
  </div>
);

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-yellow-crayola/20 hover:bg-yellow-crayola/30 text-yellow-crayola w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-yellow-crayola/30 hover:scale-110"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-yellow-crayola/20 hover:bg-yellow-crayola/30 text-yellow-crayola w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-yellow-crayola/30 hover:scale-110"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>
);

export default function Certifications() {
  const { certificates } = useLoaderData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const sliderRef = useRef(null);

  const settings = {
    ref: sliderRef,
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: "progressive",
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    arrows: true,
    centerMode: true,
    centerPadding: "0",
    focusOnSelect: true,
    beforeChange: (current, next) => setCurrentSlide(next),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          centerPadding: "80px",
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerPadding: "120px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "60px",
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
          dots: false,
          arrows: false,
        },
      },
    ],
    accessibility: true,
    pauseOnHover: true,
    pauseOnFocus: true,
    adaptiveHeight: false,
  };

  const handleCertificateClick = useCallback((cert) => {
    setSelectedCertificate(cert);
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedCertificate(null), 300);
  }, []);

  // دالة للانتقال إلى شهادة محددة
  const goToSlide = useCallback((index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  }, []);

  return (
    <section
      className=""
      // certifications-section bg-eerie-black-1 py-12
      id="certifications"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <HeadingSection
          containerClassName={"text-center mb-12"}
          title={"My Certifications"}
          titleClassName={"before:left-1/2 before:-translate-x-1/2"}
          desc={
            "Professional certifications and achievements that demonstrate my expertise and commitment to continuous learning."
          }
          descClassName={"text-light-gray text-lg max-w-2xl mx-auto"}
        />
        {/* Slider Container */}
        <div className="slider-wrapper relative max-w-6xl mx-auto">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <CertificateSkeleton key={idx} />
                ))}
              </div>
            }
          >
            {certificates?.length ? (
              <>
                <Slider {...settings}>
                  {certificates?.map((cert, idx) => (
                    <div key={cert.id || idx} className="px-3 py-6">
                      <CertificateCard
                        cert={cert}
                        isActive={idx === currentSlide}
                        onClick={() => handleCertificateClick(cert)}
                      />
                    </div>
                  ))}
                </Slider>

                {/* Navigation Dots Custom */}
                <div className="flex justify-center mt-8 space-x-2">
                  {certificates.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? "bg-yellow-crayola scale-125"
                          : "bg-gray-border hover:bg-yellow-crayola/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-light-gray text-xl mb-4">
                  There are no certificates currently available.
                </div>
                <div className="text-gray-border">
                  Certificates will be added soon...
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </div>

      {/* Popup */}
      {selectedCertificate && (
        <CertificatePopup
          certificate={selectedCertificate}
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
        />
      )}
    </section>
  );
}

// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { useLoaderData } from "react-router-dom";
// import { Suspense } from "react";

// export default function Certifications() {
//   const { certificates } = useLoaderData();

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 800,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     lazyLoad: "ondemand",
//     cssEase: "ease-in-out",
//     arrows: true,
//     centerMode: false,
//     // centerMode: true,
//     // responsive: [
//     //   { breakpoint: 1024, settings: { slidesToShow: 2 } },
//     //   { breakpoint: 600, settings: { slidesToShow: 1 } },
//     // ],
//     accessibility: true,
//     pauseOnHover: true,
//     pauseOnFocus: true,
//   };

//   return (
//     <section className="certifications-section slider-wrapper max-w-2xl mx-auto">
//       {/* <Slider {...settings}> */}
//       <Suspense
//         fallback={Array.from({ length: 3 }).map((_, idx) => (
//           <button key={idx} className="h-80 px-2.5">
//             <div
//               className="w-full h-48 mb-2 rounded-2xl bg-gray-200 animate-pulse"
//               // key={idx}
//             ></div>
//           </button>
//         ))}
//       >
//         <Slider {...settings}>
//           {Boolean(certificates?.length) &&
//             certificates?.map((cert, idx) => (
//               <button key={idx} className="h-80 px-2.5">
//                 <img
//                   key={idx}
//                   src={cert.imageUrl}
//                   alt={cert.title}
//                   loading="lazy"
//                   className="h-full w-full"
//                 />
//               </button>
//             ))}
//         </Slider>
//       </Suspense>
//       {/* </Slider> */}
//     </section>
//   );
// }
