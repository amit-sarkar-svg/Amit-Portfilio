import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const SkillsRadar = () => {
  const skillsData = [
    { skill: 'Python', value: 90, fullMark: 100 },
    { skill: 'Machine Learning', value: 85, fullMark: 100 },
    { skill: 'Deep Learning', value: 80, fullMark: 100 },
    { skill: 'TensorFlow', value: 75, fullMark: 100 },
    { skill: 'PyTorch', value: 70, fullMark: 100 },
    { skill: 'Data Analysis', value: 85, fullMark: 100 },
    { skill: 'NLP', value: 75, fullMark: 100 },
    { skill: 'Computer Vision', value: 70, fullMark: 100 },
    { skill: 'JavaScript', value: 80, fullMark: 100 },
    { skill: 'React', value: 75, fullMark: 100 },
    { skill: 'Git', value: 85, fullMark: 100 },
    { skill: 'SQL', value: 80, fullMark: 100 },
  ];

  return (
    <motion.div 
      className="w-full h-96 bg-gradient-to-br from-storm/50 to-indigo/50 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.h3 
        className="text-xl font-bold text-center mb-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Technical Skills
      </motion.h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={skillsData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid 
            stroke="#ffffff" 
            strokeOpacity={0.2}
            gridType="polygon"
          />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ 
              fontSize: 12, 
              fill: '#ffffff',
              fontWeight: 500
            }}
            axisLine={{ stroke: '#ffffff', strokeOpacity: 0.3 }}
          />
          <PolarRadiusAxis 
            angle={0} 
            domain={[0, 100]} 
            tick={{ 
              fontSize: 10, 
              fill: '#ffffff',
              opacity: 0.6
            }}
            axisLine={{ stroke: '#ffffff', strokeOpacity: 0.3 }}
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#33c2cc"
            fill="#33c2cc"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{ fill: '#33c2cc', strokeWidth: 2, r: 4 }}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      <motion.div 
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-neutral-400">
          Skills rated on a scale of 0-100 based on experience and proficiency
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SkillsRadar;
