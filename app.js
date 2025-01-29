const express = require('express');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const app = express();

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define the folder where the Excel files are located
const excelFolder = path.join(__dirname, 'excel_files');

// Serve static files (e.g., images)
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    // Read Excel files from the folder
    fs.readdir(excelFolder, (err, files) => {
        if (err) {
            console.error("Error reading the directory:", err);
            return res.send('Error reading the directory');
        }

        const excelFiles = files.filter(file => file.endsWith('.xlsx'));
        const fileData = [];

        // Parse each Excel file
        excelFiles.forEach(file => {
            const filePath = path.join(excelFolder, file);
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            // Extract data
            data.forEach(row => {
                fileData.push({
                    message: row.Message,
                    likes: row.Likes,
                    imageUrl: row['Image URL']
                });
            });
        });

        // Pass data to the view (we send the data as JSON for easy access)
        res.render('index', { fileData: JSON.stringify(fileData) });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
