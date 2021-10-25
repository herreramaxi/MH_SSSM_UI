const express = require('express')
const app = express()
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 3000);