const FolderService = {
  getAllFolders(db) {
    return db
      .select('*')
      .from('folder');
  },
  insertFolder(db, newFolder) {
    return db
      .insert(newFolder)
      .into('folder')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .select('*')
      .from('folder')
      .where({ id: id })
      .first();
  },
  deleteFolder(db, id) {
    return db
      .from('folder')
      .where({ id })
      .delete();
  },
  updateFolder(db, id, newData) {
    return db
      .from('folder')
      .where({ id })
      .update(newData);
  }
};
  
module.exports = FolderService;