const logo = document.querySelector('.logo');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        logo.classList.add('logo-small');
    } else {
        logo.classList.remove('logo-small');
    }
});
