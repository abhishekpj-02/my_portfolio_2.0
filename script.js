/* ================= PARTICLE BACKGROUND ================= */
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

// Set canvas size
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Particle Configuration
let particles = [];
const particleCount = 60; // Slightly reduced for cleaner look
const connectionDistance = 120;
const mouseRange = 150;

// Mouse Interaction
let mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4; // Slower, calmer
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
  }

  update() {
    // Movement
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off edges
    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

    // Mouse Interaction
    if (mouse.x != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRange) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouseRange - distance) / mouseRange;
        const directionX = forceDirectionX * force * 2; // Repulsion strength
        const directionY = forceDirectionY * force * 2;

        this.x -= directionX;
        this.y -= directionY;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    // Draw Connections
    for (let j = i; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - distance / connectionDistance * 0.15})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* ================= SCROLL REVEAL ANIMATION ================= */
// Add .reveal class to sections you want to animate
const revealElements = document.querySelectorAll(".section, .hero, .project-card, .skill-category");

// Add reveal class to these elements initially if not already in HTML
revealElements.forEach(el => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.1 });

revealElements.forEach((el) => revealObserver.observe(el));


/* ================= MOBILE MENU ================= */
const menuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Close menu when link is clicked
links.forEach(link => {
  link.addEventListener("click", () => {
    menuBtn.classList.remove("active");
    navLinks.classList.remove("active");
  });
});
