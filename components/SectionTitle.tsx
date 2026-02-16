import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, light = false }) => {
  return (
    <div className="text-center mb-16 relative z-10">
      <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${light ? 'text-white' : 'text-emerald-900'}`}>
        {title}
      </h2>
      <div className="flex justify-center items-center mb-4">
        <span className="h-[1px] w-12 bg-gold-500"></span>
        <span className="mx-2 text-gold-500 text-xl">♦</span>
        <span className="h-[1px] w-12 bg-gold-500"></span>
      </div>
      {subtitle && (
        <p className={`max-w-2xl mx-auto font-serif text-lg ${light ? 'text-gray-300' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;