const fs = require('fs');
const { decode } = require('image-data-uri');
const { convert } = require('data-uri-to-buffer');

// File path containing the URI
const filePath = 'text.txt';

// Output file path
const outputPath = 'C:/Local_Projects/ClientProject/landmarkreporter/frontend/assets/image.png';

// Read the URI from the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
console.log(data)
    const dataURI = data.trim(); // Trim any leading/trailing whitespace
    // Convert the data URI to buffer
    const imageBuffer = convert(dataURI);
    fs.writeFileSync(outputPath, imageBuffer);
    console.log('Image saved successfully at', outputPath);
});
