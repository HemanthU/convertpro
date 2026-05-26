import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ title, description, icon: Icon, to }) => {
  return (
    <Link to={to} className="group block h-full">
      <div className="bg-white dark:bg-darkCard rounded-2xl p-6 h-full border border-slate-100 dark:border-slate-800 hover-lift flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );
};

export default ToolCard;
