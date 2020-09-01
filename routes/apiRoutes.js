const fs = require('fs');
const notes = require('../db/db.json');
const router = require('express').Router();
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// reads notes from the db.json file and posts them on the page.
router.get('/notes', function (req, res) {
    readFileAsync("./db/db.json", "utf-8")
        .then(data => {
            res.json(JSON.parse(data));
        })
        .catch(err => {
            throw err;
        })
});

// posts a new note on the page as well as the db.json file.
router.post('/notes', function (req, res) {
    const newNote = req.body;
    notes.push(newNote);

    newNote.id = req.body.title;

    readFileAsync('db/db.json', 'utf8')
        .then(function(data) {
            let allData = JSON.parse(data);
            allData.push(newNote);
            
            writeFileAsync('db/db.json', JSON.stringify(allData)); 
        }).catch(err => {
            throw err;
        })

    res.json(newNote);
});

// deletes a specific note chosen by the user
router.delete('/notes/:id', (req, res) => {
    const findId = req.params.id;
    
    readFileAsync('db/db.json', 'utf8')
        .then(function(data) {
            const allIds = JSON.parse(data);
            
            for (let i = 0; i < allIds.length; i++) {
                let thisId = allIds[i].id;
                
                if (thisId === findId) {
                    allIds.splice(i, 1);
                    break;
                }
            }
            
            writeFileAsync('db/db.json', JSON.stringify(allIds));
            res.json(allIds);

        }).catch(err => {
            throw err;
        })
});

module.exports = router;