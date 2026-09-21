import HeadingSection from "@/components/HeadingSection";
import { useLoaderData } from "react-router-dom";

export default function SkillsAndTechnologies() {
  const { skills } = useLoaderData();

  return (
    <section>
      <HeadingSection title={"Skills and Technologies"} />

      <ul className="grid grid-cols-2 gap-8 max-768-grid-cols-1">
        {skills.map((skill, i) => (
          <li key={i} className="flex items-center gap-2 text-lg">
            {skill.icon} {skill.skill_name}
          </li>
        ))}
      </ul>
    </section>
  );
}
