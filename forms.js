document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.auth-form')?.addEventListener('submit', event => {
        event.preventDefault();
        const password = document.getElementById('password');
        const confirmation = document.getElementById('newpassword');
        const status = document.getElementById('form-status');
        if (confirmation && password.value !== confirmation.value) {
            status.textContent = 'As senhas precisam ser iguais.';
            confirmation.focus();
            return;
        }
        status.textContent = 'Formulário demonstrativo: nenhum dado foi enviado ou salvo. O diário de treinos já pode ser usado sem conta.';
        if (password) password.value = '';
        if (confirmation) confirmation.value = '';
    });
});
