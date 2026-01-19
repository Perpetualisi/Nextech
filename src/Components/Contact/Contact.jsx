import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const HEADINGS = [
  "Let's Build Something Exceptional",
  "Start Your Project With Us",
  "Design. Develop. Deliver.",
  "Empowering Ideas Digitally",
  "Ready to Bring Your Vision to Life",
  "Collaborate. Create. Launch"
];

const SOCIAL_LINKS = [
  {
    href: "https://github.com/Perpetualisi",
    label: "GitHub",
    icon: FaGithub,
    color: "hover:bg-gray-800"
  },
  {
    href: "mailto:isitech1111@gmail.com",
    label: "Email",
    icon: FaEnvelope,
    color: "hover:bg-red-500"
  },
  {
    href: "https://www.linkedin.com/in/perpetual-okan-759655344/",
    label: "LinkedIn",
    icon: FaLinkedin,
    color: "hover:bg-blue-600"
  },
  {
    href: "https://wa.me/2348103558837",
    label: "WhatsApp",
    icon: FaWhatsapp,
    color: "hover:bg-green-500"
  }
];

const Contact = () => {
  const [currentHeading, setCurrentHeading] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });
  const sectionRef = useRef(null);

  // IntersectionObserver for animation on scroll
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
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Rotate headings
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeading((prev) => (prev + 1) % HEADINGS.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ isSubmitting: true, isSuccess: false, error: null });

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append('_captcha', 'false');
      formDataToSend.append('_next', 'https://nextech-coral.vercel.app/thank-you.html');

      await fetch('https://formsubmit.co/26c5f71fda07ffbdc912a6d46cb82242', {
        method: 'POST',
        body: formDataToSend
      });

      setFormState({ isSubmitting: false, isSuccess: true, error: null });
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        date: '',
        time: '',
        message: ''
      });

      setTimeout(() => {
        setFormState({ isSubmitting: false, isSuccess: false, error: null });
      }, 5000);
    } catch (error) {
      setFormState({ isSubmitting: false, isSuccess: false, error: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 md:px-10 bg-gradient-to-b from-gray-50 via-white to-gray-50"
    >
      {/* Header */}
      <div 
        className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 min-h-[3rem] sm:min-h-[4rem] md:min-h-[5rem] flex items-center justify-center">
          <span 
            key={currentHeading}
            className="inline-block text-gray-800 animate-fadeInOut"
          >
            {HEADINGS[currentHeading]}
          </span>
        </h2>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Whether it's a website, app, or product strategy — we're ready to collaborate and bring your ideas to life.
        </p>
      </div>

      {/* Contact Grid */}
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-7xl mx-auto">
        {/* Contact Form */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100 space-y-5">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
              Start a Project
            </h3>

            <div className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name *" required className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-base" />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address *" required className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-base" />
              <input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="Company / Brand Name" className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-base" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-base" />

              <div className="grid grid-cols-2 gap-4">
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full px-5 py-3.5 border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-base" />
                <input type="time" name="time" value={formData.time} onChange={handleInputChange} required className="w-full px-5 py-3.5 border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-base" />
              </div>

              <textarea name="message" value={formData.message} onChange={handleInputChange} rows={5} placeholder="Project Description / Message *" required className="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-base resize-none" />
            </div>

            <button onClick={handleSubmit} disabled={formState.isSubmitting} className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-300 ${formState.isSuccess ? 'from-green-500 to-green-600' : ''}`}>
              {formState.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : formState.isSuccess ? (
                '✓ Message Sent Successfully!'
              ) : (
                'Book a Free Consultation'
              )}
            </button>

            {formState.isSuccess && <p className="text-green-600 text-center text-sm font-medium animate-fadeIn">Thank you! We'll get back to you within 24 hours.</p>}
            {formState.error && <p className="text-red-600 text-center text-sm font-medium animate-fadeIn">{formState.error}</p>}
          </div>
        </div>

        {/* Contact Info */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-10 shadow-xl border border-indigo-100 h-full flex flex-col">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
              Contact Details
            </h3>

            <div className="space-y-5 mb-8 flex-grow">
              <div className="flex items-start gap-4 group">
                <div className="bg-white p-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <FaEnvelope className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Email</p>
                  <a href="mailto:Isitech1111@gmail.com" className="text-gray-900 hover:text-indigo-600 transition-colors duration-300 font-medium">Isitech1111@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-white p-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <FaPhone className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Phone</p>
                  <a href="tel:+2348103558837" className="text-gray-900 hover:text-indigo-600 transition-colors duration-300 font-medium">+234 810 355 8837</a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-white p-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <FaMapMarkerAlt className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Location</p>
                  <p className="text-gray-900 font-medium">Nigeria</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Connect With Us</h4>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((link, index) => (
                  <a key={index} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined} className={`flex items-center gap-2 bg-white px-5 py-3 rounded-lg font-medium text-gray-700 transition-all duration-300 hover:text-white hover:shadow-lg hover:-translate-y-1 ${link.color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`} aria-label={link.label}>
                    <link.icon className="text-lg" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-indigo-600">
              <p className="text-gray-700 font-medium leading-relaxed">
                <span className="text-indigo-600 font-bold">⚡ Need it urgent?</span> We can start within 48 hours. Let's talk today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
          .animate-fadeInOut {
            animation: fadeInOut 3.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </section>
  );
};

export default Contact;
