document.addEventListener('DOMContentLoaded', function() {
    const pacmanLink = document.getElementById('pacman-link');
    const pacmanAnimacao = document.querySelector('.pacman-animacao');
    const pacmanAnimacao2 = document.querySelector('.pacman-animacao2');

    if (pacmanLink && pacmanAnimacao && pacmanAnimacao2) {
        pacmanLink.addEventListener('click', function(event) {
            event.preventDefault();

            pacmanAnimacao.classList.add('show');
            pacmanAnimacao.style.left = '200vw';

            setTimeout(() => {
                pacmanAnimacao2.style.right = '200vw';
                pacmanAnimacao2.classList.add('show');
            }, 5000); 

            setTimeout(() => {
                window.location.href = pacmanLink.href;
            }, 12000);
        });
    } else {
        console.error('Elementos do Pac-Man não encontrados.');
    }
});
