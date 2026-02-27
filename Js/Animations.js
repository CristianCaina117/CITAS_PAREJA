// Animations.js - CON PROTECCIÓN

export function startAnimations() {
    // Verificar si GSAP está disponible
    if (typeof gsap === 'undefined') {
        console.log('ℹ️ GSAP no está cargado en esta página');
        return; // Salir sin error
    }

    // Tus animaciones GSAP aquí
    gsap.to('.background-lights', {
        duration: 8,
        backgroundPosition: '100% 100%',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}