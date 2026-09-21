export default function Location() {
  return (
    <section className="relative w-full h-96 rounded-2xl overflow-hidden mb-8 border border-charcoal-black">
      <figure className="w-full h-full border border-charcoal-black">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26276.064328558616!2d31.1760625!3d30.0596113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sbd!4v1647608789441!5m2!1sen!2sbd"
          width="400"
          height="300"
          className="w-full h-full filter grayscale invert"
          loading="lazy"
        ></iframe>
      </figure>
    </section>
  );
}
