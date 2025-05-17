import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Projects.css";

const projects = [
  {
    title: "Tasty Bite – Food Website",
    description: "A modern recipe site with beautiful UI, menu slider, and mobile responsiveness.",
    images: ["/tasty1.jpg", "/tasty2.jpg", "/tasty3.jpg"],
    link: "https://tasty-bite-eight.vercel.app/",
  },
  {
    title: "Vendo – eCommerce Website",
    description: "A stylish frontend store with product grid, categories, and promo banners.",
    images: ["/vendo1.jpg", "/vendo2.jpg", "/vendo3.jpg"],
    link: "https://my-ecommerce-nine-iota.vercel.app/",
  },
  {
    title: "IceCream – Brand Website",
    description: "A sleek single-product site for an ice cream brand built with React and CSS.",
    images: ["/ice1.jpg", "/ice2.jpg", "/ice3.jpg"],
    link: "https://ice-cream-iota-peach.vercel.app/",
  },
  
];

const Projects = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section id="projects" className="projects-section">
      <div className="projects-header" data-aos="fade-up">
        <h2>Featured Projects</h2>
        <p>
          We build cutting-edge digital experiences that deliver real business results.
        </p>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div
            className="project-card"
            key={index}
            data-aos="zoom-in"
            data-aos-delay={index * 100}
          >
            <div className="project-image-slider">
              <div className="slider-track">
                {project.images.map((img, imgIndex) => (
                  <img key={imgIndex} src={img} alt={`${project.title} ${imgIndex + 1}`} />
                ))}
              </div>
            </div>
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
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
