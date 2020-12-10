const NoteService = {
  getAllNotes(db) {
    return db
      .select('*')
      .from('note');
  },
  insertNote(db, newNote) {
    return db
      .insert(newNote)
      .into('note')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .select('*')
      .from('note')
      .where({ id: id })
      .first();
  },
  deleteNote(db, id) {
    return db
      .from('note')
      .where({ id })
      .delete();
  },
  updateNote(db, id, newData) {
    return db
      .from('note')
      .where({ id })
      .update(newData);
  }
};
  
module.exports = NoteService;