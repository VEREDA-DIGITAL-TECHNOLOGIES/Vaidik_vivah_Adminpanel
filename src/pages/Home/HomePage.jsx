import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';



import TotalUsersChart from './TotalUsersChart';
import { UserProgressChart } from './ProfileCompletionChart';
import { ConnectionDataChart } from './ConnectionsChart';
import GenderRatioChart from './GenderRatioChart';
import NewUserCard from './NewUserChart';
function HomePage() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="min-h-screen bg-gradient-to-br from-[#FFB3C5] via-[#fff0f5] to-[#FFB3C5] pt-16 px-4 sm:px-6 md:px-8 pb-16 overflow-x-hidden"
      >
        {/* HEADER */}
        <motion.div
          initial={{ scale: 0.8, rotateX: 90, opacity: 0 }}
          animate={{ scale: 1, rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 mb-10 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">
            Welcome to Admin Dashboard
          </h1>
        </motion.div>

        {/* Dashboard Charts */}
        <div className="space-y-10 max-w-screen-xl mx-auto w-full">
          {/* Total Users + New Users */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, skewY: 6, x: -100 }}
              animate={{ opacity: 1, skewY: 0, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="sm:col-span-2 bg-white p-4 rounded-2xl shadow-md"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Total Users Over Time</h2>
              <TotalUsersChart />
            </motion.div>

            <motion.div
              whileHover={{ rotateZ: 1.5, scale: 1.03 }}
              initial={{ scale: 0, rotateZ: 20, opacity: 0 }}
              animate={{ scale: 1, rotateZ: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="bg-white p-4 rounded-2xl shadow-md"
            >
              <NewUserCard />
            </motion.div>
          </div>

          {/* Smaller Cards Row */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="flex flex-col sm:flex-row flex-wrap gap-6"
          >
            {[
              { title: 'Gender Ratio', component: <GenderRatioChart /> },
              { title: 'Profile Completion Rate', component: < UserProgressChart/> },
              { title: 'Connections Made', component: <ConnectionDataChart/> }
            ].map(({ title, component }, idx) => (
              <motion.div
                key={title}
                variants={{
                  hidden: { y: 100, opacity: 0, scale: 0.9 },
                  visible: { y: 0, opacity: 1, scale: 1 }
                }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 12,
                  delay: 0.05 * idx
                }}
                whileHover={{ scale: 1.025 }}
                className="flex-1 min-w-[280px] bg-white p-4 rounded-2xl shadow-md"
              >
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                {component}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default HomePage;
