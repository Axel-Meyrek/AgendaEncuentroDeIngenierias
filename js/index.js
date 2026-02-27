const logo = document.querySelector('.logo');
const containerCards = document.querySelector('.containerCards');
const buttons = document.querySelectorAll('.botonera_button');
const scrollHint = document.getElementById('scrollHint');

const avatarCharacter = document.getElementById('avatarCharacter');
const randomIndex = Math.floor(Math.random() * 5) + 1;
avatarCharacter.querySelector('img').src = `./img/avatars/Ing${randomIndex}.webp`;

let charlas = [];
let diaActivo = '10 de marzo'; // Martes por defecto

const diasMap = {
    'Martes': '10 de marzo',
    'Miércoles': '11 de marzo',
    'Jueves': '12 de marzo'
};

function updateCardVisibility() {
    const firstCard = containerCards.querySelector('.card');
    if (!firstCard) return;
    const stickyTop = parseFloat(getComputedStyle(firstCard).top);

    const inners = [...containerCards.querySelectorAll('.card_inner')];
    const rects = inners.map(el => el.getBoundingClientRect());

    inners.forEach((inner, i) => {
        const r = rects[i];
        // Cubierta si alguna tarjeta posterior está pegada (top ≈ stickyTop)
        // y se superpone horizontalmente (misma columna de la grilla)
        const isCovered = inners.slice(i + 1).some((_, j) => {
            const lr = rects[i + 1 + j];
            return Math.abs(lr.top - stickyTop) < 5 &&
                   lr.left < r.right &&
                   lr.right > r.left;
        });
        inner.classList.toggle('card--hidden', isCovered);
    });
}

// Logo shrink on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        logo.classList.add('logo-small');
        scrollHint.classList.add('scroll-hint--hidden');
    } else {
        logo.classList.remove('logo-small');
        scrollHint.classList.remove('scroll-hint--hidden');
    }
    updateCardVisibility();

    // Avatar disappear effect
    const scrollThreshold = window.innerHeight * 0.4;
    const progress = Math.min(window.scrollY / scrollThreshold, 1);
    avatarCharacter.style.opacity = 1 - progress;
    avatarCharacter.style.transform = `translateX(-50%) translateY(${progress * 60}px)`;
});


// Parse "8:00 am" or "16:00 pm" to minutes for sorting
function parseHora(horario) {
    const inicio = horario.split('-')[0].trim();
    const match = inicio.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (!match) return 0;
    let horas = parseInt(match[1]);
    const minutos = parseInt(match[2]);
    const periodo = match[3].toLowerCase();
    if (periodo === 'pm' && horas < 12) horas += 12;
    if (periodo === 'am' && horas === 12) horas = 0;
    return horas * 60 + minutos;
}

// Convert "8:00 am - 9:00 am" to "08:00 - 09:00"
function convertirSegmento(seg) {
    const match = seg.trim().match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (!match) return seg.trim();
    let h = parseInt(match[1]);
    const m = match[2];
    const p = match[3].toLowerCase();
    if (p === 'pm' && h < 12) h += 12;
    if (p === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m}`;
}

function convertirA24h(horario) {
    return horario.split('-').map(convertirSegmento).join(' - ');
}

// Escape text for use in HTML attributes
function escAttr(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// Generate card HTML using template strings
function crearCardHTML(charla) {
    const titulo = charla['Título de la actividad'];
    const ponente = charla['Nombre del Ponente'];
    const horario = charla['Horario'];
    const lugar = charla['Lugar'];
    return `
        <div class="card"
             data-titulo="${escAttr(titulo)}"
             data-ponente="${escAttr(ponente)}"
             data-horario="${escAttr(horario)}"
             data-lugar="${escAttr(lugar)}">
            <div class="card_inner">
                <p class="card_ponencia">${titulo}</p>
                ${ponente ? `<p class="card_ponente">${ponente}</p>` : ''}
                <p class="card_horario">${convertirA24h(horario)}</p>
                ${lugar ? `<p class="card_lugar">${lugar}</p>` : ''}
            </div>
        </div>
    `;
}

// Modal logic
const modal = document.getElementById('modal');
const modalPonencia = modal.querySelector('.modal_ponencia');
const modalPonente  = modal.querySelector('.modal_ponente');
const modalHorario  = modal.querySelector('.modal_horario');
const modalLugar    = modal.querySelector('.modal_lugar');
const modalClose    = modal.querySelector('.modal_close');

function openModal({ titulo, ponente, horario, lugar }) {
    modalPonencia.textContent = titulo;
    modalPonente.textContent  = ponente || '';
    modalPonente.hidden       = !ponente;
    modalHorario.textContent  = convertirA24h(horario);
    modalLugar.textContent    = lugar || '';
    modalLugar.hidden         = !lugar;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Open modal on card click
containerCards.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    openModal({
        titulo:  card.dataset.titulo,
        ponente: card.dataset.ponente,
        horario: card.dataset.horario,
        lugar:   card.dataset.lugar,
    });
});

// Close on X button
modalClose.addEventListener('click', closeModal);

// Close on backdrop click (outside modal_inner)
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Close on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Filter by day, sort by time, render
function renderizarCharlas() {
    const charlasFiltradas = charlas
        .filter(c => c['Fecha'] === diaActivo && c['Título de la actividad'].trim() !== '')
        .sort((a, b) => parseHora(a['Horario']) - parseHora(b['Horario']));

    containerCards.innerHTML = charlasFiltradas.map(crearCardHTML).join('');
    window.scrollTo({ top: containerCards.offsetTop - 200, behavior: 'smooth' });
    requestAnimationFrame(updateCardVisibility);
}

// Button click handlers
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('buttonActive'));
        btn.classList.add('buttonActive');
        diaActivo = diasMap[btn.textContent.trim()];
        renderizarCharlas();
    });
});

// Render skeleton placeholder cards while fetching
function mostrarSkeleton() {
    const skeletonHTML = Array.from({ length: 6 }, (_, i) => `
        <div class="card card--skeleton" style="--sk-delay: ${i * 0.08}s">
            <div class="card_inner card_inner--skeleton">
                <div class="sk-line sk-title" style="width: 88%"></div>
                <div class="sk-line sk-title" style="width: 65%"></div>
                <div class="sk-line sk-title" style="width: 50%"></div>
                <div class="sk-line sk-ponente"></div>
                <div class="sk-line sk-horario"></div>
                <div class="sk-line sk-lugar"></div>
            </div>
        </div>
    `).join('');
    containerCards.innerHTML = skeletonHTML;
}

// Fetch and render
const consumirCharlas = async () => {
    mostrarSkeleton();
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyb0lbfQGKlO0v1NucBaIUfs9HT0eJDICMwSO_9vjnMNStjUnoOtYrUxSZEYKZQQQAnQw/exec');
        const data = await response.json();
        charlas = data;
        renderizarCharlas();
    } catch (error) {
        console.error('Error al cargar las charlas:', error);
    }
};

consumirCharlas();
