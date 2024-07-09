const express = require('express');
const app = express();

app.use(express.json());

port = process.env.PORT || 5000;

const start = async () => {
    try{
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch(err){
        console.log(err);
    }
};

start();
