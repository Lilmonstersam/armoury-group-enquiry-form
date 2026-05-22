document.addEventListener('DOMContentLoaded', () => {
    const accessoriesList = [
        'Air Cleaner Panels',
        'Air cleaner Shrouds',
        'Battery Box Cover',
        'Beacon Bracket',
        'Bonnet Latch Covers',
        'Bug Deflector',
        'Bunk Skirt Extensions',
        'Bunk Wings',
        'Driving Light Mount',
        'Elephant Ears',
        'Flares',
        'Headlight Surrounds',
        'Hinge Cover',
        'Kick Panel',
        'Low Mount Guard Brackets',
        'Mirror Backs & Mirror Panels',
        'Mudflap Brackets',
        'Retro Fit Old-School Steps',
        'Steps & Tank Skirts',
        'Sunvisor',
        'Toolbox Door Pocket'
    ];

    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const progressStep1 = document.getElementById('progress-step-1');
    const progressStep2 = document.getElementById('progress-step-2');
    const stepDivider = document.querySelector('.step-divider');
    const btnNextStep1 = document.getElementById('btnNextStep1');
    const btnNextStep1Text = document.getElementById('btnNextStep1Text');
    const btnPrev = document.getElementById('btnPrev');
    const form = document.getElementById('quoteForm');
    const progressBar = document.querySelector('.form-progress');

    const inputEnquiryType = document.getElementById('enquiryType');
    const accessoryListContainer = document.getElementById('accessoryList');
    const accessoryDropdownGroup = document.getElementById('accessoryDropdownGroup');
    const truckModel = document.getElementById('truckModel');
    const accessoryFreeText = document.getElementById('accessoryFreeText');
    const accessoryRecommend = document.getElementById('accessoryRecommend');
    const btnAddAccessory = document.getElementById('btnAddAccessory');

    const wheelTruckModel = document.getElementById('wheelTruckModel');
    const wheelType = document.getElementById('wheelType');
    const wheelFitment = document.getElementById('wheelFitment');
    const wheelSize = document.getElementById('wheelSize');
    const wheelFinish = document.getElementById('wheelFinish');
    const wheelFreeText = document.getElementById('wheelFreeText');
    const wheelRecommend = document.getElementById('wheelRecommend');
    const btnAddWheel = document.getElementById('btnAddWheel');

    const cartList = document.getElementById('cartList');
    const emptyCart = document.getElementById('emptyCart');
    const cartCount = document.getElementById('cartCount');
    let cartItems = [];

    if (accessoryListContainer) {
        accessoriesList.forEach((accessory) => {
            const label = document.createElement('label');
            label.className = 'checkbox-item';
            label.innerHTML = `<input type="checkbox" name="accessories" value="${accessory}"> <span>${accessory}</span>`;
            accessoryListContainer.appendChild(label);
        });
    }

    inputEnquiryType.addEventListener('change', () => {
        btnNextStep1Text.innerText = 'Continue to Products';
        btnNextStep1.querySelector('i').className = 'ri-arrow-right-line';
    });

    if (truckModel) {
        truckModel.addEventListener('change', () => {
            if (truckModel.value && accessoryDropdownGroup) {
                accessoryDropdownGroup.classList.remove('hidden');
            }
        });
    }

    const clearErrors = () => {
        document.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
        document.querySelectorAll('.error-msg').forEach((el) => el.remove());
    };

    const showError = (el, message) => {
        const field = el.closest('.input-with-icon, .select-wrapper, .form-group') || el.parentElement;
        field.classList.add('has-error');
        const existing = field.nextElementSibling;
        if (existing && existing.classList.contains('error-msg')) existing.remove();
        const err = document.createElement('span');
        err.className = 'error-msg';
        err.innerText = message;
        field.insertAdjacentElement('afterend', err);
    };

    const validateStep1 = () => {
        clearErrors();
        let isValid = true;

        ['enquiryType', 'firstName', 'lastName', 'email', 'phone'].forEach((id) => {
            const el = document.getElementById(id);
            if (!el.value.trim()) {
                isValid = false;
                showError(el, 'Required');
            }
        });

        const email = document.getElementById('email');
        if (email.value.trim() && !email.checkValidity()) {
            isValid = false;
            showError(email, 'Enter a valid email');
        }

        return isValid;
    };

    const goToStep2 = () => {
        step1.classList.remove('active');
        step2.classList.add('active');
        progressStep1.classList.add('completed');
        stepDivider.classList.add('active');
        progressStep2.classList.add('active');
        progressBar.setAttribute('aria-valuenow', '2');
    };

    const goToStep1 = () => {
        step2.classList.remove('active');
        step1.classList.add('active');
        progressStep1.classList.remove('completed');
        stepDivider.classList.remove('active');
        progressStep2.classList.remove('active');
        progressBar.setAttribute('aria-valuenow', '1');
    };

    btnNextStep1.addEventListener('click', () => {
        if (!validateStep1()) {
            const firstInvalid = document.querySelector('.has-error input, .has-error select');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        goToStep2();
    });

    if (btnPrev) btnPrev.addEventListener('click', goToStep1);

    const getSelectedAccessories = () => (
        Array.from(document.querySelectorAll('input[name="accessories"]:checked')).map((el) => el.value)
    );

    const hasWheelSelections = () => (
        wheelTruckModel.value || wheelType.value || wheelFitment.value || wheelSize.value || wheelFinish.value
    );

    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);

    const renderCart = () => {
        if (!cartList || !emptyCart || !cartCount) return;

        cartList.innerHTML = '';

        if (cartItems.length === 0) {
            emptyCart.classList.remove('hidden');
            cartList.classList.add('hidden');
            cartCount.innerText = '0 Items';
            return;
        }

        emptyCart.classList.add('hidden');
        cartList.classList.remove('hidden');
        cartCount.innerText = `${cartItems.length} Item${cartItems.length > 1 ? 's' : ''}`;

        cartItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'cart-item';

            let detailsHtml = '';
            if (item.category === 'accessories') {
                const selectedItems = item.items.map(escapeHtml).join(', ');
                detailsHtml = `
                    <strong>Truck Accessories</strong>
                    ${item.truckModel ? `<span><strong>Truck:</strong> ${escapeHtml(item.truckModel)}</span>` : ''}
                    ${item.items.length ? `<span><strong>Selected:</strong> ${selectedItems}</span>` : ''}
                    ${item.freeText ? `<span><strong>Request:</strong> ${escapeHtml(item.freeText)}</span>` : ''}
                    ${item.recommendation ? '<span><strong>Recommendation:</strong> Requested</span>' : ''}
                `;
            } else {
                detailsHtml = `
                    <strong>Armoury Wheels</strong>
                    ${item.truckModel ? `<span><strong>Truck:</strong> ${escapeHtml(item.truckModel)}</span>` : ''}
                    ${item.type ? `<span><strong>Type:</strong> ${escapeHtml(item.type)}</span>` : ''}
                    ${item.fitment ? `<span><strong>Fitment:</strong> ${escapeHtml(item.fitment)}</span>` : ''}
                    ${item.size ? `<span><strong>Size:</strong> ${escapeHtml(item.size)}</span>` : ''}
                    ${item.finish ? `<span><strong>Finish:</strong> ${escapeHtml(item.finish)}</span>` : ''}
                    ${item.freeText ? `<span><strong>Request:</strong> ${escapeHtml(item.freeText)}</span>` : ''}
                    ${item.recommendation ? '<span><strong>Recommendation:</strong> Requested</span>' : ''}
                `;
            }

            li.innerHTML = `
                <div class="cart-item-details">${detailsHtml}</div>
                <button type="button" class="btn-remove" data-index="${index}" title="Remove item" aria-label="Remove item">
                    <i class="ri-delete-bin-line" aria-hidden="true"></i>
                </button>
            `;
            cartList.appendChild(li);
        });

        document.querySelectorAll('.btn-remove').forEach((btn) => {
            btn.addEventListener('click', (event) => {
                const index = Number(event.currentTarget.getAttribute('data-index'));
                cartItems.splice(index, 1);
                renderCart();
            });
        });
    };

    if (btnAddAccessory) btnAddAccessory.addEventListener('click', () => {
        const checked = getSelectedAccessories();
        const freeText = accessoryFreeText.value.trim();
        const recommendation = accessoryRecommend.checked;

        if (!truckModel.value && checked.length === 0 && !freeText && !recommendation) {
            alert('Select an accessory, add a note, choose a truck model, or request a recommendation.');
            return;
        }

        cartItems.push({
            category: 'accessories',
            truckModel: truckModel.value,
            items: checked,
            freeText,
            recommendation
        });

        document.querySelectorAll('input[name="accessories"]:checked').forEach((el) => { el.checked = false; });
        accessoryFreeText.value = '';
        accessoryRecommend.checked = false;
        renderCart();
    });

    if (btnAddWheel) btnAddWheel.addEventListener('click', () => {
        const freeText = wheelFreeText.value.trim();
        const recommendation = wheelRecommend.checked;

        if (!hasWheelSelections() && !freeText && !recommendation) {
            alert('Select wheel details, add a note, choose a truck model, or request a recommendation.');
            return;
        }

        cartItems.push({
            category: 'wheel',
            truckModel: wheelTruckModel.value,
            type: wheelType.value,
            fitment: wheelFitment.value,
            size: wheelSize.value,
            finish: wheelFinish.value,
            freeText,
            recommendation
        });

        wheelType.value = '';
        wheelFitment.value = '';
        wheelSize.value = '';
        wheelFinish.value = '';
        wheelFreeText.value = '';
        wheelRecommend.checked = false;
        renderCart();
    });

    function submitForm() {
        const btns = document.querySelectorAll('.submit-btn, #btnNextStep1');
        btns.forEach((button) => {
            button.dataset.orig = button.innerHTML;
            button.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Processing...';
            button.disabled = true;
        });

        setTimeout(() => {
            btns.forEach((button) => {
                button.innerHTML = '<i class="ri-check-line"></i> Sent';
                button.style.backgroundColor = 'var(--clr-success)';
            });

            setTimeout(() => {
                btns.forEach((button) => {
                    button.innerHTML = button.dataset.orig;
                    button.disabled = false;
                    button.style.backgroundColor = '';
                });
                cartItems = [];
                renderCart();
                form.reset();
                accessoryDropdownGroup.classList.add('hidden');
                if (step2.classList.contains('active')) goToStep1();
            }, 2200);
        }, 900);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        submitForm();
    });
});
