import { motion } from "motion/react";
const ProjectDetails = ({
  title,
  description,
  subDescription,
  image,
  tags,
  href,
  closeModal,
}) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModal}
    >
      <motion.div
        className="relative max-w-2xl border shadow-2xl rounded-2xl bg-gradient-to-l from-midnight to-navy border-white/10 mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          onClick={closeModal}
          className="absolute p-2 rounded-full top-5 right-5 bg-midnight/80 hover:bg-red-500/80 transition-colors duration-300 z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <img src="assets/close.svg" className="w-6 h-6" alt="Close" />
        </motion.button>
        
        <motion.img 
          src={image} 
          alt={title} 
          className="w-full rounded-t-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
        
        <div className="p-6">
          <motion.h5 
            className="mb-3 text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h5>
          
          <motion.p 
            className="mb-4 font-normal text-neutral-400 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {description}
          </motion.p>
          
          {subDescription.map((subDesc, index) => (
            <motion.p 
              key={index}
              className="mb-3 font-normal text-neutral-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {subDesc}
            </motion.p>
          ))}
          
          <motion.div 
            className="flex items-center justify-between mt-6 pt-4 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex gap-3 flex-wrap">
              {tags.map((tag, index) => (
                <motion.img
                  key={tag.id}
                  src={tag.path}
                  alt={tag.name}
                  className="rounded-lg size-10 hover:scale-110 transition-transform duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
            
            <motion.a 
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 font-medium text-white bg-gradient-to-r from-aqua to-royal rounded-full hover:shadow-lg hover:shadow-aqua/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Project
              <motion.img 
                src="assets/arrow-up.svg" 
                className="size-4"
                whileHover={{ rotate: 45 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetails;
