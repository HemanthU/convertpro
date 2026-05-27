import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ title, description, icon: Icon, to }) => {
  return (
    <Link to={to} className="group block h-full">
      <div className="glass dark:bg-darkCard/80 rounded-3xl p-8 h-full hover-lift flex flex-col items-center text-center relative overflow-hidden">
        {/* Hover glow effect behind icon */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10 w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 text-accent flex items-center justify-center mb-6 shadow-sm group-hover:-translate-y-2 group-hover:shadow-glow transition-all duration-300">
          <Icon size={36} strokeWidth={1.5} className="group-hover:animate-pulse-slow" />
        </div>
        <h3 className="relative z-10 text-xl font-heading font-bold text-slate-900 dark:text-white mb-3 group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        <p className="relative z-10 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default ToolCard;
