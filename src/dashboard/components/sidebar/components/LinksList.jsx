import { Link } from "react-router";

const Menu = [
  {
    title: "Edite Profile",
    link: "/dashboard/profile",
  },
  {
    title: "Certifecates",
    link: "/dashboard/certifecates",
  },
  {
    title: "Resume",
    link: "/dashboard/resume",
  },
  {
    title: "Project Data",
    link: "/dashboard/project",
  },
];

function MenuList({ data }) {
  return (
    <li>
      <Link to={data.link}>{data.title}</Link>
    </li>
  );
}

export default function LinksList() {
  return (
    <div>
      <ul>
        {Menu.map((obj, ind) => (
          <MenuList key={ind} data={obj} />
        ))}
      </ul>
    </div>
  );
}
