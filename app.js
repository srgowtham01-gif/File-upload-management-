
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');

// Create uploads folder if not exists
const uploadFolder = './uploads';
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Serve static files (optional)
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
    fs.readdir(uploadFolder, (err, files) => {
        if (err) return res.send('Unable to scan files');
        res.render('index', { files });
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/');
});

app.get('/download/:filename', (req, res) => {
    const file = path.join(uploadFolder, req.params.filename);
    res.download(file);
});

app.get('/delete/:filename', (req, res) => {
    const file = path.join(uploadFolder, req.params.filename);
    fs.unlink(file, err => {
        if (err) return res.send('File not found');
        res.redirect('/');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
