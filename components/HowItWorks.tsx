import React from 'react';
import { Sparkles, Send, Gift } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Personalize",
    description: "Pour your heart into words, upload a cherished song, and choose a cake that speaks to their soul.",
    icon: <Sparkles className="w-8 h-8 text-magical-500 stroke-[1.25]" />,
    gradient: "from-pink-500/10 to-purple-500/10"
  },
  {
    number: "02",
    title: "Share the Link",
    description: "Get a private magical link and send it via any app. It works instantly on every device, everywhere.",
    icon: <Send className="w-8 h-8 text-amber-500 stroke-[1.25]" />,
    gradient: "from-amber-500/10 to-orange-500/10"
  },
  {
    number: "03",
    title: "Watch the Magic",
    description: "Your recipient enters a 3D world created just for them. Unforgettable, emotional, and pure joy.",
    icon: <Gift className="w-8 h-8 text-magical-400 stroke-[1.25]" />,
    gradient: "from-purple-500/10 to-magical-500/10"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-magical-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
            How the <span className="text-magical-300 font-hand text-5xl md:text-6xl">magic</span> happens
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto font-serif italic text-lg opacity-80">
            Three simple steps to create a moment they'll never forget.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-[120px] left-[15%] right-[15%] h-[1px] border-t border-dashed border-white/10 z-0"></div>

          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 lg:p-10 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col items-center text-center z-10"
            >
              {/* Step indicator */}
              <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${step.gradient} border border-white/10 mb-8`}>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                  Step {step.number}
                </span>
              </div>

              {/* Icon Container */}
              <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                {step.icon}
              </div>

              <h3 className="text-2xl font-serif text-white mb-4 tracking-tight group-hover:text-magical-300 transition-colors underline-offset-8 decoration-magical-500/30">
                {step.title}
              </h3>
              
              <p className="text-slate-400 font-serif italic leading-relaxed text-sm lg:text-base opacity-80 group-hover:opacity-100 transition-opacity">
                {step.description}
              </p>

              {/* Decorative Corner Glow */}
              <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${step.gradient} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
