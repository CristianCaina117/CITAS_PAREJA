// Config.js - VERSIÓN CORREGIDA PARA VERCEL

const toName = document.getElementById("toName");
const fromName = document.getElementById("fromName");
const message = document.getElementById("message");
const generatedLink = document.getElementById("generatedLink");
const copyBtn = document.getElementById("copyBtn");
const testBtn = document.getElementById("testBtn");
const startMusicBtn = document.getElementById("startMusic");
const readyText = document.querySelector(".ready");

let audio = null;
let musicIsPlaying = false;

// OCULTAR elementos al inicio
generatedLink.style.display = "none";
copyBtn.style.display = "none";
testBtn.style.display = "none";
readyText.style.display = "none";

// Cargar datos guardados
window.addEventListener("DOMContentLoaded", () => {
    const savedTo = localStorage.getItem("usertoName");
    const savedFrom = localStorage.getItem("userfromName");
    const savedMsg = localStorage.getItem("usermessage");
    
    if (savedTo) toName.value = savedTo;
    if (savedFrom) fromName.value = savedFrom;
    if (savedMsg) message.value = savedMsg;
    
    // Generar link si hay datos
    if (savedTo && savedFrom) {
        generateLink();
    }
});

// Función para generar link - CORREGIDA PARA VERCEL
function generateLink() {
    const toValue = toName.value.trim();
    const fromValue = fromName.value.trim();
    const msgValue = message.value.trim() || "Nos vemos pronto 💫";
    
    // Validar que los campos obligatorios estén llenos
    if (!toValue || !fromValue) {
        hideElements();
        return;
    }
    
    // Guardar en localStorage
    localStorage.setItem("usertoName", toValue);
    localStorage.setItem("userfromName", fromValue);
    localStorage.setItem("usermessage", msgValue);
    
    // GENERAR URL - Compatible con local y Vercel
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('?')[0].replace('index.html', '');
    
    // Construir la URL de experiencia
    const experienceUrl = `${baseUrl}experiencia.html`;
    
    const params = new URLSearchParams({
        to: toValue,
        from: fromValue,
        msg: msgValue
    });
    
    const link = `${experienceUrl}?${params.toString()}`;
    generatedLink.value = link;
    
    // Mostrar elementos con animación
    showElementsAnimated();
}

// Función para ocultar elementos
function hideElements() {
    generatedLink.style.display = "none";
    copyBtn.style.display = "none";
    testBtn.style.display = "none";
    readyText.style.display = "none";
}

// Función para mostrar elementos con animación
function showElementsAnimated() {
    // 1. Mostrar texto "Tu link está listo"
    readyText.style.display = "block";
    readyText.style.opacity = "0";
    readyText.style.transform = "translateY(-20px)";
    
    setTimeout(() => {
        readyText.style.transition = "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        readyText.style.opacity = "1";
        readyText.style.transform = "translateY(0)";
    }, 10);
    
    // 2. Mostrar input del link
    setTimeout(() => {
        generatedLink.style.display = "block";
        generatedLink.style.opacity = "0";
        generatedLink.style.transform = "scale(0.8)";
        
        setTimeout(() => {
            generatedLink.style.transition = "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
            generatedLink.style.opacity = "1";
            generatedLink.style.transform = "scale(1)";
        }, 10);
    }, 300);
    
    // 3. Mostrar botones
    setTimeout(() => {
        copyBtn.style.display = "inline-block";
        testBtn.style.display = "inline-block";
        copyBtn.style.opacity = "0";
        testBtn.style.opacity = "0";
        copyBtn.style.transform = "translateX(-30px)";
        testBtn.style.transform = "translateX(30px)";
        
        setTimeout(() => {
            copyBtn.style.transition = "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
            testBtn.style.transition = "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
            copyBtn.style.opacity = "1";
            testBtn.style.opacity = "1";
            copyBtn.style.transform = "translateX(0)";
            testBtn.style.transform = "translateX(0)";
        }, 10);
    }, 500);
}

// Escuchar cambios en tiempo real
toName.addEventListener("input", generateLink);
fromName.addEventListener("input", generateLink);
message.addEventListener("input", generateLink);

// Inicializar audio local
function initAudio() {
    if (!audio) {
        audio = new Audio('Assets/Audio/sombr-back.mp3');
        audio.loop = true;
        audio.volume = 0.6;
    }
}

// Botón de música
startMusicBtn.addEventListener("click", () => {
    initAudio();
    
    if (!musicIsPlaying) {
        // Iniciar música y fuegos artificiales
        audio.play().then(() => {
            window.startFireworks();
            startMusicBtn.innerHTML = '⏸️ Pausar música';
            startMusicBtn.classList.add('playing');
            musicIsPlaying = true;
        }).catch(err => {
            console.error("Error al reproducir:", err);
            alert("Haz clic de nuevo para activar el audio");
        });
    } else {
        // Pausar música y fuegos artificiales
        audio.pause();
        window.stopFireworks();
        startMusicBtn.innerHTML = '▶️ Reproducir música';
        startMusicBtn.classList.remove('playing');
        musicIsPlaying = false;
    }
});

// Copiar link
copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(generatedLink.value).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✅ Copiado!";
        copyBtn.style.background = "linear-gradient(135deg, #10b981 0%, #34d399 100%)";
        copyBtn.style.transform = "scale(1.05)";
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = "";
            copyBtn.style.transform = "scale(1)";
        }, 2000);
    }).catch(err => {
        // Fallback para navegadores antiguos
        generatedLink.select();
        document.execCommand("copy");
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✅ Copiado!";
        copyBtn.style.background = "linear-gradient(135deg, #10b981 0%, #34d399 100%)";
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = "";
        }, 2000);
    });
});

// Probar experiencia
testBtn.addEventListener("click", () => {
    if (generatedLink.value) {
        window.open(generatedLink.value, "_blank");
    }
});
