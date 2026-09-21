import { DataofArray } from "../../../../../store/dataClasses";
import CardTestimonials from "./components/CardTestimonials";

export default function Testimonials() {
  const data = DataofArray.getData();

  return (
    <section>
      <h3 className="text-section !mb-10">Testimonials</h3>

      <div className="grid grid-cols-2 gap-8 max-[768px]:space-y-5 max-768-grid-cols-1">
        {data?.data?.map((obj, i) => (
          <CardTestimonials
            key={i}
            skill={obj.skill}
            content={obj.content}
            linkedin={obj.linkedin}
            title={obj.title}
            image={obj.image}
          />
        ))}
      </div>
    </section>
  );
}
