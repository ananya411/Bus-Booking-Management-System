import React from 'react';
import logoImg from '../Assets/Logo.jpeg';

/**
 * Universal BusMitra Logo Component
 * Seamlessly integrates the official BusMitra brand identity (Logo.jpeg)
 * with the deep forest noir & electric lime color system.
 */
export default function Logo({
  className = 'h-10 sm:h-11 w-auto',
  variant = 'default', // 'default', 'card', 'ticket'
  showSubtitle = false,
  containerClassName = '',
}) {
  if (variant === 'card') {
    return (
      <div className={`inline-flex items-center bg-[#011810] p-1.5 rounded-xl border border-[#6DCE05]/30 shadow-lg ${containerClassName}`}>
        <img
          src={logoImg}
          alt="BusMitra - Bus Booking & Management"
          className={`${className} object-contain`}
          loading="eager"
        />
      </div>
    );
  }

  if (variant === 'ticket') {
    return (
      <div className={`inline-flex items-center bg-[#011810] px-3 py-1.5 rounded-2xl border border-[#6DCE05]/40 shadow-md ${containerClassName}`}>
        <img
          src={logoImg}
          alt="BusMitra"
          className={`${className} object-contain`}
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${containerClassName}`}>
      <img
        src={logoImg}
        alt="BusMitra - Bus Booking & Management"
        className={`${className} object-contain select-none`}
        loading="eager"
      />
    </div>
  );
}

export { logoImg };

