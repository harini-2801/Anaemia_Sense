document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------
    // 1. Dark/Light Theme Handler
    // ----------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('.theme-icon');
        const themeText = themeToggleBtn.querySelector('.theme-text');
        
        const currentTheme = localStorage.getItem('theme') || 'dark'; // Dark theme default
        if (currentTheme === 'light') {
            document.body.classList.add('light-theme');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeText) themeText.textContent = 'Dark Mode';
        } else {
            document.body.classList.remove('light-theme');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeText) themeText.textContent = 'Light Mode';
        }

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            if (isLight) {
                if (themeIcon) themeIcon.textContent = '🌙';
                if (themeText) themeText.textContent = 'Dark Mode';
            } else {
                if (themeIcon) themeIcon.textContent = '☀️';
                if (themeText) themeText.textContent = 'Light Mode';
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
                genderCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const genderVal = card.getAttribute('data-value');
                genderInput.value = genderVal;
                
                // Re-validate hemoglobin since thresholds change with gender
                validateHemoglobin();
            });
        });
    }

    // ----------------------------------------
    // 3. SPA Section Switching & Nav Tabs
    // ----------------------------------------
    const navTabBtns = document.querySelectorAll('.nav-tab-btn');
    const appSections = document.querySelectorAll('.app-section');

    if (navTabBtns.length > 0) {
        navTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSectionId = btn.getAttribute('data-section');
                
                // Switch tabs
                navTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Switch active sections
                appSections.forEach(sec => sec.classList.remove('active'));
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
                
                // Trigger model science chart fill animations if that tab is loaded
                if (targetSectionId === 'science-section') {
                    animateModelCharts();
                }
            });
        });
    }

    // ----------------------------------------
    // 4. Model Science Chart Animate Widths
    // ----------------------------------------
    function animateModelCharts() {
        const fillBars = document.querySelectorAll('.chart-bar-fill');
        fillBars.forEach(bar => {
            const fillWidth = bar.getAttribute('data-fill');
            // Timeout to allow DOM rendering before transition runs
            setTimeout(() => {
                bar.style.width = fillWidth + '%';
            }, 100);
        });
    }

    // ----------------------------------------
    // 5. FAQ Accordion Expanding
    // ----------------------------------------
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.closest('.faq-item');
                const isExpanded = faqItem.classList.contains('expanded');
                
                // Collapse all items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('expanded');
                });
                
                // Expand clicked item if it wasn't already expanded
                if (!isExpanded) {
                    faqItem.classList.add('expanded');
                }
            });
        });
    }

    // ----------------------------------------
    // 6. Real-time Biological Form Validation
    // ----------------------------------------
    const hemoglobinField = document.getElementById('Hemoglobin');
    const mcvField = document.getElementById('MCV');
    const mchField = document.getElementById('MCH');
    const mchcField = document.getElementById('MCHC');

    if (hemoglobinField) {
        hemoglobinField.addEventListener('input', validateHemoglobin);
        mcvField.addEventListener('input', validateMCV);
        mchField.addEventListener('input', validateMCH);
        mchcField.addEventListener('input', validateMCHC);
    }

    function validateField(field, minVal, maxVal) {
        if (!field.value) {
            field.classList.remove('elevated', 'lowered');
            return;
        }
        const val = parseFloat(field.value);
        if (val < minVal) {
            field.classList.add('lowered');
            field.classList.remove('elevated');
        } else if (val > maxVal) {
            field.classList.add('elevated');
            field.classList.remove('lowered');
        } else {
            field.classList.remove('elevated', 'lowered');
        }
    }

    function validateHemoglobin() {
        if (!hemoglobinField) return;
        const isFemale = genderInput ? genderInput.value === '1' : false;
        // WHO normal hemoglobin ranges: Male 13.8 - 17.2, Female 12.1 - 15.1
        const minHb = isFemale ? 12.1 : 13.8;
        const maxHb = isFemale ? 15.1 : 17.2;
        validateField(hemoglobinField, minHb, maxHb);
    }

    function validateMCV() {
        if (!mcvField) return;
        // Normal MCV: 80 - 100 fL
        validateField(mcvField, 80, 100);
    }

    function validateMCH() {
        if (!mchField) return;
        // Normal MCH: 27 - 33 pg
        validateField(mchField, 27, 33);
    }

    function validateMCHC() {
        if (!mchcField) return;
        // Normal MCHC: 32 - 36 g/dL
        validateField(mchcField, 32, 36);
    }

    // ----------------------------------------
    // 7. Dietary Food Grid Filtering
    // ----------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const foodCards = document.querySelectorAll('.food-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-filter');
                
                // Toggle active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter food cards
                foodCards.forEach(card => {
                    const foodCategory = card.getAttribute('data-category');
                    if (category === 'all' || foodCategory === category) {
                        card.style.display = 'flex';
                        card.style.animation = 'sectionFadeIn 0.3s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ----------------------------------------
    // 8. Results Page Tab switching (predict.html)
    // ----------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
});
