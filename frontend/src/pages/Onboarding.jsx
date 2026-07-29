import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import { apiClient } from '../services/apiClient';
import { User, Briefcase, Link as LinkIcon, Phone, AtSign, Key, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const getOnboardingSchema = (provider) => {
  return z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    role: z.enum(['PARTICIPANT', 'JUDGE', 'ORGANIZER'], { required_error: "Role is required" }),
    githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    phone: z.string().min(5, "Enter a valid phone number"),
    username: z.string().regex(/^[a-z0-9_]{4,20}$/, "4-20 chars, lowercase, numbers, underscores only"),
    password: provider === 'GOOGLE' 
      ? z.string().regex(passwordPattern, "Weak password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)").min(8)
      : z.string().optional().or(z.literal('')),
  });
};

export default function Onboarding({ user, setUser }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null); // null, true, false
  const [usernameChecking, setUsernameChecking] = useState(false);

  const provider = user?.provider || 'EMAIL';
  const schema = getOnboardingSchema(provider);

  const { register, handleSubmit, watch, trigger, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      role: user?.role === 'ADMIN' ? 'ADMIN' : undefined,
      githubUrl: user?.githubUrl || '',
      phone: user?.phone || '',
      username: user?.username || '',
      password: '',
    },
    mode: 'onChange'
  });

  const formValues = watch();

  // Dynamic step array based on provider and role
  const steps = [
    { id: 1, title: 'Full Name', subtitle: 'Confirm your name', icon: User, fields: ['name'] },
    { id: 2, title: 'Role Selection', subtitle: 'How will you use Devixa?', icon: Briefcase, fields: ['role'] },
    ...(formValues.role === 'PARTICIPANT' ? [{ id: 3, title: 'GitHub Profile', subtitle: 'Connect your code', icon: LinkIcon, fields: ['githubUrl'] }] : []),
    { id: 4, title: 'Phone Number', subtitle: 'Stay connected', icon: Phone, fields: ['phone'] },
    { id: 5, title: 'Platform Username', subtitle: 'Your unique Devixa ID', icon: AtSign, fields: ['username'] },
    ...(provider === 'GOOGLE' ? [{ id: 6, title: 'Create Password', subtitle: 'For email login later', icon: Key, fields: ['password'] }] : []),
    { id: 7, title: 'Review', subtitle: 'Ready to go?', icon: CheckCircle, fields: [] }
  ];

  // Re-map step indices because some steps are conditional
  const activeSteps = steps.map((s, idx) => ({ ...s, stepIndex: idx + 1 }));
  const currentStepData = activeSteps.find(s => s.stepIndex === step);

  const usernameValue = watch('username');
  
  // Real-time username check
  useEffect(() => {
    if (!usernameValue || usernameValue.length < 4 || errors.username) {
      setUsernameAvailable(null);
      return;
    }
    
    const checkUsername = async () => {
      setUsernameChecking(true);
      try {
        const res = await apiClient.get(`/users/check-username/${usernameValue}`);
        setUsernameAvailable(res.available);
      } catch (err) {
        setUsernameAvailable(false);
      } finally {
        setUsernameChecking(false);
      }
    };
    
    const timeout = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeout);
  }, [usernameValue, errors.username]);

  const handleNext = async () => {
    if (currentStepData.fields.length > 0) {
      const isValid = await trigger(currentStepData.fields);
      if (!isValid) return;
    }
    if (currentStepData.fields.includes('username') && usernameAvailable === false) {
      return; // Block if username is taken
    }
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        role: data.role,
        phone: data.phone,
        username: data.username,
        githubUrl: data.githubUrl,
        password: data.password, // Only processed in backend if Google
      };

      const res = await apiClient.patch('/users/me/onboarding', payload);
      
      const updatedUser = res.user || res;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);

      navigate('/app/dashboard');
    } catch (err) {
      console.error('Failed onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (name, type = 'text', placeholder, label) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground/70">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors"
      />
      {errors[name] && <p className="text-status-error text-xs">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-start/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-end/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        <div className="mb-8">
          <div className="flex justify-between text-xs text-foreground/50 mb-2 font-medium">
            <span>Step {step} of {activeSteps.length}</span>
            <span>{Math.round((step / activeSteps.length) * 100)}% Completed</span>
          </div>
          <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-accent-start to-accent-end rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / activeSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <GlassCard hover={false} className="p-8 md:p-10 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-grow flex flex-col"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-start/20 to-accent-end/20 border border-accent-start/30 flex items-center justify-center text-accent-start shrink-0">
                  {currentStepData && <currentStepData.icon size={24} />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{currentStepData?.title}</h2>
                  <p className="text-sm text-foreground/50">{currentStepData?.subtitle}</p>
                </div>
              </div>

              <div className="flex-grow flex flex-col justify-center">
                {currentStepData?.id === 1 && renderField('name', 'text', 'John Doe', 'Full Name')}

                {currentStepData?.id === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['PARTICIPANT', 'ORGANIZER', 'JUDGE'].map((role) => (
                      <div 
                        key={role}
                        onClick={() => setValue('role', role, { shouldValidate: true })}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${formValues.role === role ? 'bg-accent-start/20 border-accent-start' : 'bg-background border-border hover:border-foreground/20'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground capitalize">{role.toLowerCase()}</h4>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formValues.role === role ? 'border-accent-start' : 'border-foreground/30'}`}>
                            {formValues.role === role && <div className="w-2 h-2 rounded-full bg-accent-start" />}
                          </div>
                        </div>
                      </div>
                    ))}
                    {errors.role && <p className="text-status-error text-xs col-span-2">{errors.role.message}</p>}
                  </div>
                )}

                {currentStepData?.id === 3 && renderField('githubUrl', 'url', 'https://github.com/username', 'GitHub Profile URL')}
                
                {currentStepData?.id === 4 && renderField('phone', 'tel', '+1 234 567 8900', 'Phone Number')}

                {currentStepData?.id === 5 && (
                  <div className="space-y-1.5 relative">
                    <label className="block text-sm font-medium text-foreground/70">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50">@</span>
                      <input
                        {...register('username')}
                        type="text"
                        placeholder="username"
                        className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-3 text-foreground focus:border-accent-start outline-none transition-colors"
                      />
                    </div>
                    {errors.username && <p className="text-status-error text-xs">{errors.username.message}</p>}
                    {!errors.username && usernameChecking && <p className="text-foreground/50 text-xs">Checking availability...</p>}
                    {!errors.username && !usernameChecking && usernameAvailable === true && <p className="text-status-success text-xs flex items-center gap-1"><CheckCircle size={12}/> Available</p>}
                    {!errors.username && !usernameChecking && usernameAvailable === false && <p className="text-status-error text-xs">Username is already taken</p>}
                  </div>
                )}

                {currentStepData?.id === 6 && renderField('password', 'password', '••••••••', 'Create a Password')}

                {currentStepData?.id === 7 && (
                  <div className="space-y-4 text-sm text-foreground/70 bg-foreground/5 p-6 rounded-xl border border-foreground/10">
                    <div className="flex justify-between border-b border-foreground/10 pb-2">
                      <span>Name:</span><span className="text-foreground font-medium">{formValues.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-foreground/10 pb-2">
                      <span>Role:</span><span className="text-foreground font-medium capitalize">{formValues.role?.toLowerCase()}</span>
                    </div>
                    <div className="flex justify-between border-b border-foreground/10 pb-2">
                      <span>Username:</span><span className="text-foreground font-medium">@{formValues.username}</span>
                    </div>
                    <div className="flex justify-between border-b border-foreground/10 pb-2">
                      <span>Phone:</span><span className="text-foreground font-medium">{formValues.phone}</span>
                    </div>
                    {formValues.githubUrl && (
                      <div className="flex justify-between pb-2">
                        <span>GitHub:</span><span className="text-accent-start font-medium truncate max-w-[200px]">{formValues.githubUrl}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border shrink-0">
                {step > 1 ? (
                  <button 
                    onClick={handleBack} 
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : <div />}

                {step < activeSteps.length ? (
                  <GradientButton onClick={handleNext} type="button" className="px-6" disabled={currentStepData?.id === 5 && usernameAvailable !== true}>
                    Next Step <ArrowRight size={16} className="ml-2" />
                  </GradientButton>
                ) : (
                  <GradientButton onClick={handleSubmit(onSubmit)} disabled={loading} className="px-6">
                    {loading ? 'Saving...' : 'Complete Setup'}
                  </GradientButton>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
}
