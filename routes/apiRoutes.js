const fs = require('fs');
const notes = require('../db/db.json');
const router = require('express').Router();

// reads notes from the db.json file and posts them on the page.
router.get('/notes', function (req, res) {
    res.json(notes);
});

// posts a new note on the page as well as the db.json file.
router.post('/notes', function (req, res) {
    const newNote = req.body;
    notes.push(newNote);

    newNote.id = req.body.title;

    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) throw err;

        let allData = JSON.parse(data);
        allData.push(newNote);

        fs.writeFile('db/db.json', JSON.stringify(allData), err => {
            if (err) throw err;
        })
    });

    res.json(newNote);
});

// deletes a specific note chosen by the user
router.delete('/notes/:id', (req, res) => {
    const findId = req.params.id;
    
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) throw err;

        const allIds = JSON.parse(data);
        console.log("Before: " + allIds);
        
        for (let i = 0; i < allIds.length; i++) {
            let thisId = allIds[i].id;
            console.log("This: " + thisId);
            
            if (thisId === findId) {
                allIds.splice(i, 1);
                console.log(i);
                break;
            }
        }

        console.log("After: " + allIds);
        
        fs.writeFile('db/db.json', JSON.stringify(allIds), err => {
            if (err) throw err;
        });

        res.json(allIds);

    });

});

module.exports = router;