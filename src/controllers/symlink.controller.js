const fs = require('fs')
const path = require('path')
const mime = require('mime-types')

const SymlinkController = {
    getFile: async (req, res) => {
        try {
            const filename = req.params.filename
            const filePath = path.join(__dirname, `../../public/uploads/izin/${filename}`)

            fs.exists(filePath, (exists) => {
                if (exists) {
                    fs.readFile(filePath, (err, file) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error reading the file' });
                        }
                        const mimeType = mime.contentType(path.extname(filePath));
                        res.writeHead(200, { 'Content-Type': mimeType });
                        res.end(file);
                    });
                } else {
                    res.status(404).json({ error: 'File not found' });
                }
            });
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    getPhoto: async (req, res) => {
        try {
            const filename = req.params.filename
            const filePath = path.join(__dirname, `../../public/uploads/presensi/${filename}`)

            fs.exists(filePath, (exists) => {
                if (exists) {
                    fs.readFile(filePath, (err, file) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error reading the photo' });
                        }
                        const mimeType = mime.contentType(path.extname(filePath));
                        res.writeHead(200, { 'Content-Type': mimeType });
                        res.end(file);
                    });
                } else {
                    res.status(404).json({ error: 'Photo not found' });
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = SymlinkController