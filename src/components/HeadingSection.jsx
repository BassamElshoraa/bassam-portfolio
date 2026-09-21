import { cn } from "@/lib/utils";

export default function HeadingSection({
  title,
  desc,
  containerClassName,
  titleClassName,
  descClassName,
}) {
  return (
    title && (
      <div className={cn("space-y-5", containerClassName)}>
        <h3
          className={cn(
            "relative font-bold text-[32px] mb-5 pb-5 before:absolute before:w-10 before:h-1.5 before:bg-yellow-crayola before:rounded-2xl before:bottom-0",
            titleClassName,
          )}
        >
          {title}
        </h3>
        {desc && <p className={cn(descClassName)}>{desc}</p>}
      </div>
    )
  );
}
