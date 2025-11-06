import "./Footer.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const year = new Date().getFullYear();

  const messages = [
    "Empowering your digital future.",
    "Innovating with purpose.",
    "Design. Develop. Deliver.",
    "Your success, our mission."
  ];

  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.footer
      className="footer-section"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="footer-container">
        <motion.div
          className="footer-brand"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", repeat: Infinity, repeatType: "mirror" }}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 1], y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            IsiTech Innovations
          </motion.h2>

          <AnimatePresence mode="wait">
            <motion.p
              key={messages[currentMsgIndex]}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.6 }}
            >
              {messages[currentMsgIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="footer-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h3>Quick Links</h3>
          <ul>
            {["Home", "About", "Services", "Projects", "Blog", "Contact"].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.2 }}
              >
                <a href={`#${item.toLowerCase()}`}>{item}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="footer-contact"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <h3>Contact</h3>
          <p>Email: Isitech1111@gmail.com</p>
          <p>Phone: +234 810 355 8837</p>
          <p>Location: Nigeria</p>
        </motion.div>
      </div>

      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <p>&copy; {year} IsiTech Innovations. All Rights Reserved.</p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
