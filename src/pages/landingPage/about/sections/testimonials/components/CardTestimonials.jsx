import { Link } from "react-router";

export default function CardTestimonials({
  skill,
  content,
  linkedin,
  title,
  image,
}) {
  return (
    <div className="relative drop-shadow-md p-6">
      <div className="absolute inset-1 bg-eerie-black-1 rounded-xl z-0 border-t border-l border-dark-charcoal"></div>

      <div className="relative">
        {/* <figure className="bg-black w-20 h-20"> */}
        <img
          src={image}
          alt={title}
          width={80}
          height={80}
          className="rounded-xl absolute -top-14 bg-gradient-onyx"
        />
        {/* </figure> */}
        <h3 className="ml-24 mb-2.5 text-lg font-bold">{title}</h3>
      </div>

      <div className="relative">
        <div className="flex items-center gap-3">
          <h3 className="font-bold">{skill}</h3>
          <h4>
            <Link
              to={linkedin}
              target="_blank"
              className="underline text-blue-500"
            >
              Linkedin
            </Link>
          </h4>
        </div>
        <p className="">
          {" "}
          {content.length > 100 ? content.slice(0, 100) + "..." : content}
        </p>
      </div>
    </div>
  );
}
