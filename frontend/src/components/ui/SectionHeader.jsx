import React from 'react';

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="text-foreground/60 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
