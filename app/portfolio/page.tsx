// 'use client'
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   ChevronDown, Mail, Github, Linkedin, ExternalLink, Code, Palette, Zap, Star,
//   Terminal, Cpu, Gamepad2, Music, Play, Pause, Volume2, Download, Eye, ArrowRight,
//   Sparkles, Rocket, Brain, Coffee, Heart
// } from 'lucide-react';

// // --- Definiuj interfejsy typów dla stanów ---

// interface Particle {
//   id: number;
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   size: number;
//   color: string;
//   trail: { x: number; y: number }[];
// }

// interface MatrixDrop {
//   id: number;
//   x: number;
//   y: number;
//   speed: number;
//   chars: string;
//   currentChar: number;
// }

// interface Project {
//   title: string;
//   description: string;
//   tech: string[];
//   color: string;
//   demo: string;
//   github: string;
//   status: string;
//   metrics: Record<string, string>;
// }

// interface Skill {
//   name: string;
//   icon: React.ComponentType<any>;
//   level: number;
//   color: string;
//   specialty: string;
// }

// interface Achievement {
//   icon: React.ComponentType<any>;
//   count: string;
//   label: string;
//   color: string;
// }

// interface LabProject {
//   name: string;
//   description: string;
//   tech: string;
//   status: string;
//   color: string;
// }

// interface Contact {
//   icon: React.ComponentType<any>;
//   label: string;
//   value: string;
//   color: string;
//   desc: string;
// }

// const RetroPortfolio: React.FC = () => {
//   const [currentSection, setCurrentSection] = useState<number>(0);
//   const [isLoaded, setIsLoaded] = useState<boolean>(false);
//   const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
//   const [particles, setParticles] = useState<Particle[]>([]);
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);
//   const [glitchActive, setGlitchActive] = useState<boolean>(false);
//   const [matrixRain, setMatrixRain] = useState<MatrixDrop[]>([]);
//   const [typedText, setTypedText] = useState<string>('');
//   const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
//   const [showTerminal, setShowTerminal] = useState<boolean>(false);
//   const [terminalLines, setTerminalLines] = useState<string[]>([]);
//   const [codeLines, setCodeLines] = useState<number>(0);
//   const [coffeeCount, setCoffeeCount] = useState<number>(1337);

//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);

//   const heroTexts: string[] = [
//     'FULL STACK DEVELOPER',
//     'CREATIVE CODER',
//     'DIGITAL ARTIST',
//     'TECH INNOVATOR'
//   ];

//   const terminalCommands: string[] = [
//     '> whoami',
//     'developer@portfolio:~$ cat skills.txt',
//     '> React.js ████████████ 95%',
//     '> TypeScript ███████████ 92%',
//     '> Node.js ██████████ 88%',
//     '> Python ████████ 85%',
//     'developer@portfolio:~$ ls projects/',
//     '> cyberdash.exe  neonplayer.app  vaporweave.io',
//     'developer@portfolio:~$ echo "Let\'s build something amazing!"',
//     '> Let\'s build something amazing!',
//     'developer@portfolio:~$ █'
//   ];

//   useEffect(() => {
//     setIsLoaded(true);

//     const newParticles: Particle[] = Array.from({ length: 80 }, (_, i) => ({
//       id: i,
//       x: Math.random() * window.innerWidth,
//       y: Math.random() * window.innerHeight,
//       vx: (Math.random() - 0.5) * 3,
//       vy: (Math.random() - 0.5) * 3,
//       size: Math.random() * 4 + 1,
//       color: ['#00ffff', '#ff00ff', '#ffff00', '#ff0080'][Math.floor(Math.random() * 4)],
//       trail: []
//     }));
//     setParticles(newParticles);

//     const initMatrixRain = () => {
//       const drops: MatrixDrop[] = Array.from({ length: 50 }, (_, i) => ({
//         id: i,
//         x: Math.random() * window.innerWidth,
//         y: Math.random() * window.innerHeight,
//         speed: Math.random() * 3 + 1,
//         chars: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
//         currentChar: 0
//       }));
//       setMatrixRain(drops);
//     };
//     initMatrixRain();

//     const glitchInterval = setInterval(() => {
//       if (Math.random() < 0.1) {
//         setGlitchActive(true);
//         setTimeout(() => setGlitchActive(false), 200);
//       }
//     }, 3000);

//     return () => {
//       clearInterval(glitchInterval);
//     };
//   }, []);

//   useEffect(() => {
//     const text = heroTexts[currentTextIndex];
//     if (typedText.length < text.length) {
//       const timer = setTimeout(() => {
//         setTypedText(text.slice(0, typedText.length + 1));
//       }, 100);
//       return () => clearTimeout(timer);
//     } else {
//       const timer = setTimeout(() => {
//         setTypedText('');
//         setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [typedText, currentTextIndex, heroTexts]);

//   useEffect(() => {
//     if (showTerminal && terminalLines.length < terminalCommands.length) {
//       const timer = setTimeout(() => {
//         setTerminalLines(prev => [...prev, terminalCommands[prev.length]]);
//       }, 800);
//       return () => clearTimeout(timer);
//     }
//   }, [showTerminal, terminalLines, terminalCommands]);

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   useEffect(() => {
//     const animateParticles = () => {
//       setParticles(prev =>
//         prev.map(particle => {
//           const newX = (particle.x + particle.vx + window.innerWidth) % window.innerWidth;
//           const newY = (particle.y + particle.vy + window.innerHeight) % window.innerHeight;
//           return {
//             ...particle,
//             x: newX,
//             y: newY,
//             trail: [...particle.trail.slice(-5), { x: particle.x, y: particle.y }]
//           };
//         })
//       );
//     };
//     const interval = setInterval(animateParticles, 50);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const animateMatrix = () => {
//       setMatrixRain(prev =>
//         prev.map(drop => ({
//           ...drop,
//           y: (drop.y + drop.speed) % (window.innerHeight + 50),
//           currentChar: (drop.currentChar + 1) % drop.chars.length
//         }))
//       );
//     };
//     const interval = setInterval(animateMatrix, 100);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCodeLines(prev => prev + Math.floor(Math.random() * 3));
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   const sections: string[] = ['home', 'about', 'projects', 'lab', 'contact'];

//   const projects: Project[] = [
//     {
//       title: "CyberDash 3000",
//       description: "Futurystyczny dashboard z AI analytics, real-time 3D visualizations i holograficznym interfejsem",
//       tech: ["React", "Three.js", "TensorFlow.js", "WebGL", "Socket.io"],
//       color: "from-cyan-400 via-blue-500 to-purple-600",
//       demo: "https://cyberdash.demo",
//       github: "https://github.com/dev/cyberdash",
//       status: "LIVE",
//       metrics: { users: "50K+", performance: "99.9%", rating: "4.9/5" }
//     },
//     {
//       title: "Neon Music Synthesizer",
//       description: "WebAudio synthesizer z spektrografem, efektami wizualnymi i AI-powered beat generation",
//       tech: ["Web Audio API", "Canvas", "ML5.js", "WASM", "TypeScript"],
//       color: "from-pink-400 via-purple-500 to-cyan-600",
//       demo: "https://neonsynth.demo",
//       github: "https://github.com/dev/neonsynth",
//       status: "BETA",
//       metrics: { tracks: "10K+", artists: "2.5K", sessions: "100K+" }
//     },
//     {
//       title: "VaporWave Metaverse",
//       description: "Virtual reality world builder z blockchain integration i NFT marketplace",
//       tech: ["WebXR", "Babylon.js", "Solidity", "IPFS", "Node.js"],
//       color: "from-purple-400 via-pink-500 to-orange-600",
//       demo: "https://vaporverse.demo",
//       github: "https://github.com/dev/vaporverse",
//       status: "COMING SOON",
//       metrics: { worlds: "500+", users: "25K", nfts: "5K+" }
//     },
//     {
//       title: "Neural Code Assistant",
//       description: "AI-powered code completion z natural language processing i automated testing",
//       tech: ["Python", "Transformer", "FastAPI", "Docker", "PostgreSQL"],
//       color: "from-yellow-400 via-red-500 to-pink-600",
//       demo: "https://neuralcode.demo",
//       github: "https://github.com/dev/neuralcode",
//       status: "ALPHA",
//       metrics: { accuracy: "94%", speed: "< 100ms", developers: "1K+" }
//     }
//   ];

//   const skills: Skill[] = [
//     { name: "Frontend Magic", icon: Code, level: 98, color: "cyan", specialty: "React Ecosystem" },
//     { name: "Backend Wizardry", icon: Cpu, level: 92, color: "purple", specialty: "Microservices" },
//     { name: "UI/UX Artistry", icon: Palette, level: 95, color: "pink", specialty: "Motion Design" },
//     { name: "DevOps Mastery", icon: Terminal, level: 88, color: "yellow", specialty: "Cloud Native" },
//     { name: "AI/ML Innovation", icon: Brain, level: 85, color: "orange", specialty: "Deep Learning" },
//     { name: "Creative Coding", icon: Sparkles, level: 96, color: "green", specialty: "Generative Art" }
//   ];

//   const achievements: Achievement[] = [
//     { icon: Rocket, count: coffeeCount.toLocaleString(), label: "Cups of Coffee", color: "yellow" },
//     { icon: Heart, count: "99.9%", label: "Client Satisfaction", color: "pink" },
//     { icon: Zap, count: codeLines.toLocaleString(), label: "Lines of Code", color: "purple" },
//     { icon: Star, count: "50+", label: "Projects Launched", color: "cyan" }
//   ];

//   const labProjects: LabProject[] = [
//     { name: "Hologram Generator", description: "CSS 3D holographic effects with ray tracing simulation", tech: "Pure CSS + Math", status: "Experimental", color: "cyan" },
//     { name: "Voice Synth UI", description: "Web Speech API dengan real-time audio visualization", tech: "Web Audio + Canvas", status: "Prototype", color: "purple" },
//     { name: "Quantum Particles", description: "WebGL particle system with physics simulation", tech: "WebGL + Physics", status: "Active", color: "pink" },
//     { name: "AI Art Engine", description: "TensorFlow.js powered generative art creation", tech: "ML + Creativity", status: "Research", color: "orange" }
//   ];

//   const toggleMusic = () => {
//     setIsPlaying(prev => !prev);
//   };

//   const downloadCV = () => {
//     console.log('Downloading CV...');
//   };

//   const handleProjectClick = (project: Project) => {
//     console.log('Opening project:', project.title);
//   };

//   return (
//     <div className="min-h-screen bg-black text-white overflow-hidden relative">
//       {/* Enhanced Animated Background */}
//       <div className="fixed inset-0 z-0">
//         {/* Dynamic gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 via-cyan-900/10 to-pink-900/30 animate-pulse"></div>
       
//         {/* Enhanced Grid Pattern */}
//         <div
//           className={`absolute inset-0 opacity-30 transition-all duration-300 ${glitchActive ? 'animate-pulse' : ''}`}
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(0,255,255,0.4) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(255,0,255,0.3) 1px, transparent 1px)
//             `,
//             backgroundSize: '40px 40px',
//             transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) ${glitchActive ? 'skew(2deg)' : ''}`
//           }}
//         ></div>

//         {/* Matrix Rain */}
//         {matrixRain.map(drop => (
//           <div
//             key={drop.id}
//             className="absolute text-green-400 font-mono text-xs opacity-60"
//             style={{
//               left: drop.x,
//               top: drop.y,
//               textShadow: '0 0 5px #00ff00'
//             }}
//           >
//             {drop.chars[drop.currentChar]}
//           </div>
//         ))}

//         {/* Enhanced Floating Particles with Trails */}
//         {particles.map(particle => (
//           <div key={particle.id}>
//             {/* Particle trails */}
//             {particle.trail.map((point, index) => (
//               <div
//                 key={index}
//                 className="absolute rounded-full"
//                 style={{
//                   left: point.x,
//                   top: point.y,
//                   width: `${particle.size * (index + 1) / particle.trail.length}px`,
//                   height: `${particle.size * (index + 1) / particle.trail.length}px`,
//                   backgroundColor: particle.color,
//                   opacity: 0.3 * (index + 1) / particle.trail.length,
//                   boxShadow: `0 0 ${6 + index}px ${particle.color}`
//                 }}
//               ></div>
//             ))}
//             {/* Main particle */}
//             <div
//               className="absolute rounded-full"
//               style={{
//                 left: particle.x,
//                 top: particle.y,
//                 width: `${particle.size}px`,
//                 height: `${particle.size}px`,
//                 backgroundColor: particle.color,
//                 boxShadow: `0 0 ${10 + particle.size}px ${particle.color}`
//               }}
//             ></div>
//           </div>
//         ))}

//         {/* Enhanced Scanlines */}
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="w-full h-full opacity-15" style={{
//             background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff41 2px, #00ff41 3px)',
//             animation: 'scanline 0.1s linear infinite'
//           }}></div>
//         </div>

//         {/* Spotlight effect following mouse */}
//         <div
//           className="absolute w-96 h-96 pointer-events-none"
//           style={{
//             left: mousePosition.x - 192,
//             top: mousePosition.y - 192,
//             background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)',
//             filter: 'blur(20px)'
//           }}
//         ></div>
//       </div>

//       {/* Enhanced Navigation */}
//       <nav className="fixed top-0 left-0 right-0 z-50 p-6">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <div className="text-2xl font-bold text-cyan-400 animate-pulse">DEV.EXE</div>
//             <div className="flex items-center space-x-2 text-sm text-gray-400">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//               <span>ONLINE</span>
//             </div>
//           </div>
         
//           <div className="flex justify-center space-x-6">
//             {sections.map((section, index) => (
//               <button
//                 key={section}
//                 onClick={() => setCurrentSection(index)}
//                 className={`px-4 py-2 text-sm uppercase tracking-wider transition-all duration-300 border bg-black/70 backdrop-blur-sm hover:scale-110
//                   ${currentSection === index
//                     ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 shadow-lg shadow-cyan-400/30'
//                     : 'border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400'
//                   }`}
//                 style={{
//                   clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
//                   textShadow: currentSection === index ? '0 0 10px #00ffff' : 'none'
//                 }}
//               >
//                 {section}
//               </button>
//             ))}
//           </div>

//           <div className="flex items-center space-x-4">
//             <button
//               onClick={toggleMusic}
//               className="p-2 border border-purple-500 bg-black/70 backdrop-blur-sm hover:bg-purple-500/20 transition-all duration-300"
//             >
//               {isPlaying ? <Pause className="text-purple-400" size={16} /> : <Play className="text-purple-400" size={16} />}
//             </button>
//             <button className="p-2 border border-pink-500 bg-black/70 backdrop-blur-sm hover:bg-pink-500/20 transition-all duration-300">
//               <Volume2 className="text-pink-400" size={16} />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="relative z-10">
//         {/* Enhanced Hero Section */}
//         {currentSection === 0 && (
//           <section className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
//             <div className="text-center space-y-8 p-8 max-w-6xl mx-auto">
//               <div className="relative mb-12">
//                 <h1 className={`text-8xl md:text-9xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent ${glitchActive ? 'animate-bounce' : ''}`}>
//                   {typedText}
//                   <span className="animate-pulse">|</span>
//                 </h1>
//                 <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-cyan-400/10 transform translate-x-3 translate-y-3 -z-10">
//                   {typedText}
//                 </div>
//               </div>
             
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
//                 {achievements.map((achievement, index) => (
//                   <div
//                     key={index}
//                     className={`p-4 bg-black/50 backdrop-blur-sm border border-${achievement.color}-400/50 hover:border-${achievement.color}-400 transition-all duration-300 transform hover:scale-105`}
//                     style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
//                   >
//                     <achievement.icon className={`text-${achievement.color}-400 mx-auto mb-2`} size={24} />
//                     <div className={`text-2xl font-bold text-${achievement.color}-400`}>{achievement.count}</div>
//                     <div className="text-xs text-gray-400 uppercase">{achievement.label}</div>
//                   </div>
//                 ))}
//               </div>

//               <div className="relative overflow-hidden p-6 bg-black/30 backdrop-blur-sm border border-cyan-400/30 mb-12">
//                 <p className="text-xl text-cyan-300 font-mono">
//                   &gt; Tworzę cyfrową przyszłość, jeden piksel na raz_
//                 </p>
//                 <div className="absolute right-4 top-6 w-3 h-6 bg-cyan-400 animate-pulse"></div>
//               </div>

//               <div className="flex justify-center space-x-8 mb-12">
//                 {[
//                   { Icon: Github, color: 'purple', label: 'GitHub' },
//                   { Icon: Linkedin, color: 'blue', label: 'LinkedIn' },
//                   { Icon: Mail, color: 'pink', label: 'Email' }
//                 ].map(({ Icon, color, label }, i) => (
//                   <div
//                     key={i}
//                     className={`group relative p-6 border-2 border-${color}-500 bg-black/50 backdrop-blur-sm hover:bg-${color}-500/20 transition-all duration-300 cursor-pointer transform hover:scale-110 hover:rotate-2`}
//                     style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}
//                   >
//                     <Icon size={28} className={`text-${color}-400 group-hover:text-${color}-300`} />
//                     <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
//                       {label}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-center space-x-6">
//                 <button
//                   onClick={() => setShowTerminal(true)}
//                   className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold text-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
//                   style={{ clipPath: 'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)' }}
//                 >
//                   <Terminal className="inline mr-2" size={20} />
//                   OPEN TERMINAL
//                 </button>
//                 <button
//                   onClick={downloadCV}
//                   className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
//                   style={{ clipPath: 'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)' }}
//                 >
//                   <Download className="inline mr-2" size={20} />
//                   DOWNLOAD CV
//                 </button>
//               </div>

//               <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
//                 <ChevronDown size={32} className="text-cyan-400" />
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Enhanced About Section */}
//         {currentSection === 1 && (
//           <section className="min-h-screen flex items-center justify-center p-8 transition-all duration-1000">
//             <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//               <div className="space-y-8">
//                 <h2 className="text-7xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text">
//                   ABOUT_ME.JSON
//                 </h2>
//                 <div className="space-y-6 text-lg text-gray-300 font-mono">
//                   <div className="p-4 bg-black/30 backdrop-blur-sm border-l-4 border-cyan-400">
//                     <span className="text-cyan-400">{">"}</span> Jestem fullstack developer z 5+ lat doświadczenia
//                   </div>
//                   <div className="p-4 bg-black/30 backdrop-blur-sm border-l-4 border-purple-400">
//                     <span className="text-purple-400">{">"}</span> Specjalizuję się w React, Node.js i nowoczesnych technologiach web
//                   </div>
//                   <div className="p-4 bg-black/30 backdrop-blur-sm border-l-4 border-pink-400">
//                     <span className="text-pink-400">{">"}</span> Uwielbiam łączyć kod z designem i tworzyć wyjątkowe doświadczenia
//                   </div>
//                   <div className="p-4 bg-black/30 backdrop-blur-sm border-l-4 border-yellow-400">
//                     <span className="text-yellow-400">{">"}</span> Ciągle uczę się nowych technologii i eksperymentuję z AI/ML
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-8">
//                 <h3 className="text-4xl font-bold text-cyan-400 mb-8">SKILL_TREE.EXE</h3>
//                 {skills.map((skill, index) => (
//                   <div key={skill.name} className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-4">
//                         <skill.icon className={`text-${skill.color}-400`} size={24} />
//                         <div>
//                           <span className="text-white font-mono text-lg">{skill.name}</span>
//                           <div className={`text-${skill.color}-400 text-sm`}>{skill.specialty}</div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <span className={`text-${skill.color}-400 font-mono text-xl font-bold`}>{skill.level}%</span>
//                         <div className="flex space-x-1">
//                           {[...Array(5)].map((_, i) => (
//                             <div
//                               key={i}
//                               className={`w-2 h-2 ${i < skill.level / 20 ? `bg-${skill.color}-400` : 'bg-gray-600'} rounded-full`}
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="h-3 bg-gray-800 rounded-full overflow-hidden relative">
//                       <div
//                         className={`h-full bg-gradient-to-r from-${skill.color}-400 to-${skill.color}-600 rounded-full transition-all duration-1000 delay-${index * 200}`}
//                         style={{
//                           width: `${skill.level}%`,
//                           boxShadow: `0 0 15px rgba(var(--tw-color-${skill.color}-400), 0.5)`
//                         }}
//                       ></div>
//                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Enhanced Projects Section */}
//         {currentSection === 2 && (
//           <section className="min-h-screen flex items-center justify-center p-8 transition-all duration-1000">
//             <div className="max-w-7xl mx-auto">
//               <h2 className="text-7xl font-bold text-center mb-20 text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text">
//                 PROJECTS.VAULT
//               </h2>
             
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//                 {projects.map((project, index) => (
//                   <div
//                     key={index}
//                     onClick={() => handleProjectClick(project)}
//                     className={`group relative p-8 bg-gradient-to-br ${project.color} rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-500 cursor-pointer`}
//                     style={{
//                       clipPath: 'polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 100%, 25px 100%, 0 calc(100% - 25px))',
//                       animation: `float ${4 + index * 0.3}s ease-in-out infinite`
//                     }}
//                   >
//                     <div className="relative z-10">
//                       <div className="flex items-start justify-between mb-6">
//                         <div>
//                           <h3 className="text-3xl font-bold text-white mb-2">{project.title}</h3>
//                           <div className={`px-3 py-1 text-xs font-bold rounded-full ${
//                             project.status === 'LIVE' ? 'bg-green-400/20 text-green-400' :
//                             project.status === 'BETA' ? 'bg-yellow-400/20 text-yellow-400' :
//                             project.status === 'ALPHA' ? 'bg-orange-400/20 text-orange-400' :
//                             'bg-purple-400/20 text-purple-400'
//                           }`}>
//                             {project.status}
//                           </div>
//                         </div>
//                         <ExternalLink className="text-white opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" size={24} />
//                       </div>
                     
//                       <p className="text-white/90 mb-6 leading-relaxed text-lg">
//                         {project.description}
//                       </p>

//                       <div className="grid grid-cols-3 gap-4 mb-6">
//                         {Object.entries(project.metrics).map(([key, value]) => (
//                           <div key={key} className="text-center">
//                             <div className="text-2xl font-bold text-white">{value}</div>
//                             <div className="text-xs text-white/70 uppercase">{key}</div>
//                           </div>
//                         ))}
//                       </div>
                     
//                       <div className="flex flex-wrap gap-2 mb-6">
//                         {project.tech.map((tech, techIndex) => (
//                           <span
//                             key={techIndex}
//                             className="px-4 py-2 bg-black/40 backdrop-blur-sm text-white text-sm rounded-lg font-mono border border-white/20 hover:border-white/50 transition-colors"
//                           >
//                             {tech}
//                           </span>
//                         ))}
//                       </div>

//                       <div className="flex space-x-4">
//                         <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all">
//                           <Eye size={16} />
//                           <span>Demo</span>
//                         </button>
//                         <button className="flex items-center space-x-2 px-4 py-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-black/50 transition-all">
//                           <Github size={16} />
//                           <span>Code</span>
//                         </button>
//                       </div>
//                     </div>
                   
//                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* New Lab Section */}
//         {currentSection === 3 && (
//           <section className="min-h-screen flex items-center justify-center p-8 transition-all duration-1000">
//             <div className="max-w-6xl mx-auto">
//               <div className="text-center mb-20">
//                 <h2 className="text-7xl font-bold text-transparent bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text mb-4">
//                   EXPERIMENTAL.LAB
//                 </h2>
//                 <p className="text-xl text-gray-400 font-mono">
//                   &gt; Playground for crazy ideas and bleeding-edge experiments_
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
//                 {labProjects.map((project, index) => (
//                   <div
//                     key={index}
//                     className={`group relative p-6 bg-black/50 backdrop-blur-sm border border-${project.color}-400/50 hover:border-${project.color}-400 transition-all duration-300 cursor-pointer transform hover:scale-102`}
//                     style={{
//                       clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))',
//                       animation: `glow-${project.color} 3s ease-in-out infinite alternate`
//                     }}
//                   >
//                     <div className="flex items-start justify-between mb-4">
//                       <h3 className={`text-xl font-bold text-${project.color}-400`}>{project.name}</h3>
//                       <div className={`px-2 py-1 text-xs bg-${project.color}-400/20 text-${project.color}-400 rounded`}>
//                         {project.status}
//                       </div>
//                     </div>
//                     <p className="text-gray-300 mb-4">{project.description}</p>
//                     <div className={`text-sm font-mono text-${project.color}-300`}>
//                       Tech: {project.tech}
//                     </div>
//                     <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <ArrowRight className={`text-${project.color}-400`} size={16} />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Code Playground */}
//               <div className="bg-gray-900 border border-cyan-400/30 rounded-lg overflow-hidden">
//                 <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
//                   <div className="flex items-center space-x-2">
//                     <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                     <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                     <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                     <span className="text-gray-400 font-mono text-sm ml-4">experimental-playground.js</span>
//                   </div>
//                   <button
//                     onClick={() => setShowTerminal(!showTerminal)}
//                     className="text-cyan-400 hover:text-cyan-300 transition-colors"
//                   >
//                     <Terminal size={16} />
//                   </button>
//                 </div>
               
//                 {showTerminal && (
//                   <div className="p-4 bg-black font-mono text-sm space-y-2 max-h-64 overflow-y-auto">
//                     {terminalLines.map((line, index) => (
//                       <div key={index} className={`
//                         ${line.startsWith('>') ? 'text-green-400' :
//                           line.includes('') ? 'text-cyan-400' :
//                           line.includes('%') ? 'text-yellow-400' :
//                           'text-gray-300'}
//                       `}>
//                         {line}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Enhanced Contact Section */}
//         {currentSection === 4 && (
//           <section className="min-h-screen flex items-center justify-center p-8 transition-all duration-1000">
//             <div className="max-w-6xl mx-auto text-center space-y-16">
//               <div>
//                 <h2 className="text-7xl font-bold text-transparent bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-400 bg-clip-text mb-8">
//                   CONTACT.PROTOCOL
//                 </h2>
//                 <div className="space-y-4 font-mono text-xl">
//                   <p className="text-cyan-300 animate-pulse">
//                     {">"} Initiating connection sequence...
//                   </p>
//                   <p className="text-pink-300 animate-pulse delay-500">
//                     {">"} Ready to collaborate on your next big idea!
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {[
//                   { icon: Mail, label: "Email Protocol", value: "dev@future.codes", color: "cyan", desc: "24/7 Response System" },
//                   { icon: Github, label: "Code Repository", value: "@future-dev", color: "purple", desc: "Open Source Projects" },
//                   { icon: Linkedin, label: "Professional Network", value: "/in/future-dev", color: "pink", desc: "Industry Connections" }
//                 ].map((contact, index) => (
//                   <div
//                     key={index}
//                     className={`group relative p-8 bg-black/60 backdrop-blur-sm border-2 border-${contact.color}-400/50 hover:border-${contact.color}-400 hover:bg-${contact.color}-400/5 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2`}
//                     style={{
//                       clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
//                       boxShadow: `0 0 30px rgba(var(--tw-color-${contact.color}-400), 0.2)`
//                     }}
//                   >
//                     <contact.icon className={`text-${contact.color}-400 mx-auto mb-6 group-hover:scale-125 transition-transform duration-300`} size={40} />
//                     <h3 className="text-white font-bold text-xl mb-2">{contact.label}</h3>
//                     <p className={`text-${contact.color}-300 font-mono text-lg mb-3`}>{contact.value}</p>
//                     <p className="text-gray-400 text-sm">{contact.desc}</p>
                   
//                     <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className={`w-full h-full bg-${contact.color}-400/20 rounded-full blur-xl`}></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="space-y-8">
//                 <div className="flex justify-center space-x-6">
//                   <button className="group px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-none hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-110"
//                     style={{ clipPath: 'polygon(25px 0, 100% 0, calc(100% - 25px) 100%, 0 100%)' }}
//                   >
//                     <Rocket className="inline mr-3 group-hover:animate-bounce" size={24} />
//                     START PROJECT
//                   </button>
//                   <button className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xl rounded-none hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-110"
//                     style={{ clipPath: 'polygon(25px 0, 100% 0, calc(100% - 25px) 100%, 0 100%)' }}
//                   >
//                     <Coffee className="inline mr-3 group-hover:animate-spin" size={24} />
//                     GRAB COFFEE
//                   </button>
//                 </div>

//                 <div className="relative p-8 bg-black/40 backdrop-blur-sm border border-green-400/30 rounded-lg">
//                   <div className="absolute top-2 left-4 text-green-400 font-mono text-sm">
//                     status.json
//                   </div>
//                   <div className="mt-6 space-y-2 font-mono text-left max-w-md mx-auto">
//                     <div className="text-green-400">{"{"}</div>
//                     <div className="ml-4 text-cyan-300">"availability": <span className="text-green-400">"open_for_projects"</span>,</div>
//                     <div className="ml-4 text-cyan-300">"response_time": <span className="text-yellow-400">"&lt; 24h"</span>,</div>
//                     <div className="ml-4 text-cyan-300">"preferred_stack": <span className="text-pink-400">["React", "Node.js", "TypeScript"]</span>,</div>
//                     <div className="ml-4 text-cyan-300">"coffee_level": <span className="text-orange-400">{Math.floor(Math.random() * 100)}%</span>,</div>
//                     <div className="ml-4 text-cyan-300">"excitement": <span className="text-red-400">"maximum"</span></div>
//                     <div className="text-green-400">{"}"}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}
//       </div>

//       {/* Enhanced Floating Action Menu */}
//       <div className="fixed bottom-8 right-8 z-50 space-y-4">
//         {[
//           { Icon: Star, color: 'yellow', action: 'favorite' },
//           { Icon: Zap, color: 'cyan', action: 'quick-action' },
//           { Icon: Gamepad2, color: 'purple', action: 'easter-egg' },
//           { Icon: Music, color: 'pink', action: 'soundtrack' }
//         ].map(({ Icon, color, action }, i) => (
//           <div
//             key={i}
//             className={`group relative p-4 bg-black/80 backdrop-blur-sm border border-${color}-400/50 rounded-full hover:border-${color}-400 hover:bg-${color}-400/10 transition-all duration-300 cursor-pointer transform hover:scale-125`}
//             style={{
//               animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
//               boxShadow: `0 0 20px rgba(var(--tw-color-${color}-400), 0.3)`
//             }}
//           >
//             <Icon className={`text-${color}-400 group-hover:text-${color}-300`} size={24} />
//             <div className={`absolute right-full mr-4 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-black/90 text-${color}-400 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
//               {action.replace('-', ' ')}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Enhanced CSS Animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-15px) rotate(2deg); }
//         }
       
//         @keyframes glow-cyan {
//           0% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); }
//           100% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6); }
//         }
       
//         @keyframes glow-purple {
//           0% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
//           100% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6); }
//         }
       
//         @keyframes glow-pink {
//           0% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
//           100% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.6); }
//         }
       
//         @keyframes glow-orange {
//           0% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.3); }
//           100% { box-shadow: 0 0 40px rgba(251, 146, 60, 0.6); }
//         }
       
//         @keyframes scanline {
//           0% { transform: translateY(-100vh); }
//           100% { transform: translateY(100vh); }
//         }
       
//         .animate-bounce {
//           animation: bounce 2s infinite;
//         }
       
//         @keyframes bounce {
//           0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
//           40%, 43% { transform: translateY(-30px); }
//           70% { transform: translateY(-15px); }
//           90% { transform: translateY(-4px); }
//         }

//         .hover\\:scale-102:hover {
//           transform: scale(1.02);
//         }
//       `}</style>
//     </div>
//   );
// };


// export default RetroPortfolio;
