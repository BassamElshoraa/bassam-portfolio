import emailjs from "emailjs-com";
import { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactForm() {
  const form = useRef();

  const [values, setValues] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (
      !values.user_name.trim() ||
      !values.user_email.trim() ||
      !values.user_phone.trim() ||
      !values.message.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_KEY,
        import.meta.env.VITE_TEMPLATE_KEY,
        form.current,
        import.meta.env.VITE_PUBLICK_KEY,
      )
      .then(
        () => {
          toast("SUCCESS!", {
            progressClassName: "custom-progress-bar-success",
          });

          // إعادة تعيين القيم بعد الإرسال الناجح
          setValues({
            user_name: "",
            user_email: "",
            user_phone: "",
            message: "",
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error sending email:", error);
          toast("Try Again", {
            progressClassName: "custom-progress-bar-wrong",
          });
          setLoading(false);
        },
      )
      .catch((error) => {
        console.error("Unexpected error:", error);
        toast("Try Again", {
          progressClassName: "custom-progress-bar-wrong",
        });
        setLoading(false);
      });
  };

  return (
    <section className="contact-form">
      <ToastContainer />

      <form ref={form} onSubmit={sendEmail} method="POST" className="space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="user_name"
            className="mb-1 text-sm text-yellow-crayola"
          >
            Full name
          </label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            className="rounded-2xl border border-jet w-full py-4 px-5 focus:border-bittersweet-shimmer outline-none"
            placeholder="Full name"
            value={values.user_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="user_email"
            className="mb-1 text-sm text-yellow-crayola"
          >
            Email address
          </label>
          <input
            type="email"
            id="user_email"
            name="user_email"
            className="rounded-2xl border border-jet w-full py-4 px-5 focus:border-bittersweet-shimmer outline-none"
            placeholder="Email address"
            value={values.user_email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="user_phone"
            className="mb-1 text-sm text-yellow-crayola"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="user_phone"
            name="user_phone"
            className="rounded-2xl border border-jet w-full py-4 px-5 focus:border-bittersweet-shimmer outline-none"
            placeholder="Phone Number"
            value={values?.user_phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="message" className="mb-1 text-sm text-yellow-crayola">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            className="resize-none rounded-2xl w-full py-4 px-5 mb-8 h-32 max-h-52 border border-jet focus:border-bittersweet-shimmer outline-none"
            placeholder="Your Message"
            value={values.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* form-btn  transition duration-300 flex items-center justify-center */}
        <button
          className="bg-yellow-crayola hover:bg-yellow-crayola text-white rounded-2xl py-3 px-6 w-full cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-black mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            <span>Send Message</span>
          )}
        </button>
      </form>
    </section>
  );
}
