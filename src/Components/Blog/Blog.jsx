import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Blog.css";

const blogPosts = [
  {
    title: "The Future of Web Development in 2025",
    excerpt: "Explore the trends that are shaping the web from AI to serverless tech and immersive UI.",
    fullText: " AI-powered tools, serverless infrastructure, and immersive interfaces are redefining how developers build and users experience the web.",
    icon: "🚀",
    date: "May 2025",
  },
  {
    title: "Designing Experiences, Not Just Websites",
    excerpt: "Great digital products tell stories. Here's how we create immersive, user-centric designs.",
    fullText: " We focus on empathy-driven design, ensuring each project is tailored to meet user needs while being beautiful and functional.",
    icon: "🎨",
    date: "April 2025",
  },
  {
    title: "How to Launch a Scalable SaaS in 6 Steps",
    excerpt: "Learn our battle-tested process for launching high-performance SaaS products.",
    fullText: " From market research to DevOps automation, these six steps will ensure your SaaS product is robust, scalable, and ready for growth.",
    icon: "📊",
    date: "March 2025",
  },
];

const Blog = () => {
  const [expanded, setExpanded] = useState(Array(blogPosts.length).fill(false));

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const toggleReadMore = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  return (
    <section id="blog" className="blog-section">
      <div className="blog-marquee">
        <p>
          🔥 Welcome to our Blog — Get the latest insights on Web Development, Design & Tech Trends! 🔥
        </p>
      </div>

      <div className="blog-header" data-aos="fade-up">
        <h2>Insights & Resources</h2>
        <p>
          Stay ahead with our latest thoughts on design, development, and digital transformation.
        </p>
      </div>

      <div className="blog-grid">
        {blogPosts.map((post, index) => (
          <div className="blog-card" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="blog-icon" aria-label={post.title}>
              {post.icon}
            </div>
            <div className="blog-content">
              <p className="blog-date">{post.date}</p>
              <h3>{post.title}</h3>
              <p>
                {post.excerpt}
                {expanded[index] && <span>{post.fullText}</span>}
              </p>
              <button className="read-more" onClick={() => toggleReadMore(index)}>
                {expanded[index] ? "Read Less ↑" : "Read More →"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
