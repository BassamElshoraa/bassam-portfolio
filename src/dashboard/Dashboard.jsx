import SidebarDashboard from "./components/sidebar/SidebarDashboard";
import HeaderTitle from "./components/HeaderTitle";
import FormAccordion from "./components/form/FormAccordion";

function Dashboard() {
  return (
    <section className="">
      <div className="flex">
        <SidebarDashboard />

        <div className="w-full">
          {/* <NavbarDashboard /> */}

          <div className="px-5 space-y-4">
            <HeaderTitle title={"Profile"} />

            <FormAccordion />
          </div>
          {/* <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">إضافة مشروع</button>
            {status && <p>{status}</p>}
          </form> */}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
