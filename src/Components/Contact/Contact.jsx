import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Contact.css";

const headings = [
  "Let’s Build Something Exceptional",
  "Start Your Project With Us",
  "Design. Develop. Deliver.",
  "Empowering Ideas Digitally",
  "Ready to Bring Your Vision to Life",
  "Collaborate. Create. Launch"
];

const Contact = () => {
  const [currentHeading, setCurrentHeading] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const interval = setInterval(() => {
      setCurrentHeading((prev) => (prev + 1) % headings.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="contact" className="contact-section">
      <div className="contact-header" data-aos="fade-up">
        <h2 className="animated-heading">{headings[currentHeading]}</h2>
        <p>
          Whether it's a website, app, or product strategy — we're ready to collaborate and bring your ideas to life.
        </p>
      </div>

      <div className="contact-container">
        <form
          className="contact-form"
          data-aos="fade-up"
          action="https://formsubmit.co/26c5f71fda07ffbdc912a6d46cb82242"
          method="POST"
        >
          <h3 data-aos="fade-up" data-aos-delay="100">Start a Project</h3>

          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="https://nextech-coral.vercel.app/thank-you.html" />

          <input type="text" name="name" placeholder="Full Name" required data-aos="fade-up" data-aos-delay="200" />
          <input type="email" name="email" placeholder="Email Address" required data-aos="fade-up" data-aos-delay="300" />
          <input type="text" name="company" placeholder="Company / Brand Name" data-aos="fade-up" data-aos-delay="400" />
          <input type="tel" name="phone" placeholder="Phone Number" data-aos="fade-up" data-aos-delay="500" />
          <input type="date" name="date" required data-aos="fade-up" data-aos-delay="600" />
          <input type="time" name="time" required data-aos="fade-up" data-aos-delay="700" />
          <textarea
            name="message"
            placeholder="Project Description / Message"
            rows="6"
            required
            data-aos="fade-up"
            data-aos-delay="800"
          ></textarea>
          <button
            type="submit"
            className="submit-btn"
            data-aos="zoom-in"
            data-aos-delay="900"
          >
            Book a Free Consultation
          </button>
        </form>

        <div className="contact-info" data-aos="fade-left" data-aos-delay="500">
          <h3>Contact Details</h3>
          <p><strong>Email:</strong> <a href="mailto:perpetualokan0@gmail.com">perpetualokan0@gmail.com</a></p>
          <p><strong>Phone:</strong> <a href="tel:+2348103558837">+234 810 355 8837</a></p>
          <p><strong>Location:</strong> Lagos, Nigeria</p>

          <div className="social-icons" data-aos="fade-right" data-aos-delay="600">
            <a href="https://github.com/Perpetualisi" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:perpetualokan0@gmail.com">Email</a>
            <a href="https://www.linkedin.com/in/perpetual-okan-759655344/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://wa.me/2348103558837" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>

          <div className="cta-message" data-aos="flip-up" data-aos-delay="700">
            <p><strong>Need it urgent?</strong> We can start within 48 hours. Let’s talk today.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
