import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>NexTech Innovations</h2>
          <p>Empowering your digital future through cutting-edge design and development.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: perpetualokan0@gmail.com</p>
          <p>Phone: +234 810 355 8837</p>
          <p>Location: Lagos, Nigeria</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} NexTech Innovations. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
