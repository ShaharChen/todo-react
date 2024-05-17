const { getListConfig, getUpdateListConfig, signInConfig } = require('./Configs.js');

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
const port = 8000;


//Router config region
app.use(cors({
    origin: '*',
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    if (!username || password) {
        res.status(404).json('Bad request- missing required parameters');
    }
    try {
        const response = await axios(signInConfig(username));
        if (!response.data.document) {
            res.status(403).json({ message: 'user is unauthorized' });
            return;
        }
        res.status(200).json({ message: 'user is authorized' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `failure: ${error}` });
    }
});

app.put('/list', async (req, res) => {
    try {
        const { username, choreList } = req.body;
        if (!username || !choreList) {
            res.status(400).json('Bad request- missing required parameters');
        }
        await axios(getUpdateListConfig(username, choreList));
        res.json({ message: 'List updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `failure updating list: ${error}` });
    }
});

app.get('/list', async (req, res) => {
    const { username } = req.query;
    try {
        const response = await axios(getListConfig(username))
        if (!response.data.document) {
            res.status(200).json([]);
            return;
        }
        res.status(200).json(response.data.document.chores);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: `failure: ${error}` });
        return;
    }
});

