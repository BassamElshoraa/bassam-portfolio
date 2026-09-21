const data = [
  // "Reporting Analyst",
  // "Data Analyst",
  // "Data Scientist",
  // "Data Researcher",
  // "Data Analysis Instructor",

  "Data Analyst",
  "Data Analysis Instructor",
  "Data Analysis Trainer",
  "Reporting Analyst",
  "Financial Analyst",
  "Data researcher",
  "Data Scientist",
  "Excel",
  "SQL",
  "Python",
  "Power BI",
  "Tableau",
];

export default function LogoAndTextSidebar() {
  return (
    <div className="space-y-3">
      {/*  max-[1250px]:flex-row */}
      <div className="flex items-center gap-4 flex-col">
        <img
          src="/image/personal/bassam-elshoraa-portrait-2026.png"
          alt="logo personal"
          // loading="lazy"
          width={140}
          height={140}
          className="border border-white rounded-full mx-auto max-[1250px]:mx-0"
        />

        <h1 className="text-2xl font-bold text-center max-sm:text-lg">
          Bassam El-Shoraa
        </h1>
      </div>
      {/*  max-[1250px]:justify-start */}
      {/* // التنسيق في Tailwind */}
      <div className="flex justify-center gap-2 flex-wrap-reverse">
        {/* <div className="grid grid-cols-2 gap-2"> */}
        {data?.map((obj, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1 bg-dark 
                 border-l-2 border-l-yellow-crayola rounded-r-md rounded-l-sm
                transition-colors cursor-default group"
          >
            {/* <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 group-hover:animate-pulse" /> */}
            <span className="text-xs font-bold tracking-wide uppercase text-gray-200">
              {obj}
            </span>
          </div>
        ))}
      </div>
      {/* <p className="flex items-center justify-center gap-2 flex-wrap">
        {data?.map((obj, i) => (
          <span key={i} className="badg">
            {obj}
          </span>
        ))}
      </p> */}
    </div>
  );
}
