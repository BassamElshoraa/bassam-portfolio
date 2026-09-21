import { FaArrowAltCircleLeft, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router";
export default function NavbarDashboard() {
  return (
    <header>
      <div className="bg-charcoal-black px-4 py-3">
        <Link
          to={`/`}
          className="flex gap-3 items-center hover:text-yellow-crayola duration-300"
        >
          <FaArrowLeft size={20} />
          <h3 className="text-xl">Go To Portfolio</h3>
        </Link>

        {/* <div className="">
          <img src="" alt="" />
          <h3>Hello Admin</h3>
        </div> */}
      </div>
    </header>
  );
}
