let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        let editingId = null;
        let expenseChart = null;
        let trendChart = null;
        let monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;

        document.getElementById('date').valueAsDate = new Date();

        document.getElementById('transactionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            addTransaction();
        });

        document.getElementById('editForm').addEventListener('submit', function(e) {
            e.preventDefault();
            saveEdit();
        });

        function addTransaction() {
            const transaction = {
                id: Date.now(),
                type: document.getElementById('transactionType').value,
                description: document.getElementById('description').value,
                amount: parseFloat(document.getElementById('amount').value),
                category: document.getElementById('category').value,
                date: document.getElementById('date').value,
                notes: document.getElementById('notes').value,
                recurring: document.getElementById('recurring').checked
            };

            transactions.unshift(transaction);
            saveTransactions();
            updateDashboard();
            renderTransactions();
            resetForm();
            showNotification('Transaction added successfully!');
        }

        function saveTransactions() {
            localStorage.setItem('transactions', JSON.stringify(transactions));
        }

        function updateDashboard() {
            const income = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthlyExpense = transactions
                .filter(t => {
                    const tDate = new Date(t.date);
                    return t.type === 'expense' && 
                           tDate.getMonth() === currentMonth && 
                           tDate.getFullYear() === currentYear;
                })
                .reduce((sum, t) => sum + t.amount, 0);

            document.getElementById('totalIncome').textContent = '$' + income.toFixed(2);
            document.getElementById('totalExpense').textContent = '$' + expense.toFixed(2);
            document.getElementById('currentBalance').textContent = '$' + (income - expense).toFixed(2);
            document.getElementById('monthlyExpense').textContent = '$' + monthlyExpense.toFixed(2);

            updateBudgetDisplay();
        }

        function renderTransactions(filteredTransactions = transactions) {
            const list = document.getElementById('transactionList');
            
            if (filteredTransactions.length === 0) {
                list.innerHTML = `
                    <div class="empty-state">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path>
                        </svg>
                        <p>No transactions yet. Add your first one!</p>
                    </div>
                `;
                return;
            }

            list.innerHTML = filteredTransactions.map(t => `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-title">
                            ${t.description}
                            ${t.recurring ? '<span class="category-badge recurring-badge">Recurring</span>' : ''}
                        </div>
                        <div class="transaction-meta">
                            ${getCategoryEmoji(t.category)} ${formatCategory(t.category)} • ${formatDate(t.date)}
                        </div>
                    </div>
                    <div class="transaction-amount ${t.type}">
                        ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                    </div>
                    <div class="transaction-actions">
                        <button class="btn-icon btn-edit" onclick="editTransaction(${t.id})">✏️</button>
                        <button class="btn-icon btn-delete" onclick="deleteTransaction(${t.id})">🗑️</button>
                    </div>
                </div>
            `).join('');
        }

        function getCategoryEmoji(category) {
            const emojis = {
                food: '🍔', transport: '🚗', shopping: '🛍️', entertainment: '🎮',
                bills: '📄', health: '💊', education: '📚', salary: '💼',
                freelance: '💻', investment: '📈', other: '📦'
            };
            return emojis[category] || '📦';
        }

        function formatCategory(category) {
            const categories = {
                food: 'Food & Dining', transport: 'Transportation', shopping: 'Shopping',
                entertainment: 'Entertainment', bills: 'Bills & Utilities', health: 'Healthcare',
                education: 'Education', salary: 'Salary', freelance: 'Freelance',
                investment: 'Investment', other: 'Other'
            };
            return categories[category] || 'Other';
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        function editTransaction(id) {
            const transaction = transactions.find(t => t.id === id);
            if (!transaction) return;

            document.getElementById('editId').value = transaction.id;
            document.getElementById('editType').value = transaction.type;
            document.getElementById('editDescription').value = transaction.description;
            document.getElementById('editAmount').value = transaction.amount;
            document.getElementById('editCategory').value = transaction.category;
            document.getElementById('editDate').value = transaction.date;

            document.getElementById('editModal').classList.add('active');
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.remove('active');
        }

        function saveEdit() {
            const id = parseInt(document.getElementById('editId').value);
            const index = transactions.findIndex(t => t.id === id);
            
            if (index !== -1) {
                transactions[index] = {
                    ...transactions[index],
                    type: document.getElementById('editType').value,
                    description: document.getElementById('editDescription').value,
                    amount: parseFloat(document.getElementById('editAmount').value),
                    category: document.getElementById('editCategory').value,
                    date: document.getElementById('editDate').value
                };

                saveTransactions();
                updateDashboard();
                renderTransactions();
                closeEditModal();
                showNotification('Transaction updated successfully!');
            }
        }

        function deleteTransaction(id) {
            if (confirm('Are you sure you want to delete this transaction?')) {
                transactions = transactions.filter(t => t.id !== id);
                saveTransactions();
                updateDashboard();
                renderTransactions();
                showNotification('Transaction deleted successfully!');
            }
        }

        function filterTransactions() {
            const type = document.getElementById('filterType').value;
            const category = document.getElementById('filterCategory').value;
            const search = document.getElementById('searchTransaction').value.toLowerCase();

            let filtered = transactions;

            if (type !== 'all') {
                filtered = filtered.filter(t => t.type === type);
            }

            if (category !== 'all') {
                filtered = filtered.filter(t => t.category === category);
            }

            if (search) {
                filtered = filtered.filter(t => 
                    t.description.toLowerCase().includes(search) ||
                    t.notes.toLowerCase().includes(search)
                );
            }

            renderTransactions(filtered);
        }

        function resetForm() {
            document.getElementById('transactionForm').reset();
            document.getElementById('date').valueAsDate = new Date();
        }

        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');

            document.getElementById('transactionsTab').style.display = 'none';
            document.getElementById('analyticsTab').style.display = 'none';
            document.getElementById('budgetTab').style.display = 'none';

            if (tabName === 'transactions') {
                document.getElementById('transactionsTab').style.display = 'block';
            } else if (tabName === 'analytics') {
                document.getElementById('analyticsTab').style.display = 'block';
                renderCharts();
            } else if (tabName === 'budget') {
                document.getElementById('budgetTab').style.display = 'block';
                updateBudgetDisplay();
            }
        }

        function renderCharts() {
            const expensesByCategory = {};
            transactions.filter(t => t.type === 'expense').forEach(t => {
                expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
            });

            const ctx1 = document.getElementById('expenseChart');
            if (expenseChart) expenseChart.destroy();
            
            expenseChart = new Chart(ctx1, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(expensesByCategory).map(k => formatCategory(k)),
                    datasets: [{
                        data: Object.values(expensesByCategory),
                        backgroundColor: [
                            '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
                            '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Expenses by Category'
                        }
                    }
                }
            });

            const monthlyData = {};
            transactions.forEach(t => {
                const month = t.date.substring(0, 7);
                if (!monthlyData[month]) {
                    monthlyData[month] = { income: 0, expense: 0 };
                }
                monthlyData[month][t.type] += t.amount;
            });

            const sortedMonths = Object.keys(monthlyData).sort();
            const ctx2 = document.getElementById('trendChart');
            if (trendChart) trendChart.destroy();

            trendChart = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: sortedMonths,
                    datasets: [{
                        label: 'Income',
                        data: sortedMonths.map(m => monthlyData[m].income),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Expenses',
                        data: sortedMonths.map(m => monthlyData[m].expense),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Income vs Expenses Trend'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        function setBudget() {
            const budget = parseFloat(document.getElementById('monthlyBudget').value);
            if (budget && budget > 0) {
                monthlyBudget = budget;
                localStorage.setItem('monthlyBudget', budget);
                updateBudgetDisplay();
                showNotification('Monthly budget set successfully!');
            }
        }

        function updateBudgetDisplay() {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthlyExpense = transactions
                .filter(t => {
                    const tDate = new Date(t.date);
                    return t.type === 'expense' && 
                           tDate.getMonth() === currentMonth && 
                           tDate.getFullYear() === currentYear;
                })
                .reduce((sum, t) => sum + t.amount, 0);

            const display = document.getElementById('budgetDisplay');
            
            if (monthlyBudget === 0) {
                display.innerHTML = '<div class="empty-state"><p>Set a monthly budget to track your spending</p></div>';
                return;
            }

            const percentage = (monthlyExpense / monthlyBudget) * 100;
            const remaining = monthlyBudget - monthlyExpense;
            let progressClass = '';
            
            if (percentage >= 100) progressClass = 'danger';
            else if (percentage >= 80) progressClass = 'warning';

            display.innerHTML = `
                <div class="budget-item">
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span><strong>Monthly Budget</strong></span>
                            <span>${monthlyBudget.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9em; color: #666;">
                            <span>Spent: ${monthlyExpense.toFixed(2)}</span>
                            <span>Remaining: ${remaining.toFixed(2)}</span>
                        </div>
                        <div class="budget-progress">
                            <div class="budget-progress-bar ${progressClass}" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div style="text-align: center; margin-top: 8px; font-size: 0.9em; color: #666;">
                            ${percentage.toFixed(1)}% of budget used
                        </div>
                    </div>
                </div>
            `;

            const categoryBudgets = {};
            transactions
                .filter(t => {
                    const tDate = new Date(t.date);
                    return t.type === 'expense' && 
                           tDate.getMonth() === currentMonth && 
                           tDate.getFullYear() === currentYear;
                })
                .forEach(t => {
                    categoryBudgets[t.category] = (categoryBudgets[t.category] || 0) + t.amount;
                });

            if (Object.keys(categoryBudgets).length > 0) {
                display.innerHTML += '<div style="margin-top: 20px;"><h3 style="margin-bottom: 15px;">Spending by Category</h3></div>';
                
                Object.entries(categoryBudgets)
                    .sort((a, b) => b[1] - a[1])
                    .forEach(([category, amount]) => {
                        const catPercentage = (amount / monthlyExpense) * 100;
                        display.innerHTML += `
                            <div class="budget-item" style="margin-bottom: 10px;">
                                <div style="flex: 1;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <span>${getCategoryEmoji(category)} ${formatCategory(category)}</span>
                                        <span><strong>${amount.toFixed(2)}</strong></span>
                                    </div>
                                    <div class="budget-progress">
                                        <div class="budget-progress-bar" style="width: ${catPercentage}%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);"></div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
            }
        }

        function exportToCSV() {
            const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Notes', 'Recurring'];
            const rows = transactions.map(t => [
                t.date,
                t.type,
                t.category,
                t.description,
                t.amount,
                t.notes || '',
                t.recurring ? 'Yes' : 'No'
            ]);

            const csv = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            downloadFile(csv, 'expenses.csv', 'text/csv');
            showNotification('Exported to CSV successfully!');
        }

        function exportToJSON() {
            const data = JSON.stringify(transactions, null, 2);
            downloadFile(data, 'expenses.json', 'application/json');
            showNotification('Exported to JSON successfully!');
        }

        function downloadFile(content, filename, type) {
            const blob = new Blob([content], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        function importData() {
            document.getElementById('importFile').click();
        }

        document.getElementById('importFile').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    let importedData;
                    
                    if (file.name.endsWith('.json')) {
                        importedData = JSON.parse(event.target.result);
                    } else if (file.name.endsWith('.csv')) {
                        const lines = event.target.result.split('\n');
                        importedData = [];
                        
                        for (let i = 1; i < lines.length; i++) {
                            if (!lines[i].trim()) continue;
                            
                            const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
                            if (values && values.length >= 5) {
                                importedData.push({
                                    id: Date.now() + i,
                                    date: values[0].replace(/"/g, ''),
                                    type: values[1].replace(/"/g, ''),
                                    category: values[2].replace(/"/g, ''),
                                    description: values[3].replace(/"/g, ''),
                                    amount: parseFloat(values[4].replace(/"/g, '')),
                                    notes: values[5] ? values[5].replace(/"/g, '') : '',
                                    recurring: values[6] ? values[6].replace(/"/g, '').toLowerCase() === 'yes' : false
                                });
                            }
                        }
                    }

                    if (importedData && importedData.length > 0) {
                        if (confirm(`Import ${importedData.length} transactions? This will add to your existing data.`)) {
                            transactions = [...importedData, ...transactions];
                            saveTransactions();
                            updateDashboard();
                            renderTransactions();
                            showNotification('Data imported successfully!');
                        }
                    }
                } catch (error) {
                    alert('Error importing file. Please check the format.');
                }
                
                e.target.value = '';
            };
            
            reader.readAsText(file);
        });

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
        `;
        document.head.appendChild(style);

        updateDashboard();
        renderTransactions();
        if (monthlyBudget > 0) {
            document.getElementById('monthlyBudget').value = monthlyBudget;
        }