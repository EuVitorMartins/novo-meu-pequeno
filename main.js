
/* ==========================================
   SEÇÃO 04 — CARROSSEL AUTOMÁTICO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const carrossel = document.querySelector(".kit-carrossel");
  if (!carrossel) return;

  const track = carrossel.querySelector(".kit-carrossel-track");
  const slides = carrossel.querySelectorAll(".kit-carrossel-slide");
  const anterior = carrossel.querySelector(".kit-carrossel-anterior");
  const proxima = carrossel.querySelector(".kit-carrossel-proxima");
  const contador = carrossel.querySelector(".kit-carrossel-contador");
  const barra = carrossel.querySelector(".kit-carrossel-barra");

  const total = slides.length;
  const intervalo = 3500;

  if (!total) return;

  let atual = 0;
  let timer = null;
  let mouseSobre = false;
  let focoDentro = false;
  let inicioToque = null;

  const reduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function atualizar() {
    track.style.transform = `translateX(-${atual * 100}%)`;

    contador.textContent = `${atual + 1} / ${total}`;
    barra.style.width = `${((atual + 1) / total) * 100}%`;
  }

  function navegar(indice) {
    atual = (indice + total) % total;
    atualizar();
  }

  function parar() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function iniciar() {
    parar();

    if (
      total < 2 ||
      mouseSobre ||
      focoDentro ||
      document.hidden ||
      reduzirMovimento.matches
    ) return;

    timer = setInterval(() => {
      navegar(atual + 1);
    }, intervalo);
  }

  anterior.addEventListener("click", () => {
    navegar(atual - 1);
    iniciar();
  });

  proxima.addEventListener("click", () => {
    navegar(atual + 1);
    iniciar();
  });

  carrossel.addEventListener("mouseenter", () => {
    mouseSobre = true;
    parar();
  });

  carrossel.addEventListener("mouseleave", () => {
    mouseSobre = false;
    iniciar();
  });

  carrossel.addEventListener("focusin", () => {
    focoDentro = true;
    parar();
  });

  carrossel.addEventListener("focusout", (evento) => {
    if (!carrossel.contains(evento.relatedTarget)) {
      focoDentro = false;
      iniciar();
    }
  });

  const viewport = carrossel.querySelector(
    ".kit-carrossel-viewport"
  );

  viewport.addEventListener("touchstart", (evento) => {
    inicioToque = evento.changedTouches[0].screenX;
    parar();
  }, { passive: true });

  viewport.addEventListener("touchend", (evento) => {
    if (inicioToque === null) return;

    const distancia =
      evento.changedTouches[0].screenX - inicioToque;

    if (Math.abs(distancia) > 45) {
      navegar(atual + (distancia < 0 ? 1 : -1));
    }

    inicioToque = null;
    iniciar();
  }, { passive: true });

  document.addEventListener("visibilitychange", iniciar);
  reduzirMovimento.addEventListener("change", iniciar);

  if (total < 2) {
    anterior.hidden = true;
    proxima.hidden = true;
  }

  atualizar();
  iniciar();

});
