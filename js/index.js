const logo = document.querySelector('.logo');
let charlas = [];

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        logo.classList.add('logo-small');
    } else {
        logo.classList.remove('logo-small');
    }
});


window.addEventListener('scroll', () => {
  const elemento = document.querySelector('.botonera');
  const posicion = elemento.getBoundingClientRect().top;

  if (posicion < 100) {
    elemento.style.zIndex = "10";
  } else {
    elemento.style.zIndex = "-1";
  }
});

// Card flip & zoom
const cards = document.querySelectorAll('.card');
const overlay = document.querySelector('.card-overlay');

cards.forEach(card => {
  card.addEventListener('click', () => {
    const isFlipped = card.classList.contains('flipped');

    // Si ya está volteada, la cerramos
    if (isFlipped) {
      closeCard(card);
      return;
    }

    // Cerrar cualquier otra card abierta
    const openCard = document.querySelector('.card.flipped');
    if (openCard) closeCard(openCard);

    // Abrir esta card
    card.classList.add('flipped');
    overlay.classList.add('active');
  });
});

overlay.addEventListener('click', () => {
  const openCard = document.querySelector('.card.flipped');
  if (openCard) closeCard(openCard);
});

function closeCard(card) {
  card.classList.remove('flipped');
  overlay.classList.remove('active');
}

// Scroll reveal con efecto escalonado
const scrollObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter(e => e.isIntersecting);
  visible.forEach((entry, i) => {
    setTimeout(() => {
      entry.target.classList.add('visible');
    }, i * 100);
    scrollObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

cards.forEach(card => scrollObserver.observe(card));


const consumirCharlas = async () => {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyb0lbfQGKlO0v1NucBaIUfs9HT0eJDICMwSO_9vjnMNStjUnoOtYrUxSZEYKZQQQAnQw/exec');
    const data = await response.json();
    console.log(data);
}

