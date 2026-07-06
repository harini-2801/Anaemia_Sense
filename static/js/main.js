document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------
    // 1. Dark/Light Theme Handler
    // ----------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('.theme-icon');
        const themeText = themeToggleBtn.querySelector('.theme-text');
        
        // Check local storage for preference
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'Light Mode';
        } else {
            document.body.classList.remove('dark-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Dark Mode';
        }

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if (isDark) {
                if (themeIcon) themeIcon.textContent = '☀️';
                if (themeText) themeText.textContent = 'Light Mode';
            } else {
                if (themeIcon) themeIcon.textContent = '🌙';
                if (themeText) themeText.textContent = 'Dark Mode';
            }
        });
    }

    // ----------------------------------------
    // 2. Gender Selection Cards Helper
    // ----------------------------------------
    const genderCards = document.querySelectorAll('.gender-card');
    const genderInput = document.getElementById('genderInput');

    if (genderCards.length > 0 && genderInput) {
        genderCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                genderCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to active card
                card.classList.add('selected');
                
                // Set hidden input value
                const genderVal = card.getAttribute('data-value');
                genderInput.value = genderVal;
            });
        });
    }

    // ----------------------------------------
    // 3. Tabbed Gallery Navigation (predict.html)
    // ----------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Deactivate all buttons & contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Activate clicked button and target content
                btn.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
});
