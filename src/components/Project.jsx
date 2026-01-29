import React, { useState } from "react";
import { motion } from "framer-motion";
import ProjectDetails from "./ProjectDetails";

const Project = ({
  title,
  description,
  subDescription,
  href,
  image,
  tags,
  setPreview,
}) => {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <>
      <motion.div
        className="flex-wrap items-center justify-between py-10 space-y-14 sm:flex sm:space-y-0 group cursor-pointer"
        onMouseEnter={() => setPreview(image)}
        onMouseLeave={() => setPreview(null)}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex-1"
          whileHover={{ x: 10 }}
          transition={{ duration: 0.2 }}
        >
          <motion.p 
            className="text-2xl font-semibold group-hover:text-aqua transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            {title}
          </motion.p>
          <motion.div 
            className="flex gap-5 mt-2 text-sand flex-wrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {tags.map((tag, index) => (
              <motion.span 
                key={tag.id}
                className="px-3 py-1 bg-storm rounded-full text-sm hover:bg-aqua hover:text-primary transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                {tag.name}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
        <motion.button
          onClick={() => setIsHidden(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-aqua to-royal rounded-full text-white font-medium hover:shadow-lg hover:shadow-aqua/25 transition-all duration-300 group/btn"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(51, 194, 204, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Read More</span>
          <motion.img 
            src="assets/arrow-right.svg" 
            className="w-5 group-hover/btn:translate-x-1 transition-transform duration-300" 
          />
        </motion.button>
      </motion.div>
      <motion.div 
        className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      {isHidden && (
        <ProjectDetails
          title={title}
          description={description}
          subDescription={subDescription}
          image={image}
          tags={tags}
          href={href}
          closeModal={() => setIsHidden(false)}
        />
      )}
    </>
  );
};

export default Project;
