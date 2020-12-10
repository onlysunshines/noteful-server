const express = require("express");
const NoteService = require("./note-service");
const xss = require('xss');
const path = require('path');

const noteRouter = express.Router();

noteRouter
  .route("/")
  .get((req, res, next) => {
    NoteService.getAllNotes(req.app.get('db'))
      .then((notes) => {
        if (notes.length !== 0) {
          notes = notes.map(note => {
            return {
              id: note.id,
              note_name: xss(note.note_name), // sanitize note_name
              folder_id: note.folder_id,
              content: xss(note.content), // sanitize content
              modified: note.modified,
            };  
          });
        }
        return notes;
      })
      .then(notes => res.status(200).json(notes))
      .catch(next);
  })
  .post((req, res, next) => {
    const { note_name, folder_id, content } = req.body;
    let newNote = { 
      note_name, folder_id  
    };

    for (const [key, value] of Object.entries(newNote)) {
      if(value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }

    newNote = { 
      note_name: xss(note_name),
      folder_id,
      content: xss(content)  
    };

    NoteService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${note.id}`))
          .json(note);
      })
      .catch(next);
  });

noteRouter
  .route('/:note_id')
  .all((req, res, next) => {
    NoteService.getById(
      req.app.get('db'),
      req.params.note_id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `note doesn't exist` }
          });
        };
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      id: res.note.id,
      note_name: xss(res.note.note_name), // sanitize note_name
      folder_id: res.note.folder_id,
      content: xss(res.note.content), // sanitize content
      modified: res.note.modified,
    });
  })
  .delete((req, res, next) => {
    NoteService.deleteNote(
      req.app.get('db'),
      req.params.note_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = noteRouter;