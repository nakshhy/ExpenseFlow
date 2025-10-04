# 💰 ExpenseFlow

A beautiful, feature-rich expense tracking web application with a GUI configurator for easy customization.

![ExpenseFlow Banner](https://img.shields.io/badge/version-1.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Budget Tracking**: Set monthly budgets and track spending by category
- **Analytics Dashboard**: Visualize expenses with interactive charts
- **Filtering & Search**: Filter by type, category, or search transactions
- **Import/Export**: Export data to CSV/JSON and import from backups
- **Recurring Transactions**: Mark transactions as recurring
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Local Storage**: All data stored locally in your browser

## 🚀 Quick Start

### Using the Application

1. Download `index.html` from this repository
2. Open it in any modern web browser
3. Start tracking your expenses!

### Customizing with the Configurator

The ExpenseFlow Configurator is a standalone Windows application that lets you personalize the app before using it.

**Download**: Get `expenseflow_configurator.exe` from the Releases page

**System Requirements**: Windows 7 or higher

## 🎨 Using the Configurator

1. **Launch** the `expenseflow_configurator.exe` file
2. **Load** the original `index.html` by clicking "Load HTML File"
3. **Customize** your settings:
   - **Branding**: Change app name, tagline, and footer text
   - **Colors**: Pick custom colors for primary, accent, and background
   - **Currency**: Select your preferred currency symbol ($, €, £, ¥, ₹, ₽, R$)
   - **Features**: Toggle recurring transactions, budget tracking, analytics, and import/export
4. **Generate** by clicking "Generate Custom App"
5. **Save** your customized HTML file
6. **Use** your personalized ExpenseFlow app!

## 📖 User Guide

### Adding Transactions

1. Select transaction type (Income/Expense)
2. Enter description and amount
3. Choose a category
4. Select the date
5. Add optional notes
6. Check "Recurring" if applicable
7. Click "Add Transaction"

### Setting a Budget

1. Navigate to the "Budget" tab
2. Enter your monthly budget amount
3. Click "Set Budget"
4. View your spending progress and category breakdown

### Viewing Analytics

1. Click on the "Analytics" tab
2. View expense distribution by category (doughnut chart)
3. See income vs expense trends over time (line chart)

### Exporting Data

1. Go to the "Transactions" tab
2. Click "Export CSV" or "Export JSON"
3. Choose where to save your file

### Importing Data

1. Click "Import Data"
2. Select a previously exported CSV or JSON file
3. Confirm the import

## 💾 Data Storage

ExpenseFlow uses browser's `localStorage` to store all data locally. This means:
- No server required
- Complete privacy (data never leaves your device)
- Works offline
- Data persists across browser sessions

**Important**: Clearing browser data will delete your transactions. Always keep backups using the export feature.

## 🔧 Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Charts**: Chart.js 3.9.1

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- None at the moment. Report issues [here](https://github.com/yourusername/expenseflow/issues)

## 📧 Support

If you encounter any problems or have questions:
- Open an issue on GitHub
- Email: maheshwarinakshtra9@gmail.com

---

**Built with ❤️ by Naksh**

⭐ Star this repository if you find it helpful!