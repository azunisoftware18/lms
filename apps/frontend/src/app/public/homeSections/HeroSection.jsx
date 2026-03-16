import { ArrowRight, Shield } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
// import { colorVariables } from '../../../lib/index';
import { dumyImg, heroData } from '../../../lib/dumyData';
import Button from '../../../components/ui/Button';
import LeadFormModal from '../../../components/modals/LeadFormModal';

export default function HeroSection() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const openLeadModal = () => setIsLeadModalOpen(true);
  const closeLeadModal = () => setIsLeadModalOpen(false);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <section
      id="home"
      className="relative pt-16 md:pt-20 pb-12 md:pb-20 overflow-hidden bg-gradient-to-r from-blue-50 to-blue-200">
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Company Introduction */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between mb-12"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div 
            className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left"
            variants={fadeInUp}
          >
            <motion.div 
              className="flex items-center gap-2 mb-4 justify-center md:justify-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Shield className="w-6 h-6 text-blue-600" />
              </motion.div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Mascot Projects Pvt. Ltd. - Est. 2010
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight"
              variants={fadeInUp}
            >
              Your Trusted Partner in{' '}
              <motion.span 
                className="text-blue-600 inline-block"
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                Financial Growth
              </motion.span>{' '}
              <br className="hidden sm:block" />
              & Business Solutions
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0"
              variants={fadeInUp}
            >
              {heroData.description}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start"
              variants={fadeInUp}
            >
              {/* Apply for Loan button with modal trigger - ONLY THIS OPENS MODAL */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="primary"
                  size="lg"
                  className="group flex items-center"
                  onClick={openLeadModal}
                >
                  Apply for Loan
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline"
                  size="lg"
                >
                  Talk to Expert
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="md:w-1/2 flex justify-center mt-8 md:mt-0"
            variants={scaleIn}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src={dumyImg.HERO_BANNER}
              alt="Mascot Projects Financial Solutions"
              className="w-full max-w-xs sm:max-w-sm h-auto rounded-2xl shadow-2xl"
              loading="eager"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </motion.div>

        {/* Key Products in Hero - REMOVED onClick from product cards */}
        <motion.div 
          className="mt-12 md:mt-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h3 
            className="text-center text-gray-600 text-sm font-semibold uppercase tracking-wider mb-6"
            variants={fadeInUp}
          >
            Our Key Loan Products
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={staggerContainer}
          >
            {heroData.keyProducts.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition border border-white/50 group"
                variants={fadeInUp}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="flex items-center gap-3 mb-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className={`p-2 ${product.color} rounded-lg group-hover:scale-110 transition`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <product.icon className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                </motion.div>
                <p className="text-sm text-gray-600 mb-1">{product.desc}</p>
                <p className="text-xs text-gray-500">{product.features}</p>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button 
                    variant="link" 
                    className="mt-5 p-0 h-auto text-blue-600"
                  >
                    <span className="flex items-center">
                      Know more 
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                      >
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Lead Form Modal - ONLY opens when Apply for Loan button is clicked */}
      <LeadFormModal 
        isOpen={isLeadModalOpen} 
        onClose={closeLeadModal} 
      />
    </section>
  );
}