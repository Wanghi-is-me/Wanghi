// --- Check Mobile Device & Show Warning Banner ---
window.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
    if (isMobile) {
        document.getElementById('mobile-warning').classList.remove('hidden');
    }
});

function dismissMobileWarning() {
    document.getElementById('mobile-warning').classList.add('hidden');
}

// --- 1. Compact Cursor Spotlight Blur ---
const spotlight = document.getElementById('spotlight');
window.addEventListener('mousemove', (e) => {
    spotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
    spotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
});

// --- 2. Energy Accumulation Scroll Snap Engine ---
let currentSection = 0;
const totalSections = 4;
let isTransitioning = false;
let accumulatedEnergy = 0;
const energyThreshold = 100;
const chargeBar = document.getElementById('charge-bar');
const sectionElements = document.querySelectorAll('.section-page');
const navBtns = document.querySelectorAll('.nav-btn');

function goToSection(index) {
    if (index < 0 || index >= totalSections || index === currentSection) return;
    isTransitioning = true;
    
    sectionElements[currentSection].classList.remove('active');
    currentSection = index;
    sectionElements[currentSection].classList.add('active');

    navBtns.forEach((btn, idx) => {
        if (idx === currentSection) {
            btn.className = "nav-btn px-5 py-2 rounded-full text-sm font-semibold transition-all text-white bg-blue-600/50 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
        } else {
            btn.className = "nav-btn px-5 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all";
        }
    });

    setTimeout(() => {
        isTransitioning = false;
        accumulatedEnergy = 0;
        updateChargeUI();
    }, 800);
}

function updateChargeUI() {
    const percentage = Math.min(100, Math.max(0, (accumulatedEnergy / energyThreshold) * 100));
    chargeBar.style.width = `${percentage}%`;
    chargeBar.style.opacity = percentage > 0 ? '1' : '0';
}

window.addEventListener('wheel', (e) => {
    if (isTransitioning) return;

    accumulatedEnergy += Math.abs(e.deltaY) * 0.45;
    updateChargeUI();

    if (accumulatedEnergy >= energyThreshold) {
        if (e.deltaY > 0 && currentSection < totalSections - 1) {
            goToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            goToSection(currentSection - 1);
        } else {
            accumulatedEnergy = 0;
            updateChargeUI();
        }
    }

    clearTimeout(window.energyDecayTimer);
    window.energyDecayTimer = setTimeout(() => {
        accumulatedEnergy = 0;
        updateChargeUI();
    }, 250);
}, { passive: true });


// --- 3. Interactive Mouse-Tilt & Click-Flip 3D Card ---
const cardWrapper = document.getElementById('id-card');
let isCardFlipped = false;
let isDraggingCard = false;
let startClickPos = { x: 0, y: 0 };

if (cardWrapper) {
    cardWrapper.addEventListener('mousedown', (e) => {
        isDraggingCard = false;
        startClickPos = { x: e.clientX, y: e.clientY };
    });
}

window.addEventListener('mousemove', (e) => {
    if (Math.hypot(e.clientX - startClickPos.x, e.clientY - startClickPos.y) > 5) {
        isDraggingCard = true;
    }

    if (currentSection === 0 && cardWrapper) {
        const rect = cardWrapper.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;

        const rotateX = (-mouseY / 25).toFixed(2);
        const rotateY = (mouseX / 25).toFixed(2);
        const flipOffset = isCardFlipped ? 180 : 0;

        cardWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${Number(rotateY) + flipOffset}deg)`;
    }
});

function toggleCardFlip(e) {
    if (!isDraggingCard && cardWrapper) {
        isCardFlipped = !isCardFlipped;
        cardWrapper.classList.toggle('flipped', isCardFlipped);
    }
}


// --- 4. Meteor Shooting Stars Canvas Engine ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let meteors = [];

function createMeteor() {
    const angle = Math.PI / 4; // Góc chéo 45 độ
    return {
        x: Math.random() * (canvas.width + 300) - 150,
        y: Math.random() * -200,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 4,
        alpha: Math.random() * 0.7 + 0.3,
        width: Math.random() * 1.5 + 0.8,
        dx: Math.cos(angle),
        dy: Math.sin(angle)
    };
}

function resizeBgCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    meteors = [];
    const count = 25; // Số lượng vệt sao băng xuất hiện liên tục
    for (let i = 0; i < count; i++) {
        let m = createMeteor();
        m.y = Math.random() * canvas.height;
        m.x = Math.random() * canvas.width;
        meteors.push(m);
    }
}

if (canvas) {
    window.addEventListener('resize', resizeBgCanvas);
    resizeBgCanvas();

    function animateBgCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        meteors.forEach((m, index) => {
            m.x += m.dx * m.speed;
            m.y += m.dy * m.speed;

            // Tính tọa độ đuôi sao băng
            const tailX = m.x - m.dx * m.length;
            const tailY = m.y - m.dy * m.length;

            // Gradient tạo hiệu ứng đuôi mờ dần
            const gradient = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
            gradient.addColorStop(0.7, `rgba(147, 197, 253, ${m.alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = m.width;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Tạo điểm sáng đầu sao băng
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.width * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
            ctx.shadowColor = '#60a5fa';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Reset sao băng mới khi bay khỏi màn hình
            if (m.y > canvas.height + 100 || m.x > canvas.width + 100) {
                meteors[index] = createMeteor();
            }
        });

        requestAnimationFrame(animateBgCanvas);
    }
    animateBgCanvas();
}


// --- 5. Portfolio Sub-Tab Navigation ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn px-6 py-2.5 rounded-xl text-sm font-semibold transition-all text-slate-300 hover:text-white hover:bg-white/10";
    });

    const targetTab = document.getElementById(`tab-${tabId}`);
    const targetBtn = document.getElementById(`tab-btn-${tabId}`);
    if (targetTab) targetTab.classList.remove('hidden');
    if (targetBtn) targetBtn.className = "tab-btn px-6 py-2.5 rounded-xl text-sm font-semibold transition-all bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]";
}

// --- 6. Form Submit Toast ---
function handleFormSubmit(e) {
    e.preventDefault();
    const toast = document.getElementById('form-toast');
    if (toast) toast.classList.remove('hidden');
}

function closeToast() {
    const toast = document.getElementById('form-toast');
    if (toast) toast.classList.add('hidden');
}