const logo = document.querySelector('.logo');
const containerCards = document.querySelector('.containerCards');
const buttons = document.querySelectorAll('.botonera_button');

let charlas = [];
let diaActivo = '10 de marzo'; // Martes por defecto

const diasMap = {
    'Martes': '10 de marzo',
    'Miércoles': '11 de marzo',
    'Jueves': '12 de marzo'
};

// Logo shrink on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        logo.classList.add('logo-small');
    } else {
        logo.classList.remove('logo-small');
    }
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

// Generate card HTML using template strings
function crearCardHTML(charla) {
    const titulo = charla['Título de la actividad'];
    const ponente = charla['Nombre del Ponente'];
    const horario = charla['Horario'];
    const lugar = charla['Lugar'];
    return `
        <div class="card">
            <div class="card_inner">
                <p class="card_ponencia">${titulo}</p>
                ${ponente ? `<p class="card_ponente">${ponente}</p>` : ''}
                <p class="card_horario">${horario}</p>
                ${lugar ? `<p class="card_lugar">${lugar}</p>` : ''}
            </div>
        </div>
    `;
}

// Filter by day, sort by time, render
function renderizarCharlas() {
    const charlasFiltradas = charlas
        .filter(c => c['Fecha'] === diaActivo && c['Título de la actividad'].trim() !== '')
        .sort((a, b) => parseHora(a['Horario']) - parseHora(b['Horario']));

    containerCards.innerHTML = charlasFiltradas.map(crearCardHTML).join('');
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

// Fetch and render
const consumirCharlas = async () => {
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
