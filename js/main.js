'use strict';

/* ---- Productos de la ventana emergente ----
   Para cambiar un producto, edita solo este objeto.
   TODO: las fotos de Pastelería y Café repiten las de pan; cámbialas por las suyas. */
const products = {
  horno: {
    title: 'Horno',
    items: [
      { name: 'Integral', price: '2,10 €', img: 'img/productos/pan-hogaza.webp' },
      { name: 'Baguette', price: '1,20 €', img: 'img/productos/pan-baguette.webp' },
      { name: 'Molde', price: '1,20 €', img: 'img/productos/pan-molde.webp' },
      { name: 'Hogaza', price: '2,80 €', img: 'img/productos/pan-hogaza.webp' }
    ]
  },
  pasteleria: {
    title: 'Pastelería',
    items: [
      { name: 'Cruasán', price: '1,50 €', img: 'img/productos/pan-molde.webp' },
      { name: 'Napolitana', price: '1,80 €', img: 'img/productos/pan-baguette.webp' },
      { name: 'Ensaimada', price: '2,00 €', img: 'img/productos/pan-hogaza.webp' },
      { name: 'Magdalena', price: '1,10 €', img: 'img/productos/pan-molde.webp' }
    ]
  },
  cafe: {
    title: 'Café',
    items: [
      { name: 'Espresso', price: '1,30 €', img: 'img/productos/pan-baguette.webp' },
      { name: 'Cortado', price: '1,50 €', img: 'img/productos/pan-molde.webp' },
      { name: 'Café con leche', price: '1,80 €', img: 'img/productos/pan-hogaza.webp' },
      { name: 'Capuchino', price: '2,20 €', img: 'img/productos/pan-baguette.webp' }
    ]
  }
};

/* ---- Ventana de productos (<dialog>) ---- */
const dialog = document.querySelector('#product-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const productList = document.querySelector('#product-list');

function openCategory(key) {
  const category = products[key];
  dialogTitle.textContent = category.title;

  // Una ficha <li> por producto (la imagen es decorativa: el nombre ya va escrito debajo)
  productList.innerHTML = category.items.map((item) => `
    <li>
      <img src="${item.img}" alt="">
      <p class="product-name">${item.name}</p>
      <p class="product-price">${item.price}</p>
    </li>`).join('');

  dialog.showModal();             // showModal ya cierra con Esc y bloquea el resto de la página
}

document.querySelectorAll('.category-btn').forEach((btn) => {
  btn.addEventListener('click', () => openCategory(btn.dataset.category));
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());

// Cerrar al pulsar fuera del recuadro (en el fondo)
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

/* ---- Mobile menu ---- */
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
links.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

/* ---- Nav sólida al hacer scroll ---- */
const nav = document.querySelector('.nav');
function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ---- Highlight current section in nav ---- */
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

/* ---- Reveal on scroll, once ---- */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---- Hero video: pausado si el usuario prefiere menos movimiento ---- */
const video = document.querySelector('.hero-video');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  video.removeAttribute('autoplay');
  video.pause();
}

/* ---- Contact form: solo validación (web de ejemplo, no envía nada) ---- */
const form = document.querySelector('#contact-form');
const statusEl = document.querySelector('#form-status');

const rules = {
  name: (input) => (input.value.trim().length >= 2 ? '' : 'Escribe tu nombre.'),
  email: (input) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) ? '' : 'Escribe un email válido.'),
  message: (input) => (input.value.trim().length >= 10 ? '' : 'El mensaje debe tener al menos 10 caracteres.'),
  terms: (input) => (input.checked ? '' : 'Debes aceptar los términos.')
};

function validateField(input) {
  const error = rules[input.name](input);
  document.querySelector(`#${input.id}-error`).textContent = error;
  input.setAttribute('aria-invalid', error ? 'true' : 'false');
  return !error;
}

const fields = [...form.querySelectorAll('input[name], textarea[name]')].filter((f) => rules[f.name]);

fields.forEach((input) => {
  const event = input.type === 'checkbox' ? 'change' : 'blur';
  input.addEventListener(event, () => validateField(input));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    statusEl.className = 'form-status fail';
    statusEl.textContent = 'Revisa los campos marcados.';
    fields.find((f) => f.getAttribute('aria-invalid') === 'true').focus();
    return;
  }
  form.reset();
  fields.forEach((f) => f.removeAttribute('aria-invalid'));
  statusEl.className = 'form-status ok';
  statusEl.textContent = '¡Gracias! Hemos recibido tu mensaje.';
});

document.querySelector('#year').textContent = new Date().getFullYear();
