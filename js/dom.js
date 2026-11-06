export function reproducirSonidoSynth(freq, dur) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch (e) {
    // Ignorar políticas de audio de navegador
  }
}

export function reproducirSonidoCheckout() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notas = [523.25, 659.25, 783.99, 1046.50];

    notas.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + (idx * 0.08));

      gain.gain.setValueAtTime(0.08, ctx.currentTime + (idx * 0.08));
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + (idx * 0.08) + 0.3
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + (idx * 0.08));
      osc.stop(ctx.currentTime + (idx * 0.08) + 0.3);
    });
  } catch (e) {
    // Ignorar errores de audio
  }
}

export function crearParticulaVoladora(sourceEl, callbackAlFinalizar) {
  const cartBtn = document.getElementById('cart-toggle-btn');
  if (!cartBtn) {
    if (callbackAlFinalizar) callbackAlFinalizar();
    return;
  }

  const sourceRect = sourceEl.getBoundingClientRect();
  const cartRect = cartBtn.getBoundingClientRect();

  const flyer = document.createElement('div');
  flyer.className = 'flyer-particle';
  flyer.innerHTML = '⚡';

  flyer.style.left = `${sourceRect.left + sourceRect.width / 2 - 14}px`;
  flyer.style.top = `${sourceRect.top + sourceRect.height / 2 - 14}px`;

  document.body.appendChild(flyer);

  const animation = flyer.animate([
    {
      left: `${sourceRect.left + sourceRect.width / 2 - 14}px`,
      top: `${sourceRect.top + sourceRect.height / 2 - 14}px`,
      transform: 'scale(1.4) rotate(0deg)',
      opacity: 1
    },
    {
      left: `${cartRect.left + cartRect.width / 2 - 14}px`,
      top: `${cartRect.top + cartRect.height / 2 - 14}px`,
      transform: 'scale(0.3) rotate(360deg)',
      opacity: 0.8
    }
  ], {
    duration: 650,
    easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)'
  });

  animation.onfinish = () => {
    flyer.remove();

    const badge = document.getElementById('cart-badge');
    cartBtn.classList.add('sacudir');
    if (badge) badge.classList.add('pulso');

    setTimeout(() => {
      cartBtn.classList.remove('sacudir');
      if (badge) badge.classList.remove('pulso');
    }, 400);

    if (callbackAlFinalizar) callbackAlFinalizar();
  };
}

export function toggleCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');

  if (drawer) drawer.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

export function efectoSobrecargaLogo() {
  const logoSvg = document.getElementById('logoSvg');

  if (logoSvg) logoSvg.classList.add('sobrecarga');
  reproducirSonidoSynth(880, 0.15);

  setTimeout(() => {
    if (logoSvg) logoSvg.classList.remove('sobrecarga');
  }, 600);
}

export function cerrarModalCheckout() {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.remove('open');
}