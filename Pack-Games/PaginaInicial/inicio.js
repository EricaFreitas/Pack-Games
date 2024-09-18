document.addEventListener('DOMContentLoaded', function() {
    const pacmanLink = document.getElementById('pacman-link');
    const pacmanAnimacao = document.querySelector('.pacman-animacao');
    const pacmanAnimacao2 = document.querySelector('.pacman-animacao2');

    if (pacmanLink && pacmanAnimacao && pacmanAnimacao2) {
        pacmanLink.addEventListener('click', function(event) {
            event.preventDefault();

            // Torna a animação principal visível e inicia a transição
            pacmanAnimacao.classList.add('show');
            pacmanAnimacao.style.left = '200vw'; // Move o Pac-Man para fora da tela

            // Inicia a animação dos fantasmas após um pequeno delay
            setTimeout(() => {
                pacmanAnimacao2.style.right = '200vw'; // Move os fantasmas da direita para a esquerda
                pacmanAnimacao2.classList.add('show');
            }, 5000); // Pequeno delay para garantir que a animação dos fantasmas comece após o Pac-Man

            // Redireciona após a animação
            setTimeout(() => {
                window.location.href = pacmanLink.href;
            }, 12000); // Tempo deve ser igual ao da transição de `left` e `right`
        });
    } else {
        console.error('Elementos do Pac-Man não encontrados.');
    }
});
