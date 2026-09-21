import PageLayout from "../../../layout/PageLayout";
import ContactForm from "./components/ContactForm";
import Location from "./components/Location";

export default function Contact() {
  return (
    <PageLayout title="Contact">
      {/* <Location /> */}

      <ContactForm />
    </PageLayout>
  );
}
