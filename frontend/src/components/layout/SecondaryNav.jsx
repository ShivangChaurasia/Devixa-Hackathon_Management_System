import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SecondaryNav({ links }) {
  return (
    <div className="w-full border-b border-border mb-8 overflow-x-auto">
      <nav className="flex gap-6 min-w-max pb-px">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `pb-4 text-sm font-medium transition-colors border-b-2 ${
                isActive
                  ? 'border-accent-start text-foreground'
                  : 'border-transparent text-foreground/50 hover:text-foreground hover:border-foreground/20'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
