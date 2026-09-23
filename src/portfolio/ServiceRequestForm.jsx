import { useMemo, useState } from "react";
import { Copy, Mail, Send } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  timeline: "",
  details: "",
};

export default function ServiceRequestForm({ email, services = [], initialService = "" }) {
  const [form, setForm] = useState(() => ({ ...initialForm, service: initialService }));
  const [status, setStatus] = useState("");

  const serviceOptions = useMemo(() => services.map((service) => service.title), [services]);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setStatus("");
  };

  const requestText = () => {
    const subject = `Service request: ${form.service}, ${form.name}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Company: ${form.company || "Not provided"}`,
      `Service: ${form.service}`,
      `Budget range: ${form.budget || "Not specified"}`,
      `Preferred timeline: ${form.timeline || "Not specified"}`,
      "",
      "Project details:",
      form.details,
    ].join("\n");

    return { subject, body };
  };

  const submit = (event) => {
    event.preventDefault();
    const { subject, body } = requestText();
    setStatus("Your email app should open. Please press Send there; nothing has been submitted yet. If it does not open, use Copy request.");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyRequest = async (event) => {
    if (!event.currentTarget.form.reportValidity()) return;
    const { subject, body } = requestText();
    try {
      await navigator.clipboard.writeText(`To: ${email}\nSubject: ${subject}\n\n${body}`);
      setStatus("Request copied. Paste it into your email app and send it to the address above.");
    } catch {
      setStatus(`Could not copy automatically. Please email ${email} directly.`);
    }
  };

  return (
    <form className="service-request-form" id="request" onSubmit={submit}>
      <div className="request-form-heading">
        <span className="eyebrow"><Mail size={15} /> Start a project</span>
        <h3>Tell me what you need.</h3>
        <p>Share the problem, the data you have, and the result you want.</p>
      </div>

      <div className="request-form-grid">
        <label className="request-field">
          <span>Your name</span>
          <input required name="name" value={form.name} onChange={update} autoComplete="name" placeholder="Full name" />
        </label>
        <label className="request-field">
          <span>Email</span>
          <input required type="email" name="email" value={form.email} onChange={update} autoComplete="email" placeholder="you@company.com" />
        </label>
        <label className="request-field">
          <span>Company <small>optional</small></span>
          <input name="company" value={form.company} onChange={update} autoComplete="organization" placeholder="Company or organization" />
        </label>
        <label className="request-field">
          <span>Service</span>
          <select required name="service" value={form.service} onChange={update}>
            <option value="">Choose a service</option>
            {serviceOptions.map((service) => <option key={service} value={service}>{service}</option>)}
          </select>
        </label>
        <label className="request-field">
          <span>Budget range <small>optional</small></span>
          <select name="budget" value={form.budget} onChange={update}>
            <option value="">Let’s discuss</option>
            <option value="Under $250">Under $250</option>
            <option value="$250 to $500">$250 to $500</option>
            <option value="$500 to $1,000">$500 to $1,000</option>
            <option value="$1,000+">$1,000+</option>
          </select>
        </label>
        <label className="request-field">
          <span>Preferred timeline <small>optional</small></span>
          <input name="timeline" value={form.timeline} onChange={update} placeholder="For example: within 3 weeks" />
        </label>
        <label className="request-field request-field-wide">
          <span>Project details</span>
          <textarea required rows="6" name="details" value={form.details} onChange={update} placeholder="What problem are you solving? What data do you have? What should the final deliverable help you decide or improve?" />
        </label>
      </div>

      <div className="request-form-footer">
        <button className="button" type="submit"><Send size={17} /> Open email request</button>
        <button className="button button-ghost" type="button" onClick={copyRequest}><Copy size={17} /> Copy request</button>
      </div>
      {status && <p className="request-ready" role="status">{status}</p>}
    </form>
  );
}
