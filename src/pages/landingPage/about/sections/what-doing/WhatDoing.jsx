import { useLoaderData } from "react-router";
import { DataOfArray } from "../../../../../store/dataClasses";
import CardWhatDoing from "./components/CardWhatDoing";
import HeadingSection from "@/components/HeadingSection";

export default function WhatDoing() {
  const { WhatDoingData } = useLoaderData();

  return (
    <section>
      <HeadingSection title={"What I'm Doing"} />
      <div className="grid grid-cols-2 gap-y-5 gap-x-6 max-768-grid-cols-1">
        {WhatDoingData?.map((obj, i) => (
          <CardWhatDoing
            key={i}
            icon={obj?.icon}
            content={obj?.content}
            title={obj?.title}
          />
        ))}
      </div>
    </section>
  );
}
