import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-start to-accent-end flex items-center justify-center font-bold text-foreground shadow-lg">
                D
              </div>
              <span className="font-bold text-xl text-foreground">Devixa</span>
            </div>
            <p className="text-sm text-foreground/50 leading-relaxed">
              The enterprise-grade hackathon management platform for universities, companies, and communities.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li><NavLink to="/hackathons" className="text-sm text-foreground/50 hover:text-foreground transition-colors">Browse Hackathons</NavLink></li>
              <li><NavLink to="/login" className="text-sm text-foreground/50 hover:text-foreground transition-colors">For Organizers</NavLink></li>
              <li><NavLink to="/login" className="text-sm text-foreground/50 hover:text-foreground transition-colors">For Judges</NavLink></li>
              <li><NavLink to="/login" className="text-sm text-foreground/50 hover:text-foreground transition-colors">Pricing</NavLink></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer">Documentation</span></li>
              <li><span className="text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer">API Reference</span></li>
              <li><span className="text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer">Blog</span></li>
              <li><span className="text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer">Changelog</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer">About</span></li>
              <li><span className="text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer">Careers</span></li>
              <li><span className="text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer">Contact</span></li>
              <li><span className="text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/40">&copy; {new Date().getFullYear()} Devixa. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-foreground/40 hover:text-foreground transition-colors cursor-pointer">Terms</span>
            <span className="text-sm text-foreground/40 hover:text-foreground transition-colors cursor-pointer">Privacy</span>
            <span className="text-sm text-foreground/40 hover:text-foreground transition-colors cursor-pointer">Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
