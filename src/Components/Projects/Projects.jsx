import { useEffect, useRef, useState, useCallback } from "react";

const PROJECTS = [
  {
    title: "Conotex Integrated Services – IT & Low-Voltage Solutions",
    description:
      "Conotex Integrated Services (CIS), a division of Conotex Systems & Energy Services LLC, delivers nationwide low-voltage and managed IT solutions. Since 2011, CIS has partnered with top brands to design, deploy, and manage secure, reliable, and scalable digital infrastructure.",
    images: ["/conotex2.webp", "/conotex3.jpg", "/conotex1.png"],
    link: "https://www.conotextech.com/",
  },
  {
    title: "Vendo – Modern eCommerce Website",
    description:
      "Vendo is a modern, responsive eCommerce frontend designed for a seamless shopping experience. It features dynamic product grids, category-based browsing, promotional banners, interactive product pages, search functionality, smooth animations, and optimized responsive design for both mobile and desktop users.",
    images: ["/vendo1.jpg", "/vendo2.jpg", "/vendo3.jpg"],
    link: "https://my-ecommerce-nine-iota.vercel.app/",
  },
  {
    title: "WearEiko – African-Inspired Fashion Brand",
    description:
      "WearEiko blends African heritage with modern fashion, empowering self-expression through timeless, culturally-rooted designs. From bold Ankara prints to chic contemporary pieces, every garment tells a story of identity, creativity, and sustainability. WearEiko champions community impact, innovation, and global fashion influence.",
    images: ["/wear2.jpg", "/wear1.jpg", "/wear3.jpg"],
    link: "https://weareiko.com",
  },
];

const ProjectCard = ({ project, index, isVisible }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const changeImage = useCallback((direction) => {
    setIsImageLoaded(false);
    setActiveImageIndex((prev) => {
      const length = project.images.length;
      return direction === "next"
        ? (prev + 1) % length
        : (prev - 1 + length) % length;
    });
  }, [project.images.length]);

  const handleKeyDown = useCallback((e, direction) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      changeImage(direction);
    }
  }, [changeImage]);

  return (
    <article
      className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Image Slider */}
      <div className="relative w-full h-64 sm:h-56 md:h-64 overflow-hidden bg-gray-200">
        <img
          src={project.images[activeImageIndex]}
          alt={`${project.title} preview ${activeImageIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Navigation Buttons */}
        {project.images.length > 1 && (
          <>
            <button
              onClick={() => changeImage("prev")}
              onKeyDown={(e) => handleKeyDown(e, "prev")}
              aria-label={`Previous image for ${project.title}`}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-black/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
            >
              ‹
            </button>
            <button
              onClick={() => changeImage("next")}
              onKeyDown={(e) => handleKeyDown(e, "next")}
              aria-label={`Next image for ${project.title}`}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-black/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
            >
              ›
            </button>
          </>
        )}

        {/* Image Indicators */}
        {project.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {project.images.map((_, imgIndex) => (
              <button
                key={imgIndex}
                onClick={() => {
                  setIsImageLoaded(false);
                  setActiveImageIndex(imgIndex);
                }}
                aria-label={`View image ${imgIndex + 1} of ${project.images.length}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
                  imgIndex === activeImageIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6 flex flex-col gap-4">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {project.description}
        </p>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-all duration-300 group w-fit focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-1"
        >
          <span>View Project</span>
          <span className="transform transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </article>
  );
};

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-gray-50 to-gray-100"
      aria-label="Featured Projects"
    >
      {/* Header */}
      <div 
        className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Featured Projects
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Explore some of the innovative digital experiences we've built.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;