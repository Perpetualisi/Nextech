import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Services.css";

const services = [
  {
    title: "Web Design",
    description: "Crafting stunning, user-centric interfaces that leave lasting impressions.",
    icon: "💻",
    animation: "bounce",
  },
  {
    title: "Custom Development",
    description: "High-performance web apps built with modern technologies tailored to your goals.",
    icon: "⚙️",
    animation: "spin",
  },
  {
    title: "Brand Identity",
    description: "Building unforgettable brand experiences that speak to your audience.",
    icon: "🎨",
    animation: "pulse",
  },
  {
    title: "SEO & Analytics",
    description: "Rank higher, reach further. Data-driven strategies that scale your business.",
    icon: "📈",
    animation: "float",
  },
  {
    title: "E-Commerce Solutions",
    description: "Sell smarter with sleek, scalable, secure online stores.",
    icon: "🛒",
    animation: "zoom",
  },
  {
    title: "Tech Consultation",
    description: "Expert guidance to turn ideas into scalable digital products.",
    icon: "🧠",
    animation: "shake",
  },
  {
    title: "Mobile App Development",
    description: "Cross-platform mobile apps with elegant UX and scalable architecture.",
    icon: "📱",
    animation: "wave",
  },
  {
    title: "Cloud Integration",
    description: "Secure, scalable cloud solutions to enhance efficiency and collaboration.",
    icon: "☁️",
    animation: "rotate",
  },
];

const Services = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section id="services" className="services-section">
      <div className="services-header" data-aos="fade-up">
        <h2>Our Premium Services</h2>
        <p>
          NexTech Innovations offers industry-leading solutions to launch, grow, and scale your digital brand.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
            <div className={`service-icon ${service.animation}`}>{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
