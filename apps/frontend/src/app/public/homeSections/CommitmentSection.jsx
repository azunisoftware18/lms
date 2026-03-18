import { motion } from 'framer-motion';
import { commitmentData } from '../../../lib/dumyData';

export default function CommitmentSection() {
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 shadow-lg relative"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleIn}
        >
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Heading - NO ANIMATION HERE */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Our <span className="text-blue-600">{commitmentData.title}</span>
            </h2>
            
            <motion.div 
              className="space-y-6 text-gray-700 text-lg leading-relaxed"
              variants={staggerContainer}
            >
              {commitmentData.paragraphs.map((para, index) => (
                <motion.p 
                  key={index} 
                  variants={fadeInUp}
                  whileHover={{ 
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                  className="hover:text-gray-900 transition-colors"
                >
                  {para}
                </motion.p>
              ))}
            </motion.div>

            {/* Decorative line at the end */}
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full mx-auto mt-8"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 96, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}