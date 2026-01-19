import { useEffect, useRef, useState } from "react";
import { 
  FaLaptopCode, FaCog, FaPaintBrush, FaChartLine, 
  FaShoppingCart, FaBrain, FaMobileAlt, FaCloud 
} from "react-icons/fa";

const SERVICES = [
  { 
    title: "Web Design", 
    description: "Crafting stunning, user-centric interfaces that leave lasting impressions.", 
    Icon: FaLaptopCode, 
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  { 
    title: "Custom Development", 
    description: "High-performance web apps built with modern technologies tailored to your goals.", 
    Icon: FaCog, 
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  { 
    title: "Brand Identity", 
    description: "Building unforgettable brand experiences that speak to your audience.", 
    Icon: FaPaintBrush, 
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600"
  },
  { 
    title: "SEO & Analytics", 
    description: "Rank higher, reach further. Data-driven strategies that scale your business.", 
    Icon: FaChartLine, 
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  { 
    title: "E-Commerce Solutions", 
    description: "Sell smarter with sleek, scalable, secure online stores.", 
    Icon: FaShoppingCart, 
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  { 
    title: "Tech Consultation", 
    description: "Expert guidance to turn ideas into scalable digital products.", 
    Icon: FaBrain, 
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600"
  },
  { 
    title: "Mobile App Development", 
    description: "Cross-platform mobile apps with elegant UX and scalable architecture.", 
    Icon: FaMobileAlt, 
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600"
  },
  { 
    title: "Cloud Integration", 
    description: "Secure, scalable cloud solutions to enhance efficiency and collaboration.", 
    Icon: FaCloud, 
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-50",
    iconColor: "text-sky-600"
  },
];

const ServiceCard = ({ service, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { title, description, Icon, color, bgColor, iconColor } = service;

  return (
    <article
      className={`group relative bg-white rounded-2xl p-6 text-center shadow-md transition-all duration-500 hover:shadow-2xl overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Background on Hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      {/* Icon Container */}
      <div className="relative mb-6 flex justify-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${bgColor} ${iconColor} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm group-hover:shadow-lg`}>
          <Icon 
            className={`text-4xl transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            aria-hidden="true" 
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Decorative Element */}
      <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${color} rounded-full opacity-0 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
    </article>
  );
};

const Services = () => {
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
      id="services" 
      ref={sectionRef}
      className="py-16 px-6 md:py-24 md:px-10 bg-gradient-to-b from-white to-gray-50"
      aria-label="Our Services"
    >
      {/* Header */}
      <header 
        className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Premium Services
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          IsiTech Innovations offers industry-leading solutions to launch, grow, and scale your digital brand.
        </p>
      </header>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
        {SERVICES.map((service, index) => (
          <ServiceCard
            key={service.title}
            service={service}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
};

export default Services;