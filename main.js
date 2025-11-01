// Data
        const products = [
            { id: 1, name: 'Espresso', price: 15000, category: 'Kopi', icon: '☕' },
            { id: 2, name: 'Cappuccino', price: 25000, category: 'Kopi', icon: '☕' },
            { id: 3, name: 'Latte', price: 28000, category: 'Kopi', icon: '☕' },
            { id: 4, name: 'Americano', price: 20000, category: 'Kopi', icon: '☕' },
            { id: 5, name: 'Mocha', price: 30000, category: 'Kopi', icon: '☕' },
            { id: 6, name: 'Green Tea Latte', price: 25000, category: 'Non-Kopi', icon: '🍵' },
            { id: 7, name: 'Chocolate', price: 22000, category: 'Non-Kopi', icon: '🍫' },
            { id: 8, name: 'Lemon Tea', price: 18000, category: 'Non-Kopi', icon: '🍋' },
            { id: 9, name: 'Croissant', price: 20000, category: 'Makanan', icon: '🥐' },
            { id: 10, name: 'Sandwich', price: 35000, category: 'Makanan', icon: '🥪' },
            { id: 11, name: 'Pasta', price: 40000, category: 'Makanan', icon: '🍝' },
            { id: 12, name: 'French Fries', price: 18000, category: 'Snack', icon: '🍟' },
            { id: 13, name: 'Cookies', price: 12000, category: 'Snack', icon: '🍪' },
        ];

        const categories = ['Semua', 'Kopi', 'Non-Kopi', 'Makanan', 'Snack'];
        let cart = [];
        let selectedCategory = 'Semua';
        let selectedPaymentMethod = '';

        // Initialize
        function init() {
            renderCategories();
            renderProducts();
            updateDateTime();
            setInterval(updateDateTime, 1000);
        }

        function updateDateTime() {
            const now = new Date();
            document.getElementById('datetime').textContent = now.toLocaleString('id-ID');
        }

        function renderCategories() {
            const container = document.getElementById('categories');
            container.innerHTML = categories.map(cat => `
                <button class="category-btn ${cat === selectedCategory ? 'active' : ''}" 
                        onclick="selectCategory('${cat}')">
                    ${cat}
                </button>
            `).join('');
        }

        function selectCategory(category) {
            selectedCategory = category;
            renderCategories();
            renderProducts();
        }

        function renderProducts() {
            const container = document.getElementById('productsGrid');
            const filtered = selectedCategory === 'Semua' 
                ? products 
                : products.filter(p => p.category === selectedCategory);
            
            container.innerHTML = filtered.map(product => `
                <div class="product-card" onclick="addToCart(${product.id})">
                    <div class="product-icon">${product.icon}</div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                </div>
            `).join('');
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1, notes: '' });
            }
            
            renderCart();
        }

        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    renderCart();
                }
            }
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            renderCart();
        }

        function updateNotes(productId, notes) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.notes = notes;
            }
        }

        function renderCart() {
            const container = document.getElementById('cartItems');
            const countElement = document.getElementById('cartCount');
            const summaryElement = document.getElementById('cartSummary');
            
            countElement.textContent = cart.length;
            
            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="cart-empty">
                        <div class="cart-empty-icon">🛒</div>
                        <p>Keranjang kosong</p>
                    </div>
                `;
                summaryElement.style.display = 'none';
                return;
            }
            
            container.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>${formatCurrency(item.price)}</p>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
                    </div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <span class="item-total">${formatCurrency(item.price * item.quantity)}</span>
                    </div>
                    <input type="text" class="notes-input" placeholder="Catatan khusus..." 
                           value="${item.notes}" 
                           onchange="updateNotes(${item.id}, this.value)">
                </div>
            `).join('');
            
            updateSummary();
            summaryElement.style.display = 'block';
        }

        function updateSummary() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;
            
            document.getElementById('subtotal').textContent = formatCurrency(subtotal);
            document.getElementById('tax').textContent = formatCurrency(tax);
            document.getElementById('total').textContent = formatCurrency(total);
        }

        function showPayment() {
            if (cart.length === 0) {
                alert('Keranjang masih kosong!');
                return;
            }
            
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;
            
            document.getElementById('paymentSubtotal').textContent = formatCurrency(subtotal);
            document.getElementById('paymentTax').textContent = formatCurrency(tax);
            document.getElementById('paymentTotal').textContent = formatCurrency(total);
            
            renderPaymentMethods();
            selectedPaymentMethod = '';
            document.getElementById('cashReceived').value = '';
            document.getElementById('cashInputGroup').style.display = 'none';
            document.getElementById('changeDisplay').style.display = 'none';
            
            document.getElementById('paymentModal').classList.add('show');
        }

        function closePayment() {
            document.getElementById('paymentModal').classList.remove('show');
        }

        function renderPaymentMethods() {
            const methods = ['Tunai', 'Debit', 'QRIS', 'E-Wallet'];
            const container = document.getElementById('paymentMethods');
            
            container.innerHTML = methods.map(method => `
                <button class="payment-method-btn ${method === selectedPaymentMethod ? 'selected' : ''}" 
                        onclick="selectPaymentMethod('${method}')">
                    ${method}
                </button>
            `).join('');
        }

        function selectPaymentMethod(method) {
            selectedPaymentMethod = method;
            renderPaymentMethods();
            
            if (method === 'Tunai') {
                document.getElementById('cashInputGroup').style.display = 'block';
            } else {
                document.getElementById('cashInputGroup').style.display = 'none';
                document.getElementById('changeDisplay').style.display = 'none';
            }
        }

        function calculateChange() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const total = subtotal + (subtotal * 0.1);
            const cash = parseFloat(document.getElementById('cashReceived').value) || 0;
            
            if (cash >= total) {
                const change = cash - total;
                document.getElementById('changeAmount').textContent = formatCurrency(change);
                document.getElementById('changeDisplay').style.display = 'flex';
            } else {
                document.getElementById('changeDisplay').style.display = 'none';
            }
        }

        function processPayment() {
            if (!selectedPaymentMethod) {
                alert('Pilih metode pembayaran terlebih dahulu!');
                return;
            }
            
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;
            
            if (selectedPaymentMethod === 'Tunai') {
                const cash = parseFloat(document.getElementById('cashReceived').value) || 0;
                if (cash < total) {
                    alert('Jumlah uang tidak mencukupi!');
                    return;
                }
            }
            
            showReceipt();
        }

        function showReceipt() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;
            const cash = selectedPaymentMethod === 'Tunai' ? parseFloat(document.getElementById('cashReceived').value) : total;
            const change = selectedPaymentMethod === 'Tunai' ? cash - total : 0;
            const transactionId = 'TRX' + Date.now();
            const customerName = document.getElementById('customerName').value || 'Umum';
            const tableNumber = document.getElementById('tableNumber').value || '-';
            
            const receiptHTML = `
                <div class="receipt-header">
                    <div class="logo">☕</div>
                    <h1>Cafe Uncle Jo</h1>
                    <p>Jl. Contoh No. 123, Jakarta</p>
                    <p>Telp: 021-12345678</p>
                </div>
                
                <div class="receipt-info">
                    <div class="receipt-info-row">
                        <span style="color: #6b7280;">No. Transaksi:</span>
                        <span style="font-weight: 600;">${transactionId}</span>
                    </div>
                    <div class="receipt-info-row">
                        <span style="color: #6b7280;">Tanggal:</span>
                        <span>${new Date().toLocaleString('id-ID')}</span>
                    </div>
                    <div class="receipt-info-row">
                        <span style="color: #6b7280;">Pelanggan:</span>
                        <span>${customerName}</span>
                    </div>
                    <div class="receipt-info-row">
                        <span style="color: #6b7280;">No. Meja:</span>
                        <span>${tableNumber}</span>
                    </div>
                </div>
                
                <div class="receipt-items">
                    <h3 style="font-weight: 600; margin-bottom: 10px; color: #374151;">Detail Pesanan:</h3>
                    ${cart.map(item => `
                        <div class="receipt-item">
                            <div class="receipt-item-header">
                                <span>${item.name} x${item.quantity}</span>
                                <span style="font-weight: 600;">${formatCurrency(item.price * item.quantity)}</span>
                            </div>
                            ${item.notes ? `<div class="receipt-item-note">Note: ${item.notes}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div class="receipt-summary">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>${formatCurrency(subtotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Pajak (10%):</span>
                        <span>${formatCurrency(tax)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span class="amount">${formatCurrency(total)}</span>
                    </div>
                </div>
                
                <div class="receipt-payment">
                    <div class="summary-row">
                        <span>Metode Pembayaran:</span>
                        <span style="font-weight: 600;">${selectedPaymentMethod}</span>
                    </div>
                    ${selectedPaymentMethod === 'Tunai' ? `
                        <div class="summary-row">
                            <span>Tunai:</span>
                            <span>${formatCurrency(cash)}</span>
                        </div>
                        <div class="summary-row" style="font-weight: 600;">
                            <span>Kembalian:</span>
                            <span>${formatCurrency(change)}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="receipt-footer">
                    <p>Terima kasih atas kunjungan Anda!</p>
                    <p>Sampai jumpa lagi 😊</p>
                </div>
                
                <button class="checkout-btn" onclick="resetTransaction()">Transaksi Baru</button>
            `;
            
            document.getElementById('receipt').innerHTML = receiptHTML;
            document.getElementById('paymentModal').classList.remove('show');
            document.getElementById('receiptModal').classList.add('show');
        }

        function resetTransaction() {
            cart = [];
            selectedPaymentMethod = '';
            document.getElementById('customerName').value = '';
            document.getElementById('tableNumber').value = '';
            document.getElementById('cashReceived').value = '';
            document.getElementById('receiptModal').classList.remove('show');
            renderCart();
        }

        function formatCurrency(amount) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(amount);
        }

        // Initialize app
        init();
