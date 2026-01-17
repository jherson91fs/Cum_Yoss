// --- CONFIGURACIÓN ---
const FECHA_SECRETA = "31102025";
const TELEFONO_WHATSAPP = "51970345089";

// --- CONFIGURACIÓN DEL FORMULARIO DE GOOGLE ---

// URL Actualizada
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/u/1/d/e/1FAIpQLSeDrFNNN1HWlFegtvU21y4EJrQh4_M3HDowyUTACkUwhMMs2A/formResponse";


const GOOGLE_FORM_INPUT_NAME = "entry.561085727";
let deseoPedido = false;
let velasApagadas = 0;
const totalVelas = 3;

// Referencias al DOM
const loginScreen = document.getElementById('login-screen');
const mainContent = document.getElementById('main-content');
const errorMsg = document.getElementById('error-msg');
const bgMusic = document.getElementById('bg-music');
const mananitasMusic = document.getElementById('mananitas-music');
const couponsSection = document.getElementById('coupons-section');
const wishInput = document.getElementById('wish-input');
const wishContainer = document.getElementById('wish-container');
const blowInstruction = document.getElementById('blow-instruction');
const musicControls = document.getElementById('music-controls-container');
const volumeSlider = document.getElementById('volume-slider');
const musicBtn = document.getElementById('music-btn');
const specialMsg = document.getElementById('special-msg');

// --- 1. FUNCIÓN DE INICIO (LOGIN) ---
function checkDate() {
    const input = document.getElementById('date-input').value;
    if (input === FECHA_SECRETA) {
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            bgMusic.volume = 0.5;
            bgMusic.play().catch(e => console.log("Error audio:", e));
            // Mostrar controles de música
            musicControls.classList.remove('hidden');
        }, 1000);
    } else {
        errorMsg.classList.remove('hidden');
        document.querySelector('.login-box').classList.add('shake');
        setTimeout(() => {
            document.querySelector('.login-box').classList.remove('shake');
        }, 500);
    }
}

// ... (Variables anteriores se mantienen) ...

// --- 2. LÓGICA DEL DESEO (ACTUALIZADA) ---

// Función unificada para enviar (sirve para Enter y para Click)
function submitWish() {
    const input = document.getElementById('wish-input');
    const deseo = input.value.trim();

    if (deseo !== "") {
        deseoPedido = true;

        // 1. Enviar el deseo a Google Forms
        enviarDeseoAGoogleForms(deseo);

        // 2. Animación visual (Ocultar input y botón)
        wishContainer.style.transition = "all 1s ease";
        wishContainer.style.transform = "translateY(-50px)";
        wishContainer.style.opacity = "0";

        setTimeout(() => {
            wishContainer.style.display = 'none';
            blowInstruction.classList.remove('hidden');
            blowInstruction.style.opacity = '1';
        }, 1000);
    } else {
        // Si intenta enviar vacío
        Swal.fire('¡Psst!', 'Escribe un deseo primero 😉', 'info');
    }
}

// Evento para tecla Enter (Mantenemos la comodidad para PC)
wishInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        submitWish();
    }
});

function enviarDeseoAGoogleForms(deseo) {
    // Creamos un formulario invisible temporalmente
    const form = document.createElement('form');
    form.action = GOOGLE_FORM_ACTION_URL;
    form.method = 'POST';
    form.target = 'hidden_iframe'; // Enviar al iframe oculto
    form.style.display = 'none';

    // Creamos el campo del deseo
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = GOOGLE_FORM_INPUT_NAME;
    input.value = deseo;

    // Añadimos todo al documento y enviamos
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();

    // Limpiamos
    document.body.removeChild(form);
    console.log("Deseo enviado a Google Forms!");
}

// --- 3. INTERACCIÓN DEL PASTEL (NUEVO) ---
function blowCandle(elementoTrigger) {
    if (!deseoPedido) {
        Swal.fire('¡Espera!', 'Primero pide un deseo y presiona Enviar 😉', 'warning');
        return;
    }

    if (elementoTrigger.classList.contains('out')) return;

    // "Apagar" la vela
    elementoTrigger.classList.add('out');
    velasApagadas++;

    // Opcional: Reproducir sonido de soplido
    // const soplidoAudio = new Audio('assets/soplido.mp3');
    // soplidoAudio.play();

    // Verificar si todas están apagadas
    if (velasApagadas === totalVelas) {
        startCelebration();
    }
}

function startCelebration() {
    bgMusic.pause();
    mananitasMusic.currentTime = 0;
    mananitasMusic.play();
    lanzarConfeti();
    lanzarConfeti();
    blowInstruction.style.opacity = '0'; // Ocultar instrucción

    // Mostrar mensaje especial
    specialMsg.classList.remove('hidden');
    setTimeout(() => { specialMsg.classList.add('show-msg'); }, 500);

    // Mostrar cupones con un poco más de retraso
    setTimeout(() => {
        couponsSection.classList.remove('hidden-fade');
        setTimeout(() => { couponsSection.style.opacity = '1'; }, 100);
    }, 3000); // 3 segundos para leer el mensaje
}

// --- 4. CONFETI Y CUPONES (Se mantiene igual) ---
function lanzarConfeti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

document.addEventListener('DOMContentLoaded', () => {
    verificarCuponesUsados();
});

function redeemCoupon(id, titulo) {
    if (localStorage.getItem(`cupon_${id}`) === 'true') {
        Swal.fire('¡Ups!', 'Este cupón ya fue canjeado 😅', 'info');
        return;
    }
    Swal.fire({
        title: `¿Canjear "${titulo}"?`,
        text: "Al confirmar, te enviará a mi WhatsApp para validarlo y el cupón desaparecerá.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, ¡lo quiero!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            marcarComoCanjeado(id);
            localStorage.setItem(`cupon_${id}`, 'true');
            const mensaje = `¡Hola! Acabo de canjear mi cupón de cumpleaños: *${titulo}* 🎟️. ¿Cuándo lo hacemos válido?`;
            const url = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        }
    });
}

function marcarComoCanjeado(id) {
    const cupon = document.getElementById(`coupon-${id}`);
    if (cupon) {
        cupon.classList.add('redeemed');
        cupon.querySelector('small').innerText = "Canjeado ✅";
    }
}

function verificarCuponesUsados() {
    [2, 3, 4, 5].forEach(id => {
        if (localStorage.getItem(`cupon_${id}`) === 'true') {
            marcarComoCanjeado(id);
        }
    });
}

// --- CONTROLES DE MÚSICA LOGIC ---
function toggleAudio() {
    let activeAudio = (mananitasMusic.paused && mananitasMusic.currentTime === 0 && velasApagadas < totalVelas) ? bgMusic : mananitasMusic;

    // Si ya empezó la celebración, el activo es mañanitas, a menos que esté pausado y bgMusic también
    if (velasApagadas === totalVelas) {
        activeAudio = mananitasMusic;
    }

    if (activeAudio.paused) {
        activeAudio.play();
        musicBtn.innerText = "⏸️"; // Icono de Pausa
        // musicBtn.innerText = "🎵"; // Opcional
    } else {
        activeAudio.pause();
        musicBtn.innerText = "▶️"; // Icono de Play
    }
}

// Control de Volumen
volumeSlider.addEventListener('input', function () {
    const volume = this.value;
    bgMusic.volume = volume;
    mananitasMusic.volume = volume;
});

// Actualizar icono cuando cambia el estado 'manualmente' (ej: startCelebration)
bgMusic.addEventListener('play', () => musicBtn.innerText = "⏸️");
bgMusic.addEventListener('pause', () => {
    if (mananitasMusic.paused) musicBtn.innerText = "▶️";
});
mananitasMusic.addEventListener('play', () => musicBtn.innerText = "⏸️");
mananitasMusic.addEventListener('pause', () => musicBtn.innerText = "▶️");