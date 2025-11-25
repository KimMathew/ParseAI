export default function MeshGradient() {
  return (
    <>
      {/* Mesh Gradient Background - Theme Colors Swirling Pattern */}
      <div className="absolute inset-6 rounded-3xl overflow-hidden bg-[#0B0C10]">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-linear-to-br from-[#6366F1]/70 via-[#8B5CF6]/60 to-[#22D3EE]/50"></div>
        
        {/* Mesh gradient overlay with theme colors creating organic swirls */}
        <div className="absolute inset-0">
          {/* Cyan blob - top left */}
          <div className="absolute -top-12 -left-12 w-[500px] h-[500px] bg-[#22D3EE] rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-mesh-1"></div>
          
          {/* Indigo blob - top right */}
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#6366F1] rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-mesh-2"></div>
          
          {/* Purple blob - center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[110px] opacity-65 animate-mesh-3"></div>
          
          {/* Cyan blob 2 - bottom left */}
          <div className="absolute -bottom-16 -left-16 w-[520px] h-[520px] bg-[#22D3EE] rounded-full mix-blend-screen filter blur-[130px] opacity-55 animate-mesh-4"></div>
          
          {/* Indigo blob 2 - bottom right */}
          <div className="absolute -bottom-24 -right-12 w-[480px] h-[480px] bg-[#6366F1] rounded-full mix-blend-screen filter blur-[115px] opacity-60 animate-mesh-5"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes mesh-1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% { 
            transform: translate(80px, -60px) scale(1.2) rotate(120deg);
          }
          66% { 
            transform: translate(-40px, 40px) scale(0.9) rotate(240deg);
          }
        }
        
        @keyframes mesh-2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% { 
            transform: translate(-70px, 90px) scale(1.1) rotate(-90deg);
          }
          66% { 
            transform: translate(50px, -30px) scale(1.3) rotate(-180deg);
          }
        }
        
        @keyframes mesh-3 {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          33% { 
            transform: translate(calc(-50% + 60px), calc(-50% + 80px)) scale(1.15) rotate(90deg);
          }
          66% { 
            transform: translate(calc(-50% - 70px), calc(-50% - 50px)) scale(0.95) rotate(180deg);
          }
        }
        
        @keyframes mesh-4 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% { 
            transform: translate(90px, 50px) scale(0.85) rotate(150deg);
          }
          66% { 
            transform: translate(-60px, -80px) scale(1.25) rotate(300deg);
          }
        }
        
        @keyframes mesh-5 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% { 
            transform: translate(-50px, -70px) scale(1.2) rotate(-120deg);
          }
          66% { 
            transform: translate(70px, 60px) scale(0.9) rotate(-240deg);
          }
        }
        
        .animate-mesh-1 {
          animation: mesh-1 20s ease-in-out infinite;
        }
        .animate-mesh-2 {
          animation: mesh-2 18s ease-in-out infinite;
          animation-delay: -3s;
        }
        .animate-mesh-3 {
          animation: mesh-3 22s ease-in-out infinite;
          animation-delay: -7s;
        }
        .animate-mesh-4 {
          animation: mesh-4 19s ease-in-out infinite;
          animation-delay: -11s;
        }
        .animate-mesh-5 {
          animation: mesh-5 21s ease-in-out infinite;
          animation-delay: -15s;
        }
      `}</style>
    </>
  );
}
