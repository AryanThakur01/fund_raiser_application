const express = require('express');
const app = express();

app.use(express.json());

const start = async () => {
    try{
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
};

start();
