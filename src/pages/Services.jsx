import { motion } from 'framer-motion';

function Services() {
  const services = [
    {
      id: "web-design",
      title: "Web Design",
      description: "We create beautiful, responsive websites that look great on any device and help you achieve your business goals.",
      features: [
        "Custom design tailored to your brand",
        "Responsive layouts for all devices",
        "User experience optimization",
        "Visual identity and branding",
        "Wireframing and prototyping"
      ],
      icon: (
        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      )
    },
    {
      id: "development",
      title: "Web Development",
      description: "We build fast, reliable, and feature-rich web applications using modern technologies and best practices.",
      features: [
        "Frontend development (React, Vue, Angular)",
        "Backend development (Node.js, Python, PHP)",
        "E-commerce solutions",
        "Content management systems",
        "API development and integration"
      ],
      icon: (
        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
      )
    },
    {
      id: "branding",
      title: "Branding",
      description: "We help you establish a strong brand identity that resonates with your target audience and sets you apart from competitors.",
      features: [
        "Logo design and visual identity",
        "Brand strategy and positioning",
        "Brand guidelines and style guides",
        "Marketing collateral",
        "Brand messaging and voice"
      ],
      icon: (
        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
        </svg>
      )
    },
    {
      id: "marketing",
      title: "Digital Marketing",
      description: "We help you reach your target audience and grow your business through effective digital marketing strategies.",
      features: [
        "Search engine optimization (SEO)",
        "Social media marketing",
        "Content marketing",
        "Email marketing campaigns",
        "Analytics and performance tracking"
      ],
      icon: (
        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
        </svg>
      )
    }
  ];

  return (
    <>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-600">
              We offer a comprehensive range of services to help you build and grow your online presence.
            </p>
          </motion.div>
        </div>
      </section>

      {services.map((service, index) => (
        <section 
          id={service.id}
          key={service.id} 
          className={`py-20 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                className={`md:w-1/2 mb-10 md:mb-0 ${index % 2 === 0 ? 'md:pr-10 order-1' : 'md:pl-10 order-2'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">{service.icon}</div>
                <h2 className="text-3xl font-bold mb-6">{service.title}</h2>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a 
                    href="#contact" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 inline-block"
                  >
                    Get Started
                  </a>
                </div>
              </motion.div>
              <motion.div 
                className={`md:w-1/2 ${index % 2 === 0 ? 'order-2' : 'order-1'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                  <p className="text-gray-500 text-lg">Service Image</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      <section id="contact" className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8">
              Contact us today to discuss your project and how we can help you achieve your goals.
            </p>
            <a 
              href="/contact" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition duration-200 inline-block"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
