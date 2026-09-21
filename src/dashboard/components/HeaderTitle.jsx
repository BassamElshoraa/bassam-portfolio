import { FaAngleRight, FaArrowRight } from "react-icons/fa";

export default function HeaderTitle({ title }) {
  return (
    <h3 className="flex items-center gap-2 text-xl font-bold bg-charcoal-black rounded pl-5 py-3 mt-3.5">
      Dashboard <FaAngleRight />{" "}
      <span className="text-yellow-crayola">{title}</span>
    </h3>
  );
}
