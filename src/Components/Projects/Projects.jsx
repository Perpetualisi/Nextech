import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Projects.css";

const projects = [
  {
    title: "Conotex Integrated Services – IT & Low-Voltage Solutions",
    description:
      "Conotex Integrated Services (CIS), a division of Conotex Systems & Energy Services LLC, is a trusted nationwide provider of low-voltage and managed IT solutions. Since 2011, we have partnered with leading brands across industries to design, deploy, and manage critical infrastructure with precision and reliability.",
    images: ["/conotex2.webp", "/conotex3.jpg", "/conotex1.png"],
    link: "https://www.conotextech.com/",
  },
  {
    title: "Vendo – eCommerce Website",
    description:
      "Vendo is a stylish and modern frontend eCommerce store designed for a seamless shopping experience. It features a dynamic product grid, category-based browsing, attention-grabbing promotional banners, interactive product pages, search functionality, smooth animations, and intuitive navigation. Fully responsive on mobile and desktop, it optimizes performance, engagement, and conversions while maintaining clean, maintainable code.",
    images: ["/vendo1.jpg", "/vendo2.jpg", "/vendo3.jpg"],
    link: "https://my-ecommerce-nine-iota.vercel.app/",
  },
  {
    title: "WearEiko – African-Inspired Fashion",
    description:
      "WearEiko is a fashion movement that blends African heritage with bold, modern design, empowering self-expression through style. From vibrant Ankara prints to chic neutrals and special-occasion looks, our pieces are curated to reflect your unique personality. Every garment is crafted with care and meaning for dreamers, professionals, and creatives who dress with purpose. Locally inspired, globally admired, our fashion transitions seamlessly from work to celebration, without compromising identity. Rooted in sustainability, inclusion, and innovation, WearEiko supports communities and tells stories through every stitch. Welcome to WearEiko — where fashion is culture, and every look makes a statement.",
    images: ["/wear2.jpg", "/wear1.jpg", "/wear3.jpg"],
    link: "https://weareiko.com",
  },
];

const Projects = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Track active image per project
  const [activeImages, setActiveImages] = useState(projects.map(() => 0));

  const nextImage = (projectIndex) => {
    setActiveImages((prev) =>
      prev.map((imgIndex, i) =>
        i === projectIndex
          ? (imgIndex + 1) % projects[i].images.length
          : imgIndex
      )
    );
  };

  const prevImage = (projectIndex) => {
    setActiveImages((prev) =>
      prev.map((imgIndex, i) =>
        i === projectIndex
          ? (imgIndex - 1 + projects[i].images.length) % projects[i].images.length
          : imgIndex
      )
    );
  };

  return (
    <section id="projects" className="projects-section">
      <div className="projects-header" data-aos="fade-up">
        <h2>Featured Projects</h2>
        <p>We build cutting-edge digital experiences that deliver real business results.</p>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div
            className="project-card"
            key={index}
            data-aos="zoom-in"
            data-aos-delay={index * 150}
          >
            <div className="project-image-slider">
              <img
                src={project.images[activeImages[index]]}
                alt={`${project.title} ${activeImages[index] + 1}`}
              />
              <button className="slider-btn prev" onClick={() => prevImage(index)}>
                ‹
              </button>
              <button className="slider-btn next" onClick={() => nextImage(index)}>
                ›
              </button>
            </div>

            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              {project.techStack && (
                <p>
                  <strong>Tech Stack:</strong> {project.techStack.join(", ")}
                </p>
              )}

              {project.highlights && (
                <ul>
                  {project.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              )}

              <a href={project.link} target="_blank" rel="noopener noreferrer">
                View Project →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
