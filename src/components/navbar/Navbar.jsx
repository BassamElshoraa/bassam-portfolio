const data = [
  {
    name: "About",
    icon: <i className="bx bx-user"></i>,
  },
  {
    name: "Resume",
    icon: <i className="bx bx-file-blank"></i>,
  },
  {
    name: "Portfolio",
    icon: <i className="bx bx-briefcase"></i>,
  },
  {
    name: "Blog",

    icon: <i className="bx bx-book-open"></i>,
  },
  {
    name: "Contact",
    icon: <i className="bx bx-envelope"></i>,
  },
];

export default function Navbar({ setActivePage, activePage, className }) {
  return (
    <header
      className={`sticky z-10 top-0 ml-auto mb-[-66px] w-[685px] bg-gradient-onyx px-5 flex gap-8 rounded-bl-2xl rounded-tr-2xl border border-gray-border transition-all duration-300 ${className}`}
    >
      {data?.map((obj, i) => (
        <button
          key={i}
          onClick={() => setActivePage(obj?.name?.toLowerCase())}
          className={`px-2 py-5 font-bold transition-colors duration-300 cursor-pointer hover:text-yellow-crayola ${
            activePage === obj?.name.toLowerCase() && "text-yellow-crayola"
          }`}
        >
          <span className="max-sm:hidden">{obj?.icon}</span> {obj?.name}
        </button>
      ))}
    </header>
  );
}
