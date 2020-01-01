import express from 'express';

const app = express();

app.use('/', express.static('test'));
app.use('/', express.static('src'));
app.get('/', (req, res) => res.redirect('test.html'));
app.listen(3000, () => console.log(`Test server listening on port 3000!`));