document.addEventListener('DOMContentLoaded', () => {
    // --- STATIC DATA ---
    const accessoriesList = [
        "Air Cleaner Panels",
        "Air cleaner Shrouds",
        "Battery Box Cover",
        "Beacon Bracket",
        "Bonnet Latch Covers",
        "Bug Deflector",
        "Bunk Skirt Extensions",
        "Bunk Wings",
        "Driving Light Mount",
        "Elephant Ears",
        "Flares",
        "Headlight Surrounds",
        "Hinge Cover",
        "Kick Panel",
        "Low Mount Guard Brackets",
        "Mirror Backs & Mirror Panels",
        "Mudflap Brackets",
        "Retro Fit Old-School Steps",
        "Steps & Tank Skirts",
        "Sunvisor",
        "Toolbox Door Pocket"
    ];

    // --- DOM Elements ---
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const progressStep1 = document.getElementById('progress-step-1');
    const progressStep2 = document.getElementById('progress-step-2');
    const stepDivider = document.querySelector('.step-divider');
    const btnNextStep1 = document.getElementById('btnNextStep1');
    const btnNextStep1Text = document.getElementById('btnNextStep1Text');
    const btnPrev = document.getElementById('btnPrev');
    const form = document.getElementById('quoteForm');

    // Inputs
    const inputEnquiryType = document.getElementById('enquiryType');
    
    // Truck Accessories
    const truckModel = document.getElementById('truckModel');
    const accessoryDropdownGroup = document.getElementById('accessoryDropdownGroup');
    const accessoryListContainer = document.getElementById('accessoryList');
    const btnAddAccessory = document.getElementById('btnAddAccessory');

    // Wheels
    const wheelType = document.getElementById('wheelType');
    const wheelFitment = document.getElementById('wheelFitment');
    const wheelSize = document.getElementById('wheelSize');
    const wheelFinish = document.getElementById('wheelFinish');
    const btnAddWheel = document.getElementById('btnAddWheel');

    // Cart
    const cartList = document.getElementById('cartList');
    const emptyCart = document.getElementById('emptyCart');
    const cartCount = document.getElementById('cartCount');
    let cartItems = [];

    // --- ENQUIRY TYPE LOGIC ---
    inputEnquiryType.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'Product & Quote Requests') {
            btnNextStep1Text.innerText = 'Continue to Next Step';
            btnNextStep1.querySelector('i').className = 'ri-arrow-right-line';
        } else {
            btnNextStep1Text.innerText = 'Submit Enquiry';
            btnNextStep1.querySelector('i').className = 'ri-send-plane-fill';
        }
    });

    // Generate Checkboxes for Accessories
    accessoriesList.forEach((acc, idx) => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        label.innerHTML = `<input type="checkbox" name="accessories" value="${acc}"> <span>${acc}</span>`;
        accessoryListContainer.appendChild(label);
    });

    // Show accessories when truck model chosen
    truckModel.addEventListener('change', () => {
        if(truckModel.value) {
            accessoryDropdownGroup.classList.remove('hidden');
            btnAddAccessory.classList.remove('hidden');
        }
    });

    // --- NAVIGATION LOGIC ---
    const validateStep1 = () => {
        let isValid = true;
        ['enquiryType', 'firstName', 'lastName', 'email', 'phone'].forEach(id => {
            const el = document.getElementById(id);
            el.parentElement.classList.remove('has-error');
            const p = el.parentElement;
            if(p.nextElementSibling && p.nextElementSibling.className === 'error-msg') p.nextElementSibling.remove();

            if (!el.value.trim()) {
                isValid = false;
                el.parentElement.classList.add('has-error');
                const err = document.createElement('span');
                err.className = 'error-msg'; err.innerText = 'Required';
                el.parentElement.insertAdjacentElement('afterend', err);
            }
        });
        return isValid;
    };

    btnNextStep1.addEventListener('click', () => {
        if (validateStep1()) {
            if (inputEnquiryType.value !== 'Product & Quote Requests') {
                // Submit Form Immediately
                submitForm();
                return;
            }

            // Proceed to Step 2
            step1.classList.remove('active');
            setTimeout(() => {
                step1.style.display = 'none';
                step2.style.display = 'block';
                void step2.offsetWidth;
                step2.classList.add('active');
            }, 300);

            progressStep1.classList.add('completed');
            stepDivider.classList.add('active');
            progressStep2.classList.add('active');
        }
    });

    btnPrev.addEventListener('click', () => {
        step2.classList.remove('active');
        setTimeout(() => {
            step2.style.display = 'none';
            step1.style.display = 'block';
            void step1.offsetWidth;
            step1.classList.add('active');
        }, 300);

        progressStep1.classList.remove('completed');
        stepDivider.classList.remove('active');
        progressStep2.classList.remove('active');
    });

    // --- CART LOGIC ---
    const renderCart = () => {
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
                detailsHtml = `
                    <strong>Truck Accessories</strong>
                    <span><strong>Truck:</strong> ${item.truckModel}</span>
                    <span><strong>Items:</strong> ${item.items.join(', ')}</span>
                `;
            } else {
                detailsHtml = `
                    <strong>Armoury Wheel (${item.type})</strong>
                    <span><strong>Fitment:</strong> ${item.fitment}</span>
                    <span><strong>Size:</strong> ${item.size}</span>
                    <span><strong>Finish:</strong> ${item.finish}</span>
                `;
            }
            
            li.innerHTML = `
                <div class="cart-item-details">${detailsHtml}</div>
                <button type="button" class="btn-remove" data-index="${index}" title="Remove Item">
                    <i class="ri-delete-bin-line"></i>
                </button>
            `;
            cartList.appendChild(li);
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.closest('.btn-remove').getAttribute('data-index');
                cartItems.splice(idx, 1);
                renderCart();
            });
        });
    };

    btnAddAccessory.addEventListener('click', () => {
        const checked = Array.from(document.querySelectorAll('input[name="accessories"]:checked')).map(el => el.value);
        if (checked.length === 0) return alert('Please select at least one accessory.');
        
        cartItems.push({
            category: 'accessories',
            truckModel: truckModel.value,
            items: checked
        });

        // Reset
        document.querySelectorAll('input[name="accessories"]:checked').forEach(el => el.checked = false);
        renderCart();
    });

    btnAddWheel.addEventListener('click', () => {
        if (!wheelType.value || !wheelFitment.value || !wheelSize.value || !wheelFinish.value) {
            alert('Please complete all wheel fields before adding.');
            return;
        }
        
        cartItems.push({
            category: 'wheel',
            type: wheelType.value,
            fitment: wheelFitment.value,
            size: wheelSize.value,
            finish: wheelFinish.value
        });

        // Reset
        wheelType.value = ''; wheelFitment.value = ''; wheelSize.value = ''; wheelFinish.value = '';
        renderCart();
    });

    function submitForm() {
        const btns = document.querySelectorAll('.submit-btn, #btnNextStep1');
        btns.forEach(b => {
            const orig = b.innerHTML;
            b.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Processing...';
            b.disabled = true;
            b.dataset.orig = orig;
        });

        setTimeout(() => {
            btns.forEach(b => {
                b.innerHTML = '<i class="ri-check-line"></i> Success!';
                b.style.backgroundColor = 'var(--clr-success)';
                
                setTimeout(() => {
                    b.innerHTML = b.dataset.orig;
                    b.disabled = false;
                    b.style.backgroundColor = '';
                    cartItems = [];
                    renderCart();
                    form.reset();
                    // Go back to step 1
                    if(step2.classList.contains('active')) btnPrev.click();
                }, 3000);
            });
        }, 1500);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm();
    });
});
