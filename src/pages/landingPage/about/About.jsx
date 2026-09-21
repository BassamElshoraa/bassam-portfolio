import PageLayout from "../../../layout/PageLayout";
import Summury from "./sections/about-me/Summury";
import Certifications from "./sections/certifications/Certifications";
import SkillsAndTechnologies from "./sections/skills-and-technologies/SkillsAndTechnologies";
import TopSkills from "./sections/top-skills/TopSkills";
import WhatDoing from "./sections/what-doing/WhatDoing";

export default function About() {
  return (
    <PageLayout title="About">
      <div className="space-y-9">
        <Summury />
        <hr className="mx-auto max-w-lg" />
        <TopSkills />
        <hr className="mx-auto max-w-lg" />

        <Certifications />

        <hr className="mx-auto max-w-lg" />

        <WhatDoing />
        <hr className="mx-auto max-w-lg" />

        {/* <Testimonials /> */}

        <SkillsAndTechnologies />

        {/* <Languages /> */}
      </div>
    </PageLayout>
  );
}
