import React, { useEffect, useRef } from 'react';

const BlackHoleParticles = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const centerXRef = useRef(0);
  const centerYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      centerXRef.current = canvas.width / 2;
      centerYRef.current = canvas.height / 2;
    };

    const createParticles = () => {
      particlesRef.current = [];
      const numParticles = 100;

      for (let i = 0; i < numParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        // Calculate distance from center
        const dx = centerXRef.current - particle.x;
        const dy = centerYRef.current - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Update particle position with gravitational effect
        const gravitationalPull = 0.3 / (distance * 0.1);
        particle.x += (dx * gravitationalPull + particle.speedX);
        particle.y += (dy * gravitationalPull + particle.speedY);

        // Reset particle if too close to center
        if (distance < 5) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    // Initialize
    resizeCanvas();
    createParticles();
    drawParticles();

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      createParticles();
    });
    
    resizeObserver.observe(canvas.parentElement);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.5,
        background: 'transparent'
      }}
    />
  );
};

export default BlackHoleParticles; 