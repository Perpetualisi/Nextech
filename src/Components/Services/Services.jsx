import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Services.css";

// Import icons from react-icons
import { 
  FaLaptopCode, 
  FaCog, 
  FaPaintBrush, 
  FaChartLine, 
  FaShoppingCart, 
  FaBrain, 
  FaMobileAlt, 
  FaCloud 
} from 'react-icons/fa';

const services = [
  {
    title: "Web Design",
    description: "Crafting stunning, user-centric interfaces that leave lasting impressions.",
    icon: <FaLaptopCode className="bounce" title="Web Design" />,
  },
  {
    title: "Custom Development",
    description: "High-performance web apps built with modern technologies tailored to your goals.",
    icon: <FaCog className="spin" title="Custom Development" />,
  },
  {
    title: "Brand Identity",
    description: "Building unforgettable brand experiences that speak to your audience.",
    icon: <FaPaintBrush className="pulse" title="Brand Identity" />,
  },
  {
    title: "SEO & Analytics",
    description: "Rank higher, reach further. Data-driven strategies that scale your business.",
    icon: <FaChartLine className="float" title="SEO & Analytics" />,
  },
  {
    title: "E-Commerce Solutions",
    description: "Sell smarter with sleek, scalable, secure online stores.",
    icon: <FaShoppingCart className="zoom" title="E-Commerce Solutions" />,
  },
  {
    title: "Tech Consultation",
    description: "Expert guidance to turn ideas into scalable digital products.",
    icon: <FaBrain className="shake" title="Tech Consultation" />,
  },
  {
    title: "Mobile App Development",
    description: "Cross-platform mobile apps with elegant UX and scalable architecture.",
    icon: <FaMobileAlt className="wave" title="Mobile App Development" />,
  },
  {
    title: "Cloud Integration",
    description: "Secure, scalable cloud solutions to enhance efficiency and collaboration.",
    icon: <FaCloud className="rotate" title="Cloud Integration" />,
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
          IsiTech Innovations offers industry-leading solutions to launch, grow, and scale your digital brand.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="service-icon">
              {service.icon}
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
