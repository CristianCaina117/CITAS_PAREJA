// Experience.js - VERSIÓN MEJORADA CON MOVIMIENTO Y CANCIONES

// Rastrear stickers activos
let activeStickers = [];
let stickerPositions = [];

function clearAllStickers() {

    // 🔥 matar animaciones GSAP que sigan vivas
    if (typeof gsap !== 'undefined') {
        gsap.killTweensOf('.sad-sticker-with-text');
    }

    // 🔥 eliminar TODO del DOM (aunque el array falle)
    document.querySelectorAll('.sad-sticker-with-text').forEach(el => {
        el.remove();
    });

    // limpiar memoria
    activeStickers = [];
    stickerPositions = [];
}
// ===== LEER PARÁMETROS DE LA URL (SIEMPRE) =====
const urlParams = new URLSearchParams(window.location.search);
const toName = urlParams.get('to') || 'Persona especial';
const fromName = urlParams.get('from') || 'Alguien especial';
const finalMessage = urlParams.get('msg') || 'Nos vemos pronto 💫';
const date1 = urlParams.get('date1') || '';
const date2 = urlParams.get('date2') || '';
const date3 = urlParams.get('date3') || '';
const phoneNumber = urlParams.get('phone') || '';

function formatearFechaBonita(textoFecha) {
    const diasSemana = [
        "domingo", "lunes", "martes", "miércoles",
        "jueves", "viernes", "sábado"
    ];

    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    // Formato esperado del input date: YYYY-MM-DD
    if (textoFecha && textoFecha.includes("-")) {
        const fecha = new Date(textoFecha + "T00:00:00");

        const diaSemana = diasSemana[fecha.getDay()];
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];

        return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${dia} de ${mes}`;
    }

    return textoFecha;
}
// Log para verificar que se leen correctamente
console.log('📋 Datos de la URL:');
console.log('Para:', toName);
console.log('De:', fromName);
console.log('Mensaje:', finalMessage);

// Referencias del DOM
let experienceContainer;

// Audio - DOS CANCIONES DIFERENTES
let audioSad = null;
let audioHappy = null;
let currentAudio = null;
let musicLoaded = false;

function initAudio() {
    if (!audioSad) {
        audioSad = new Audio('Assets/Audio/sombr-back.mp3'); // Canción triste
        audioSad.loop = true;
        audioSad.volume = 0.3;
    }
    if (!audioHappy) {
        audioHappy = new Audio('Assets/Audio/Carin León - Primera Cita.mp3'); // Canción alegre
        audioHappy.loop = true;
        audioHappy.volume = 0.7;
    }
    musicLoaded = true;
}

function playAudio(type) {
    // Detener cualquier audio que esté sonando
    stopAllAudio();
    
    initAudio();
    
    if (type === 'sad') {
        currentAudio = audioSad;
        audioSad.play().catch(err => console.log('Audio bloqueado:', err));
    } else if (type === 'happy') {
        currentAudio = audioHappy;
        audioHappy.play().catch(err => console.log('Audio bloqueado:', err));
    }
}

function stopAllAudio() {
    if (audioSad) {
        audioSad.pause();
        audioSad.currentTime = 0;
    }
    if (audioHappy) {
        audioHappy.pause();
        audioHappy.currentTime = 0;
    }
    currentAudio = null;
}

// Estado
let hasAnswered = false;
let noClickCount = 0;
let btnYesScale = 1; // ← el botón SÍ crece con cada click en No

// ===== DETECCIÓN DE DISPOSITIVO (global para reutilizar) =====
const isTouchDevice = navigator.maxTouchPoints > 1 || 
                      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
                      // Al inicio de handleNoClick, después de los guards:
console.log('🖱️ isTouchDevice:', isTouchDevice);

// NUEVOS MENSAJES PERSONALIZADOS
const noMessages = [
    '❌ No',
    '😢 ¿En serio estás segura?',
    '🏓 ¿Es porque perdí el ping pong?',
    '💃 ¿Es porque bailo mal?',
    '😔 ¿Me besaste?',
    '💔 Listo… para romperme el corazón'
];

// Función principal de inicialización
export function initExperience() {
    experienceContainer = document.querySelector('.experience-container');
    showInitialMessage();
}

// Mensaje inicial antes de la pregunta
function showInitialMessage() {
    experienceContainer.innerHTML = `
        <div class="initial-message">
            <div class="letter-header">
                <p class="letter-to">Para: <span class="name-highlight">${toName}</span> 💕</p>
                <p class="letter-from">De: <span class="name-highlight">${fromName}</span> ✨</p>
            </div>
            <div class="letter-divider"></div>
            <h2 class="welcome-title">Hola ${toName}...</h2>
            <p class="welcome-message">Tengo algo especial que preguntarte</p>
        </div>
    `;

    if (typeof gsap !== 'undefined') {
        gsap.from('.initial-message', {
            duration: 1.5,
            opacity: 0,
            y: 50,
            ease: 'power3.out'
        });

        gsap.from('.letter-header', {
            duration: 1,
            opacity: 0,
            y: -20,
            delay: 0.5,
            ease: 'power2.out'
        });

        gsap.from('.welcome-title', {
            duration: 1,
            opacity: 0,
            scale: 0.8,
            delay: 1,
            ease: 'back.out(1.7)'
        });
    }

    setTimeout(() => {
        showQuestion();
    }, 3000);
}

function showQuestion() {
    experienceContainer.innerHTML = `
        <div class="cinematic-scene">
            <div class="light-rays"></div>
            
            <div class="names-header">
                <span class="header-to">Para: ${toName}</span>
                <span class="header-separator">•</span>
                <span class="header-from">De: ${fromName}</span>
            </div>

            <h1 class="romantic-title">
                ${toName} ✨
            </h1>
            <p class="romantic-subtitle">
                ${fromName} tiene una pregunta especial para ti...
            </p>
            <div class="question-box">
                <h2 class="main-question">¿Quieres tener una cita conmigo?</h2>
                <div class="button-container" id="btnContainer" style="min-height:160px; position:relative;">
                    <button id="btnYes" class="btn-yes">✔️ Sí</button>
                    <button id="btnNo" class="btn-no">❌ No</button>
                </div>
                <p class="hint-text">💡 Intenta presionar "No" si te atreves...</p>
            </div>
        </div>
    `;

    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');

    btnYes.addEventListener('click', handleYes);
    btnNo.addEventListener('click', handleNoClick);

    // Animaciones GSAP
    if (typeof gsap !== 'undefined') {
        gsap.from('.cinematic-scene', {
            duration: 1,
            opacity: 0,
            ease: 'power2.out'
        });

        gsap.from('.names-header', {
            duration: 1,
            opacity: 0,
            y: -30,
            delay: 0.3,
            ease: 'power2.out'
        });

        gsap.from('.romantic-title', {
            duration: 1.5,
            opacity: 0,
            y: -30,
            delay: 0.5,
            ease: 'power2.out'
        });

        gsap.from('.main-question', {
            duration: 1.5,
            opacity: 0,
            scale: 0.8,
            delay: 0.8,
            ease: 'back.out(1.7)'
        });

        gsap.from('.button-container', {
            duration: 1,
            opacity: 0,
            y: 20,
            delay: 1.2,
            ease: 'power2.out'
        });

        gsap.from('.hint-text', {
            duration: 1,
            opacity: 0,
            delay: 1.5,
            ease: 'power2.out'
        });
    }
}

// ===== CLICK EN BOTÓN "NO" =====
function handleNoClick(e) {
    e.preventDefault();
    
    if (hasAnswered) return;
    
    const btnNo  = document.getElementById('btnNo');
    const btnYes = document.getElementById('btnYes');
    if (!btnNo || !btnYes) return;

    // Si ya llegó al último mensaje → escena triste
    if (noClickCount >= noMessages.length - 1) {
        console.log('✅ Última frase, ejecutando respuesta "No"');
        handleNo(e);
        return;
    }

    // Sticker emoji cerca del botón (sin cambios)
    const btnRect = btnNo.getBoundingClientRect();
    createFunnySadSticker(
        btnRect.left + btnRect.width  / 2,
        btnRect.top  + btnRect.height / 2
    );

    // GIF meme triste en posición aleatoria de pantalla (~1 minuto visible)
    createSadMemeGif();

    // Incrementar contador
    noClickCount++;

    // Actualizar texto del botón No con el nuevo mensaje
    // El texto debe caber siempre dentro del botón
    const newText = noMessages[noClickCount];
    btnNo.textContent = newText;

    console.log(`📝 Mensaje ${noClickCount}/${noMessages.length - 1}: "${newText}"`);

    // ===== BOTÓN SÍ CRECE con cada click en No =====
    btnYesScale += 0.5;
    if (typeof gsap !== 'undefined') {
        gsap.to(btnYes, {
            scale: btnYesScale,
            duration: 0.4,
            ease: 'back.out(2)'
        });
    } else {
        btnYes.style.transform = `scale(${btnYesScale})`;
    }

    // ===== MOVER BOTÓN NO: solo en desktop, ping pong corto =====
    pingPongBtnNo(btnNo, btnYes);
    // En móvil/tablet: el botón No NO se mueve, solo cambia el texto
}


// ===== PING PONG: botón No rebota por todo el experience-container =====
function pingPongBtnNo(btnNo, btnYes) {
    const playField = document.querySelector('.experience-container');
    if (!playField) return;

    const fieldRect = playField.getBoundingClientRect();
    const noW = btnNo.offsetWidth  || 140;
    const noH = btnNo.offsetHeight || 50;
    const margin = 15;

    // Primera vez: sacar el botón del flujo y fijarlo con fixed
    if (btnNo.dataset.floatingActive !== 'true') {
        btnNo.dataset.floatingActive = 'true';

        const r = btnNo.getBoundingClientRect();

        document.body.appendChild(btnNo);

        // SIN transition al inicio para que aparezca en su lugar actual
        btnNo.style.cssText = `
            position: fixed !important;
            left: ${r.left}px !important;
            top: ${r.top}px !important;
            margin: 0 !important;
            z-index: 99999 !important;
            width: ${noW}px !important;
            min-width: unset !important;
            max-width: unset !important;
            white-space: normal !important;
            word-break: break-word !important;
            text-align: center !important;
            line-height: 1.3 !important;
            transition: none !important;
            padding: 14px 25px !important;
            font-size: 1.1em !important;
            border: none !important;
            border-radius: 50px !important;
            cursor: pointer !important;
            font-weight: 700 !important;
            background: linear-gradient(135deg, #ef4444 0%, #f87171 100%) !important;
            color: white !important;
            box-shadow: 0 8px 25px rgba(239,68,68,0.7) !important;
        `;

        // Activar transition DESPUÉS de un frame
        requestAnimationFrame(() => {
            btnNo.style.transition = 'left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        // Centrar botón Sí
        btnYes.style.display = 'block';
        btnYes.style.margin  = '0 auto';
    }

    // Destino aleatorio dentro del experience-container
    const targetX = fieldRect.left   + margin + Math.random() * (fieldRect.width  - noW - margin * 2);
    const targetY = fieldRect.top    + margin + Math.random() * (fieldRect.height - noH - margin * 2);

    console.log(`🏓 → left:${Math.round(targetX)}px top:${Math.round(targetY)}px`);

    // Mover directamente con style — igual que los GIFs
    btnNo.style.left = targetX + 'px';
    btnNo.style.top  = targetY + 'px';
}

// ===== STICKER EMOJI CERCA DEL BOTÓN (sin cambios del original) =====
function createFunnySadSticker(centerX, centerY) {
    const funnyStickers = [
        { emoji: '😭', text: '¡Auch!' },
        { emoji: '💔', text: 'Me duele...' },
        { emoji: '🥺', text: 'Por fa...' },
        { emoji: '😢', text: 'Sniff' },
        { emoji: '🤡', text: 'Soy un payaso' },
        { emoji: '😔', text: 'Sad' },
        { emoji: '💀', text: 'Me morí' },
        { emoji: '🌧️', text: 'Lluvia' },
        { emoji: '🎻', text: 'Violín triste' }
    ];

    const sticker = funnyStickers[Math.floor(Math.random() * funnyStickers.length)];

    const stickerElement = document.createElement('div');
    stickerElement.dataset.dynamic = '1';
    stickerElement.className = 'sad-sticker-with-text';
    stickerElement.innerHTML = `
        <div class="sticker-emoji">${sticker.emoji}</div>
        <div class="sticker-text">${sticker.text}</div>
    `;

    let startX, startY;
    let attempts = 0;
    const MIN_DISTANCE = 90; // 🔥 distancia real mínima entre stickers

    do {
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 80;

        startX = centerX + Math.cos(angle) * distance;
        startY = centerY + Math.sin(angle) * distance;

        attempts++;

    } while (
        stickerPositions.some(p =>
            Math.hypot(p.x - startX, p.y - startY) < MIN_DISTANCE
        ) && attempts < 25
    );

    // Si no encontró espacio libre → no crear
    if (attempts >= 25) {
        console.log('⚠️ No se encontró espacio libre para sticker');
        return;
    }

    // Guardar posición
    stickerPositions.push({ x: startX, y: startY });

    // Limitar memoria
    if (stickerPositions.length > 30) {
        stickerPositions.shift();
    }

    stickerElement.style.position = 'fixed';
    stickerElement.style.left = startX + 'px';
    stickerElement.style.top = startY + 'px';
    stickerElement.style.pointerEvents = 'none';
    stickerElement.style.zIndex = '10000';
    stickerElement.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(stickerElement);
    activeStickers.push(stickerElement);

    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
            onComplete: () => {
                stickerElement.remove();
                activeStickers = activeStickers.filter(s => s !== stickerElement);
                stickerPositions = stickerPositions.filter(
                    p => !(p.x === startX && p.y === startY)
                );
            }
        });

        tl.from(stickerElement, {
            duration: 0.3,
            scale: 0,
            rotation: -180,
            opacity: 0,
            ease: 'back.out(2)'
        });

        tl.to(stickerElement, {
            duration: 2,
            y: -100,
            opacity: 0,
            ease: 'power2.out'
        });
    } else {
        setTimeout(() => {
            stickerElement.remove();
            activeStickers = activeStickers.filter(s => s !== stickerElement);
            stickerPositions = stickerPositions.filter(
                p => !(p.x === startX && p.y === startY)
            );
        }, 2000);
    }
}

// ===== GIF MEME TRISTE — aparece en pantalla ~1 minuto =====
// Los GIFs se sirven desde Tenor (no requieren API key para embed directo)
const sadMemeGifs = [
  "https://media.giphy.com/media/eZXCNJsSuv2BZX68RW/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l378giAZgxPw3eO52/giphy.gif",
  "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif",
  "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif",
  "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif",
  "https://media.giphy.com/media/1BXa2alBjrCXC/giphy.gif"
];

// Rastrear GIFs y zonas usadas
let lastGifIndex  = -1;
let currentGifZone = 0; // rota en orden: 0=arriba-izq, 1=arriba-der, 2=abajo-izq, 3=abajo-der

function createSadMemeGif() {

    // ===== Elegir GIF distinto al anterior =====
    let gifIndex;
    do {
        gifIndex = Math.floor(Math.random() * sadMemeGifs.length);
    } while (gifIndex === lastGifIndex && sadMemeGifs.length > 1);

    lastGifIndex = gifIndex;
    const gifUrl = sadMemeGifs[gifIndex];

    const w = window.innerWidth;
    const h = window.innerHeight;

    // ===== Tamaño responsive real =====
    let gifSize;

    if (w < 480) {
        gifSize = Math.min(120, w * 0.35);
    } else if (w < 768) {
        gifSize = Math.min(150, w * 0.30);
    } else {
        gifSize = Math.min(180, w * 0.25);
    }

    // ===== Margen dinámico (importante en mobile) =====
    const margin = Math.max(10, w * 0.02);

    // Safe bottom para navbar del celular
    const bottomSafe = w < 768 ? 80 : 20;

    // ===== Zonas rotativas seguras =====
    const zones = [
        { x: margin, y: margin },
        { x: w - gifSize - margin, y: margin },
        { x: margin, y: h - gifSize - bottomSafe },
        { x: w - gifSize - margin, y: h - gifSize - bottomSafe }
    ];

    const zone = zones[currentGifZone % zones.length];
    currentGifZone++;

    const posX = Math.max(0, zone.x);
    const posY = Math.max(0, zone.y);

    // ===== Crear contenedor =====
    const gifEl = document.createElement('div');
    gifEl.dataset.dynamic = '1';

    gifEl.style.cssText = `
        position: fixed;
        left:${posX}px;
        top:${posY}px;
        width:${gifSize}px;
        pointer-events:none;
        z-index:99999;
        border-radius:16px;
        overflow:hidden;
        box-shadow:0 10px 35px rgba(0,0,0,.55);
        border:2px solid rgba(255,255,255,.25);
        background:#000;
        opacity:0;
        transform:scale(.9);
        backdrop-filter: blur(6px);
    `;

    // ===== Labels más meme =====
    const labels = [
        'yo después del visto 💔',
        'mi estabilidad emocional 😭',
        'yo fingiendo estar bien 🥲',
        'cuando dice "eres como un hermano"',
        'procedo a llorar...'
    ];

    const label = labels[Math.floor(Math.random() * labels.length)];

    gifEl.innerHTML = `
        <div style="
            background:rgba(0,0,0,.75);
            color:#fff;
            font-size:12px;
            font-weight:700;
            font-family:sans-serif;
            padding:4px 8px;
            text-align:center;
            border-bottom:1px solid rgba(255,255,255,.12);
        ">${label}</div>

        <img src="${gifUrl}"
             style="width:100%;display:block;object-fit:cover"
             onerror="this.parentElement.remove()">
    `;

    document.body.appendChild(gifEl);

    // ===== Animación =====
    if (typeof gsap !== 'undefined') {

        gsap.to(gifEl, {
            opacity: 1,
            scale: 1,
            duration: .45,
            ease: 'back.out(1.6)'
        });

        gsap.to(gifEl, {
            opacity: 0,
            scale: .9,
            duration: 4,
            delay: 50,
            ease: 'power2.in',
            onComplete: () => gifEl.remove()
        });

    } else {
        gifEl.style.transition = 'all .4s ease';
        requestAnimationFrame(() => {
            gifEl.style.opacity = '1';
            gifEl.style.transform = 'scale(1)';
        });

        setTimeout(() => {
            gifEl.style.opacity = '0';
            gifEl.style.transform = 'scale(.9)';
            setTimeout(() => gifEl.remove(), 4000);
        }, 50000);
    }

    console.log(`🎭 GIF en (${Math.round(posX)}, ${Math.round(posY)})`);
}

function handleNo(e) {
    if (hasAnswered) return;
    hasAnswered = true;

    if (e) e.preventDefault();

    // ===== AGREGAR ESTO =====
    const oldBtnNo = document.getElementById('btnNo');
    if (oldBtnNo) oldBtnNo.remove();
    // ========================

    document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    document.body.style.transition = 'background 2s ease';
    
    experienceContainer.innerHTML = `
        <div class="melancholic-scene">
            <div class="rain-overlay"></div>
            
            <div class="sad-header">
                <p class="sad-from">${fromName} está triste... 💔</p>
            </div>
            
            <div class="dancing-silhouette">
                <div class="silhouette-placeholder">
                    <div class="dancer-animation">💃</div>
                    <p class="dance-text">Bailando bajo la lluvia...</p>
                </div>
            </div>
            <div class="sad-emojis">
                <span class="emoji-float">💃</span>
                <span class="emoji-float">😔</span>
                <span class="emoji-float">🩰</span>
                <span class="emoji-float">💔</span>
            </div>
            <h2 class="sad-message">Entiendo ${toName}... 🌧️</h2>
            <p class="sad-subtitle">Tal vez en otro momento...</p>
            <button id="btnReconsider" class="btn-reconsider">¿Reconsiderar? 🥺</button>
        </div>
    `;

    // REPRODUCIR CANCIÓN TRISTE
    playAudio('sad');

    if (typeof gsap !== 'undefined') {
        gsap.from('.melancholic-scene', {
            duration: 2,
            opacity: 0,
            ease: 'power2.inOut'
        });

        gsap.from('.dancing-silhouette', {
            duration: 1.5,
            scale: 0,
            delay: 0.5,
            ease: 'back.out(1.7)'
        });

        gsap.from('.sad-message', {
            duration: 1.5,
            opacity: 0,
            y: 50,
            delay: 1,
            ease: 'power2.out'
        });

        gsap.to('.dancer-animation', {
            duration: 3,
            rotation: 360,
            repeat: -1,
            ease: 'linear'
        });
    }

    animateRain();
    animateEmojis();

    document.getElementById('btnReconsider').addEventListener('click', () => {
        // DETENER MÚSICA AL RECONSIDERAR
        stopAllAudio();

        // ✅ limpiar stickers
        clearAllDynamic();
        
        hasAnswered  = false;
        noClickCount = 0;
        btnYesScale  = 1;
        currentGifZone = 0; // reset zonas de GIFs
        document.body.style.background = '';
        showQuestion();
    });

    clearAllStickers();
    function clearAllDynamic() {

        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf('[data-dynamic]');
        }

        document.querySelectorAll('[data-dynamic]').forEach(el => el.remove());

        activeStickers = [];
        stickerPositions = [];
    }
}

function handleYes() {
    if (hasAnswered) return;
    hasAnswered = true;

    const oldBtnNo = document.getElementById('btnNo');
    if (oldBtnNo) oldBtnNo.remove();

    document.body.style.background =
        'radial-gradient(circle, #ffeaa7 0%, #fdcb6e 50%, #e17055 100%)';
    document.body.style.transition = 'background 2s ease';

    experienceContainer.innerHTML = `
        <div class="celebration-scene">
            <div class="golden-particles"></div>
            <div class="heart-rain"></div>
            <div class="fireworks-container"></div>

            <div class="celebration-header">
                <p class="celebration-names">${toName} ❤️ ${fromName}</p>
            </div>

            <h1 class="celebration-title">¡Sííí! 🎉✨</h1>

            <div class="date-reveal">

                ${
                    date1 || date2 || date3
                        ? `
                <div class="date-selection">
                    <p class="date-text">Elige el día perfecto 💫</p>

                    <div class="date-options">
                        ${date1 ? `<button class="date-pill">${date1}</button>` : ''}
                        ${date2 ? `<button class="date-pill">${date2}</button>` : ''}
                        ${date3 ? `<button class="date-pill">${date3}</button>` : ''}
                    </div>

                    <p class="chosen-date-message"></p>
                </div>
                `
                        : ''
                }

                <p class="final-message">${finalMessage}</p>

                <div class="final-signatures">
                    <p class="signature-love">Con mucho cariño,</p>
                    <p class="signature-name">${fromName} 💕</p>
                    <p class="signature-for">Para mi ${toName} especial ✨</p>
                </div>
            </div>
        </div>
    `;

    // 🎵 Música alegre
    playAudio('happy');

    // Animaciones principales
    if (typeof gsap !== 'undefined') {
        gsap.from('.celebration-title', {
            duration: 1,
            scale: 0,
            rotation: 360,
            ease: 'back.out(2)'
        });

        gsap.from('.date-reveal', {
            duration: 1.5,
            opacity: 0,
            y: 100,
            delay: 0.5,
            ease: 'power3.out'
        });

        gsap.to('.celebration-title', {
            duration: 0.5,
            scale: 1.1,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }

    // 🎯 LÓGICA DE SELECCIÓN DE FECHA
    const dateButtons = document.querySelectorAll('.date-pill');
    const chosenMessage = document.querySelector('.chosen-date-message');

    if (dateButtons.length > 0) {
        dateButtons.forEach(btn => {
            btn.addEventListener('click', () => {

                // Desactivar todos
                dateButtons.forEach(b => b.classList.remove('selected'));

                // Activar seleccionado
                btn.classList.add('selected');

                const fechaElegida = formatearFechaBonita(btn.textContent);

                // Mensaje dinámico
                chosenMessage.innerHTML = `
                    Perfecto 💕 entonces nos vemos el 
                    <strong>${fechaElegida}</strong>
                `;

                // Animación bonita
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(chosenMessage,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.8 }
                    );

                    gsap.to(btn, {
                        scale: 1.15,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1
                    });
                }

                // 🔒 Bloquear después de elegir
                dateButtons.forEach(b => b.disabled = true);

                // 📲 ENVIAR A WHATSAPP (si viene número en el link)
                if (phoneNumber) {

                    const mensaje = `Hola ${fromName} 💕 acepté la cita para el ${fechaElegida} 😍`;
                    const urlWhatsApp = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`;

                    setTimeout(() => {
                        window.open(urlWhatsApp, "_blank");
                    }, 1500);

                } else {
                    console.warn("No se recibió número en la URL");
                }

            });
        });
    }

    createGoldenParticles();
    createHeartRain();
    createFireworks();
}

// [Resto de funciones: animateRain, animateEmojis, createGoldenParticles, createHeartRain, createFireworks - SIN CAMBIOS]

function animateRain() {
    const rainOverlay = document.querySelector('.rain-overlay');
    if (!rainOverlay) return;
    
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
        rainOverlay.appendChild(drop);
    }
}

function animateEmojis() {
    const emojis = document.querySelectorAll('.emoji-float');
    if (typeof gsap === 'undefined') return;
    
    emojis.forEach((emoji, index) => {
        gsap.to(emoji, {
            duration: 3,
            y: -500,
            opacity: 0,
            delay: index * 0.3,
            repeat: -1,
            ease: 'power1.in'
        });
    });
}

function createGoldenParticles() {
    const container = document.querySelector('.golden-particles');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        container.appendChild(particle);

        if (typeof gsap !== 'undefined') {
            gsap.to(particle, {
                duration: Math.random() * 2 + 1,
                y: -200,
                opacity: 0,
                repeat: -1,
                delay: Math.random() * 2,
                ease: 'power1.out'
            });
        }
    }
}

function createHeartRain() {
    const container = document.querySelector('.heart-rain');
    if (!container) return;
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        container.appendChild(heart);

        if (typeof gsap !== 'undefined') {
            gsap.to(heart, {
                duration: 3,
                y: window.innerHeight,
                rotation: 360,
                opacity: 0,
                ease: 'linear',
                onComplete: () => heart.remove()
            });
        } else {
            setTimeout(() => heart.remove(), 3000);
        }
    }, 300);
}

function createFireworks() {
    const container = document.querySelector('.fireworks-container');
    if (!container) return;
    
    setInterval(() => {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = Math.random() * 100 + '%';
        firework.style.top = Math.random() * 50 + '%';
        container.appendChild(firework);

        setTimeout(() => firework.remove(), 1000);
    }, 500);
}