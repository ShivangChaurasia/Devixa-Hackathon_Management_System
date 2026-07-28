import React, { useEffect } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import EmptyState from '../components/ui/EmptyState';
import { Award, Download, Share2, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../services/apiClient';
import { useApi } from '../hooks/useApi';

export default function Certificates() {
  const { data: certsRes, loading, execute: fetchCerts } = useApi(apiClient.get);

  useEffect(() => {
    fetchCerts('/certificates').catch(() => null);
  }, [fetchCerts]);

  const certificates = certsRes?.certificates || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SectionHeader
        title="Certificates"
        subtitle="Your achievements and recognitions across all hackathons"
      />

      {loading ? (
        <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-accent-start/30 border-t-accent-start rounded-full animate-spin"></div></div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="relative overflow-hidden">
                {/* Decorative gradient corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-start/20 to-transparent rounded-bl-full pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-start/20 to-accent-end/20 border border-accent-start/30 flex items-center justify-center">
                      <Award className="text-accent-start" size={28} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-status-success/20 text-status-success border border-status-success/30">
                      Verified
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">{cert.type || 'Certificate of Participation'}</h3>
                  <p className="text-sm text-white/50 mb-1">{cert.hackathon?.title || 'Hackathon'}</p>
                  <p className="text-xs text-white/30">Issued by {cert.hackathon?.organization || 'Organization'} • {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <QrCode size={14} />
                      <span className="font-mono">{cert.verificationCode || cert._id?.slice(-8).toUpperCase() || 'VER-XXXX'}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="Download">
                        <Download size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="Share">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Participate in hackathons and earn certificates. They'll appear here with QR verification."
        />
      )}
    </div>
  );
}
