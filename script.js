document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DOM INTERACTION: Mobile Navigation Toggle
    const menuToggle = document.querySelector('#menu-toggle');
    const mainNav = document.querySelector('#main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('nav-open');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('nav-open')) {
                mainNav.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }

    // 2. FORM VALIDATION: Prevent URL submission & display errors
    const form = document.querySelector('#contact-form');

    if (form) {
        const fields = [
            { input: document.querySelector('#name'), error: document.querySelector('#name-error'), name: 'Name' },
            { input: document.querySelector('#email'), error: document.querySelector('#email-error'), name: 'Email' },
            { input: document.querySelector('#message'), error: document.querySelector('#message-error'), name: 'Message' }
        ];

        const showError = (field, message) => {
            if (field.error) {
                field.error.textContent = message;
                field.error.style.display = 'block';
            }
            if (field.input) {
                field.input.setAttribute('aria-invalid', 'true');
            }
        };

        const clearError = (field) => {
            if (field.error) {
                field.error.textContent = '';
                field.error.style.display = 'none';
            }
            if (field.input) {
                field.input.removeAttribute('aria-invalid');
            }
        };

        fields.forEach(field => {
            if (field.input) {
                field.input.addEventListener('input', () => {
                    if (field.input.value.trim() !== '') {
                        clearError(field);
                    }
                });
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            let firstInvalidInput = null;

            fields.forEach(field => {
                if (!field.input) return;
                const value = field.input.value.trim();

                if (value === '') {
                    showError(field, `${field.name} is required.`);
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field.input;
                } else if (field.input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    showError(field, 'Please enter a valid email address.');
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = field.input;
                } else {
                    clearError(field);
                }
            });

            if (!isValid) {
                if (firstInvalidInput) firstInvalidInput.focus();
            } else {
                const successMsg = document.querySelector('#form-success');
                if (successMsg) {
                    successMsg.textContent = 'Thank you! Your message has been sent successfully.';
                    successMsg.style.display = 'block';
                }
                form.reset();
            }
        });
    }

    // 3. API FETCH: Live GitHub Data
    const githubContainer = document.querySelector('#github-card');

    if (githubContainer) {
        const username = 'kgarner2-cmyk';
        
        fetch(`https://api.github.com/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    return fetch(`https://api.github.com/users/octocat`).then(res => res.json());
                }
                return response.json();
            })
            .then(data => {
                githubContainer.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="${data.avatar_url}" alt="${data.login}'s profile picture" style="width: 60px; height: 60px; border-radius: 50%;">
                        <div>
                            <p style="margin: 0; font-weight: 600; color: var(--text-dark);">${data.name || data.login}</p>
                            <p style="margin: 0; font-size: 0.875rem;">Public Repos: <strong>${data.public_repos}</strong> | Followers: <strong>${data.followers}</strong></p>
                        </div>
                    </div>
                `;
            })
            .catch(error => {
                console.error('Fetch error:', error);
                githubContainer.innerHTML = `<p style="color: var(--text-muted);">Unable to load live statistics at this time.</p>`;
            });
    }
});