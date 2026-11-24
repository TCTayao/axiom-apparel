document.addEventListener("DOMContentLoaded", () => {
    const PRODUCTS = [
        {
            id: "box-tee",
            name: "Essential Box Tee",
            category: "core-wear",
            categoryLabel: "CORE COLLECTION",
            price: 899,
            tag: "BESTSELLER",
            tagClass: "",
            colors: "● ● ●",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85",
            alt: "Essential Box Tee in crisp white"
        },
        {
            id: "shell-jacket",
            name: "System Shell Jacket",
            category: "future-form",
            categoryLabel: "FUTURE FORM",
            price: 2499,
            tag: "NEW ARRIVAL",
            tagClass: "tag-new",
            colors: "● ●",
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
            alt: "System Shell Jacket in matte charcoal"
        },
        {
            id: "oversized-layer",
            name: "Oversized Layer",
            category: "core-wear",
            categoryLabel: "CORE COLLECTION",
            price: 1299,
            tag: "",
            tagClass: "",
            colors: "● ● ●",
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85",
            alt: "Oversized Layer streetwear top"
        },
        {
            id: "carry-bag",
            name: "Utility Carry Bag",
            category: "daily-objects",
            categoryLabel: "DAILY OBJECTS",
            price: 1099,
            tag: "LIMITED",
            tagClass: "",
            colors: "● ●",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
            alt: "Utility Carry Bag in dark technical fabric"
        },
        {
            id: "grid-anorak",
            name: "Grid Storm Anorak",
            category: "future-form",
            categoryLabel: "FUTURE FORM",
            price: 2799,
            tag: "NEW ARRIVAL",
            tagClass: "tag-new",
            colors: "● ●",
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85",
            alt: "Grid Storm Anorak editorial look"
        },
        {
            id: "mono-tote",
            name: "Mono Field Pouch",
            category: "daily-objects",
            categoryLabel: "DAILY OBJECTS",
            price: 749,
            tag: "",
            tagClass: "",
            colors: "● ● ●",
            image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85",
            alt: "Mono Field Pouch everyday accessory"
        }
    ];

    let bag = [];

    function formatPeso(amount) {
        return `₱${amount.toLocaleString("en-PH")}`;
    }

    function updateBagCountBadge() {
        const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);
        const badge = document.getElementById("nav-bag-count");
        if (badge) {
            badge.textContent = totalQty;
        }
    }

    function renderBag() {
        const listEl = document.getElementById("bag-items-list");
        const totalEl = document.getElementById("bag-total");
        updateBagCountBadge();

        if (!listEl || !totalEl) return;

        if (bag.length === 0) {
            listEl.innerHTML = '<p class="mb-0" style="color: var(--muted);">Your bag is currently empty. Add a piece above to calculate your total.</p>';
            totalEl.textContent = formatPeso(0);
            return;
        }

        listEl.innerHTML = bag.map((item) => `
            <div class="bag-item-row">
                <div>
                    <strong class="d-block">${item.name}</strong>
                    <span class="small" style="color: var(--muted);">${formatPeso(item.price)} each</span>
                </div>
                <div class="qty-controls">
                    <button type="button" class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity of ${item.name}">-</button>
                    <span class="px-2 fw-bold">${item.qty}</span>
                    <button type="button" class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity of ${item.name}">+</button>
                    <button type="button" class="btn-outline-axiom ms-2" data-action="remove" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join("");

        const subtotal = bag.reduce((sum, item) => sum + item.price * item.qty, 0);
        totalEl.textContent = formatPeso(subtotal);
    }

    function addToBag(productId) {
        const product = PRODUCTS.find((p) => p.id === productId);
        if (!product) return;

        const existing = bag.find((item) => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            bag.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
        }

        const confirmationEl = document.getElementById("checkout-confirmation");
        if (confirmationEl) {
            confirmationEl.classList.add("d-none");
        }

        renderBag();
    }

    // Catalog Page Logic
    const catalogGrid = document.getElementById("catalog-grid");
    if (catalogGrid) {
        const searchInput = document.getElementById("catalog-search");
        const filterButtons = document.querySelectorAll(".filter-btn");
        const noResultsMsg = document.getElementById("no-results-msg");

        const urlParams = new URLSearchParams(window.location.search);
        let activeCategory = urlParams.get("category") || "all";

        filterButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.category === activeCategory);
        });

        function renderCatalog() {
            const query = (searchInput ? searchInput.value : "").trim().toLowerCase();

            const filtered = PRODUCTS.filter((product) => {
                const matchesCategory = activeCategory === "all" || product.category === activeCategory;
                const matchesQuery =
                    product.name.toLowerCase().includes(query) ||
                    product.categoryLabel.toLowerCase().includes(query);
                return matchesCategory && matchesQuery;
            });

            catalogGrid.innerHTML = filtered.map((product) => `
                <div class="col-6 col-lg-4">
                    <article class="product-card">
                        <div class="product-image">
                            ${product.tag ? `<span class="product-tag ${product.tagClass}">${product.tag}</span>` : ""}
                            <img src="${product.image}" alt="${product.alt}" loading="lazy">
                            <button type="button" class="quick-view add-to-bag-btn" data-id="${product.id}">Add to Bag +</button>
                        </div>
                        <div class="product-info">
                            <p class="product-type">${product.categoryLabel}</p>
                            <h3>${product.name}</h3>
                            <div class="product-bottom">
                                <span>${formatPeso(product.price)}</span>
                                <span class="product-color" aria-label="Color variants">${product.colors}</span>
                            </div>
                        </div>
                    </article>
                </div>
            `).join("");

            if (noResultsMsg) {
                noResultsMsg.classList.toggle("d-none", filtered.length > 0);
            }
        }

        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                activeCategory = btn.dataset.category;
                filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
                renderCatalog();
            });
        });

        if (searchInput) {
            searchInput.addEventListener("input", renderCatalog);
        }

        catalogGrid.addEventListener("click", (e) => {
            const btn = e.target.closest(".add-to-bag-btn");
            if (btn) {
                addToBag(btn.dataset.id);
            }
        });

        const bagListEl = document.getElementById("bag-items-list");
        if (bagListEl) {
            bagListEl.addEventListener("click", (e) => {
                const btn = e.target.closest("button[data-action]");
                if (!btn) return;

                const { action, id } = btn.dataset;
                const target = bag.find((item) => item.id === id);
                if (!target) return;

                if (action === "inc") target.qty += 1;
                if (action === "dec") {
                    target.qty -= 1;
                    if (target.qty <= 0) bag = bag.filter((item) => item.id !== id);
                }
                if (action === "remove") {
                    bag = bag.filter((item) => item.id !== id);
                }
                renderBag();
            });
        }

        const clearBagBtn = document.getElementById("clear-bag-btn");
        if (clearBagBtn) {
            clearBagBtn.addEventListener("click", () => {
                bag = [];
                const confirmationEl = document.getElementById("checkout-confirmation");
                if (confirmationEl) confirmationEl.classList.add("d-none");
                renderBag();
            });
        }

        const checkoutBtn = document.getElementById("simulate-checkout-btn");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", () => {
                const confirmationEl = document.getElementById("checkout-confirmation");
                if (!confirmationEl) return;

                if (bag.length === 0) {
                    confirmationEl.textContent = "Please add at least one piece to your bag before running a simulated checkout.";
                    confirmationEl.classList.remove("d-none");
                    return;
                }

                const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);
                const subtotal = bag.reduce((sum, item) => sum + item.price * item.qty, 0);
                confirmationEl.textContent = `Simulated Order Ready: ${totalQty} item(s) totaling ${formatPeso(subtotal)}. No payment was processed in this prototype.`;
                confirmationEl.classList.remove("d-none");
            });
        }

        renderCatalog();
        renderBag();
    }

    // Contact Form Validation Logic
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        const nameInput = document.getElementById("full-name");
        const emailInput = document.getElementById("email-address");
        const topicInput = document.getElementById("inquiry-topic");
        const messageInput = document.getElementById("message-body");

        const nameError = document.getElementById("full-name-error");
        const emailError = document.getElementById("email-address-error");
        const messageError = document.getElementById("message-body-error");
        const confirmationBox = document.getElementById("form-confirmation");

        function setFieldError(inputEl, errorEl, message) {
            if (message) {
                inputEl.classList.add("is-invalid-field");
                errorEl.textContent = message;
                return false;
            }
            inputEl.classList.remove("is-invalid-field");
            errorEl.textContent = "";
            return true;
        }

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameValue = nameInput.value.trim();
            const emailValue = emailInput.value.trim();
            const messageValue = messageInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const isNameValid = setFieldError(
                nameInput,
                nameError,
                nameValue.length < 2 ? "Please enter your full name (at least 2 characters)." : ""
            );

            const isEmailValid = setFieldError(
                emailInput,
                emailError,
                !emailValue
                    ? "Email address is required."
                    : !emailPattern.test(emailValue)
                        ? "Please enter a valid email address (e.g., name@domain.com)."
                        : ""
            );

            const isMessageValid = setFieldError(
                messageInput,
                messageError,
                messageValue.length < 10 ? "Please enter a message of at least 10 characters." : ""
            );

            if (!isNameValid || !isEmailValid || !isMessageValid) {
                confirmationBox.classList.add("d-none");
                return;
            }

            confirmationBox.textContent = `Simulated Confirmation: Thank you, ${nameValue}. Your "${topicInput.value}" message has been logged for prototype review.`;
            confirmationBox.classList.remove("d-none");
            contactForm.reset();
        });
    }
});