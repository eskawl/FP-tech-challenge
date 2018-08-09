require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const Design = require('./models/design');
const bodyParser = require('body-parser');

const upload = multer({
    dest: path.resolve('web/static/uploads/'),
})
const staticFolder = path.resolve(__dirname, '../web/static');

const app = express();

// region Middleware setup
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(staticFolder));
// endregion

app.get('/ping', (req, res)=>{
    res.send('pong')
    res.end();
})

// region API setup

// TODO: extract to router
app.post('/api/image', upload.single('print'), (req, res, next)=>{
    if(!req.file){
        res.json({
            success: false,
            error: 'No file specified'
        })
    }
    res.json({
        success: true,
        outcome: path.relative(staticFolder, req.file.path)
    })
})

app.get('/api/design', (req, res) => {
    Design.fetchAll()
    .then(result=>{
        res.json({
            success: true,
            outcome: result.toJSON(),
        })
    })
    .catch(error=>{
        res.status(500).json({
            success: false,
        })
    })
})

app.post('/api/design', bodyParser.json(), (req, res)=>{
    new Design({name: Date.now(), value: JSON.stringify(req.body.design)})
    .save()
    .then(design=>{
        res.json({
            success: true,
            outcome: design.toJSON(),
        })
    })
    .catch(error=>{
        console.log(error);

        res.status(500).json({
            success: false,
        })
    })
})
// endregion

app.listen(process.env.PORT, (error)=>{
    if(error){
        console.log(error);
        connection.end();
    } else {
        console.log('Started');
    }
})
