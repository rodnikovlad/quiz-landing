setTimeout(() => {
    const steps = document.querySelectorAll('.quiz-step');
    const historyContainer = document.querySelector('.quiz-types__history');

    if (!steps.length || !historyContainer) {
        console.error('❌ Не найдены шаги или контейнер истории');
        return;
    }

    let currentStep = 0;
    const answers = {};
    const answeredSteps = [];

    function showStep(index) {
        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.add('active');
                step.removeAttribute('hidden');

                const backButtons = step.querySelectorAll('.quiz-types__back');
                backButtons.forEach(btn => {
                    if (i === 0) {
                        btn.style.display = 'none';
                    } else {
                        btn.style.display = 'inline-flex';
                    }
                });

                if (i === steps.length - 1) {
                    setTimeout(initCustomSelect, 100);
                }
            } else {
                step.classList.remove('active');
                step.setAttribute('hidden', '');
            }
        });
    }

    function getSelectedAnswers(stepIndex) {
        const step = steps[stepIndex];
        const selected = [];
        step.querySelectorAll('.quiz-types__option.active').forEach(opt => {
            selected.push(opt.textContent.trim());
        });
        return selected;
    }

    function saveCurrentAnswers() {
        answers[currentStep] = getSelectedAnswers(currentStep);
    }

    function createHistoryCard(stepIndex, isActive = false) {
        const step = steps[stepIndex];
        const question = step.querySelector('.quiz-types__title')?.textContent.trim() || `Вопрос ${stepIndex + 1}`;
        const stepAnswers = answers[stepIndex] || [];

        const card = document.createElement('div');
        card.className = 'quiz-types__info';
        if (isActive) card.classList.add('active');
        card.dataset.step = stepIndex;

        card.innerHTML = `
            <div class="quiz-types__info-title">${question}</div>
            <div class="quiz-types__info-text">${stepAnswers.length ? stepAnswers.join('. ') : ''}</div>
        `;

        card.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            const targetStep = parseInt(this.dataset.step);
            goToStep(targetStep);
        };

        return card;
    }

    function renderHistory() {
        historyContainer.innerHTML = '';

        answeredSteps.forEach(stepIndex => {
            historyContainer.appendChild(createHistoryCard(stepIndex, false));
        });

        historyContainer.appendChild(createHistoryCard(currentStep, true));
    }

    function goToStep(stepIndex) {
        if (stepIndex === currentStep) return;

        saveCurrentAnswers();

        const answerIndex = answeredSteps.indexOf(stepIndex);
        if (answerIndex !== -1) {
            answeredSteps.splice(answerIndex);
        }

        steps[currentStep].classList.remove('active');
        steps[currentStep].setAttribute('hidden', '');

        currentStep = stepIndex;
        showStep(currentStep);

        restoreAnswers();

        renderHistory();
    }

    function restoreAnswers() {
        const step = steps[currentStep];
        const saved = answers[currentStep] || [];

        step.querySelectorAll('.quiz-types__option').forEach(opt => {
            opt.classList.remove('active');
        });

        if (saved.length) {
            step.querySelectorAll('.quiz-types__option').forEach(opt => {
                if (saved.includes(opt.textContent.trim())) {
                    opt.classList.add('active');
                }
            });
        }
    }

    function handleNext() {
        if (currentStep === steps.length - 1) {
            handleLastStep();
            return;
        }

        const selected = getSelectedAnswers(currentStep);

        if (selected.length === 0) {
            alert('❓ Выберите хотя бы один вариант');
            return;
        }

        answers[currentStep] = selected;

        if (currentStep < steps.length - 1) {
            if (!answeredSteps.includes(currentStep)) {
                answeredSteps.push(currentStep);
            }

            steps[currentStep].classList.remove('active');
            steps[currentStep].setAttribute('hidden', '');

            currentStep++;
            showStep(currentStep);

            renderHistory();

            restoreAnswers();
        }
    }

    function handleLastStep() {
        const comment = document.querySelector('.quiz-types__input')?.value || '';
        const selectPlaceholder = document.querySelector('.quiz-types__select-placeholder');
        const rating = selectPlaceholder?.classList.contains('selected') ? selectPlaceholder.textContent : 'Не выбрано';

        answers[currentStep] = {
            comment: comment,
            rating: rating
        };

        alert('🎉 Спасибо за обратную связь! Квиз завершён!');

        if (!answeredSteps.includes(currentStep)) {
            answeredSteps.push(currentStep);
        }
        renderHistory();
    }

    function initCustomSelect() {
        const selectHeader = document.getElementById('selectHeader');
        const selectDropdown = document.getElementById('selectDropdown');
        const selectOptions = document.querySelectorAll('.quiz-types__select-option');
        const selectPlaceholder = selectHeader?.querySelector('.quiz-types__select-placeholder');

        if (!selectHeader) return;

        const newHeader = selectHeader.cloneNode(true);
        selectHeader.parentNode.replaceChild(newHeader, selectHeader);

        const newDropdown = selectDropdown.cloneNode(true);
        selectDropdown.parentNode.replaceChild(newDropdown, selectDropdown);

        const newSelectHeader = document.getElementById('selectHeader');
        const newSelectDropdown = document.getElementById('selectDropdown');
        const newSelectOptions = document.querySelectorAll('.quiz-types__select-option');
        const newSelectPlaceholder = newSelectHeader.querySelector('.quiz-types__select-placeholder');

        newSelectHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            newSelectHeader.classList.toggle('active');
            newSelectDropdown.classList.toggle('show');
        });

        newSelectOptions.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.textContent;
                newSelectPlaceholder.textContent = value;
                newSelectPlaceholder.classList.add('selected');

                newSelectOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                newSelectHeader.classList.remove('active');
                newSelectDropdown.classList.remove('show');

                if (answers[currentStep]) {
                    answers[currentStep].rating = value;
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.quiz-types__select-wrapper')) {
                newSelectHeader?.classList.remove('active');
                newSelectDropdown?.classList.remove('show');
            }
        });
    }

    document.querySelectorAll('.quiz-types__option').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (this.classList.contains('radio-select')) {
                const container = this.closest('.quiz-types__options');
                container.querySelectorAll('.radio-select').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
            } else {
                this.classList.toggle('active');
            }

            saveCurrentAnswers();
        };
    });

    document.querySelectorAll('.quiz-types__next').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            handleNext();
        };
    });

    document.querySelectorAll('.quiz-types__back').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (currentStep > 0) {
                goToStep(currentStep - 1);
            }
        };
    });

    historyContainer.innerHTML = '';
    historyContainer.appendChild(createHistoryCard(0, true));
    showStep(0);

}, 500);
