import { Link, useRouteLoaderData } from "react-router";
import { IconRepository } from "../../../store/dataClasses";
import { cn } from "@/lib/utils";

function IconBox({ icon }) {
  return (
    <div className="icon-box">
      <div className="relative text-light rounded-xl w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-1 bg-dark rounded-xl z-0 border-t border-l border-dark-charcoal"></div>
        <div className="z-10">{icon}</div>
      </div>
    </div>
  );
}

export default function ContentIcons() {
  const { icons } = useRouteLoaderData("landingPage");
  // const daya = IconRepository.getIcons();

  return (
    <ul className="space-y-3 flex gap-3 justify-between flex-col max-[1250px]:flex-row max-[1250px]:justify-center max-[1250px]:gap-5 max-md:flex-col max-md:gap-3">
      {icons?.map((obj) => {
        return (
          <li key={obj?.id} className="flex items-center gap-1.5">
            <IconBox icon={obj?.icon} />
            <div>
              <h3 className="text-yellow-crayola font-bold">{obj?.title}</h3>
              <Link
                to={obj?.link ? obj.link : "#"}
                className={cn(`text-sm`, !obj.link && "cursor-text")}
                onClick={(e) => {
                  if (!obj.link) {
                    e.preventDefault();
                  }
                }}
              >
                {obj?.content}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
