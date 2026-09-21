import { memo } from "react";

export default memo(function CardWhatDoing({ icon, title, content }) {
  return (
    <div className="relative flex items-start gap-7 drop-shadow-md text-yellow-crayola p-7 max-sm:px-4">
      <div className="absolute inset-1 bg-light rounded-xl z-0"></div>
      <img
        src={icon}
        alt={title}
        loading="lazy"
        width={40}
        height={40}
        className="z-10"
      />
      <div className="space-y-1.5 z-10">
        <h3 className="text-lg">{title}</h3>
        <p>{content}</p>
      </div>
    </div>
  );
});
