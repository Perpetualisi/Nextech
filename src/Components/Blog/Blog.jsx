import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Blog.css";

const blogPosts = [
  {
    title: "Top Web Development Trends for 2026",
    excerpt: "AI-driven automation, no-code tools, and WebAssembly are reshaping how developers build the web.",
    fullText:
      " As we enter 2026, web development continues to evolve rapidly. From AI-assisted coding and automation tools to performance-focused frameworks like Remix and Astro, the next year will demand smarter, faster, and more accessible digital experiences.",
    icon: "🚀",
    date: "October 2025",
  },
  {
    title: "Building Human-Centered Digital Products",
    excerpt: "Good design starts with empathy — discover how emotion and usability shape modern interfaces.",
    fullText:
      " Beyond aesthetics, modern design emphasizes clarity, accessibility, and user emotion. We craft every interface to connect with real users — blending beauty with purpose for impactful experiences.",
    icon: "🎨",
    date: "September 2025",
  },
  {
    title: "The Rise of Micro-SaaS Startups",
    excerpt: "Learn why small, focused SaaS products are outperforming big tech in innovation and speed.",
    fullText:
      " Micro-SaaS empowers small teams to solve niche problems profitably. With tools like Supabase, Next.js, and Stripe, launching a lightweight but scalable product has never been easier.",
    icon: "💡",
    date: "August 2025",
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
          🔥 Latest Insights — Web Development | Design | SaaS | AI Trends (October 2025) 🔥
        </p>
      </div>

      <div className="blog-header" data-aos="fade-up">
        <h2>Insights & Resources</h2>
        <p>
          Stay ahead with our newest thoughts on development, design, and the future of digital innovation.
        </p>
      </div>

      <div className="blog-grid">
        {blogPosts.map((post, index) => (
          <div
            className="blog-card"
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
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
              <button
                className="read-more"
                onClick={() => toggleReadMore(index)}
              >
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
