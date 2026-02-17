const logo = document.querySelector('.logo');

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
  console.log(posicion);

  if (posicion < 100) {
    elemento.style.zIndex = "10";
  } else {
    elemento.style.zIndex = "-1";
  }
});

