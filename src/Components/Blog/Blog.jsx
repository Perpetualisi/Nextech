import { useEffect, useRef, useState, useCallback } from "react";

const BLOG_POSTS = [
  {
    title: "Top Web Development Trends for 2026",
    excerpt: "AI-driven automation, no-code tools, and WebAssembly are reshaping how developers build the web.",
    fullText:
      "As we enter 2026, web development continues to evolve rapidly. From AI-assisted coding and automation tools to performance-focused frameworks like Remix and Astro, the next year will demand smarter, faster, and more accessible digital experiences.",
    icon: "🚀",
    date: "January 2026",
    gradient: "from-blue-500 to-cyan-500",
    category: "Development"
  },
  {
    title: "Building Human-Centered Digital Products",
    excerpt: "Good design starts with empathy — discover how emotion and usability shape modern interfaces.",
    fullText:
      "Beyond aesthetics, modern design emphasizes clarity, accessibility, and user emotion. We craft every interface to connect with real users — blending beauty with purpose for impactful experiences.",
    icon: "🎨",
    date: "February 2026",
    gradient: "from-purple-500 to-pink-500",
    category: "Design"
  },
  {
    title: "The Rise of Micro-SaaS Startups",
    excerpt: "Learn why small, focused SaaS products are outperforming big tech in innovation and speed.",
    fullText:
      "Micro-SaaS empowers small teams to solve niche problems profitably. With tools like Supabase, Next.js, and Stripe, launching a lightweight but scalable product has never been easier.",
    icon: "💡",
    date: "March 2026",
    gradient: "from-orange-500 to-red-500",
    category: "Business"
  },
];

const MARQUEE_TEXT = "🔥 Latest Insights — Web Development | Design | SaaS | AI Trends (2026) 🔥";

const BlogCard = ({ post, index, isVisible }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <article
      className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl flex flex-col ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Gradient Top Border */}
      <div className={`h-1.5 bg-gradient-to-r ${post.gradient}`} />

      <div className="p-6 flex flex-col flex-grow">
        {/* Icon with hover effect */}
        <div className="text-5xl sm:text-6xl text-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
          {post.icon}
        </div>

        {/* Category Badge */}
        <div className="flex justify-center mb-3">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${post.gradient} text-white`}>
            {post.category}
          </span>
        </div>

        {/* Date */}
        <p className="text-gray-500 text-sm mb-3 text-center font-medium">
          {post.date}
        </p>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center leading-tight group-hover:text-gray-700 transition-colors duration-300">
          {post.title}
        </h3>

        {/* Excerpt + Full Text */}
        <div className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 flex-grow">
          <p>{post.excerpt}</p>
          
          <div
            className={`overflow-hidden transition-all duration-500 ${
              isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-gray-600 leading-relaxed">
              {post.fullText}
            </p>
          </div>
        </div>

        {/* Read More Button */}
        <button
          onClick={toggleReadMore}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 bg-gradient-to-r ${post.gradient} text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:ring-gray-300`}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? `Read less about ${post.title}` : `Read more about ${post.title}`}
        >
          <span className="flex items-center justify-center gap-2">
            {isExpanded ? (
              <>
                Read Less
                <span className="transform transition-transform duration-300 group-hover:-translate-y-1">↑</span>
              </>
            ) : (
              <>
                Read More
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </>
            )}
          </span>
        </button>
      </div>

      {/* Decorative gradient overlay */}
      <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${post.gradient} rounded-full opacity-0 blur-3xl group-hover:opacity-10 transition-opacity duration-500`} />
    </article>
  );
};

const Marquee = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t-2 border-b-2 border-orange-500 py-3 mb-12">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="inline-block mx-4 text-orange-500 font-bold text-base sm:text-lg">
          {MARQUEE_TEXT}
        </span>
        <span className="inline-block mx-4 text-orange-500 font-bold text-base sm:text-lg">
          {MARQUEE_TEXT}
        </span>
        <span className="inline-block mx-4 text-orange-500 font-bold text-base sm:text-lg">
          {MARQUEE_TEXT}
        </span>
      </div>
      
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

const Blog = () => {
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
      id="blog" 
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-gray-50 to-white"
      aria-label="Insights and Resources"
    >
      {/* Marquee */}
      <Marquee />

      {/* Header */}
      <header 
        className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Insights & Resources
        </h2>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Stay ahead with our newest thoughts on development, design, and the future of digital innovation.
        </p>
      </header>

      {/* Blog Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {BLOG_POSTS.map((post, index) => (
          <BlogCard
            key={index}
            post={post}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
};

export default Blog;