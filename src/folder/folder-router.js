/* eslint-disable no-unused-vars */
const express = require("express");
const FolderService = require("./folder-service");
const xss = require('xss');
const path = require('path');

const folderRouter = express.Router();

folderRouter
  .route("/")
  .get((req, res, next) => {
    FolderService.getAllFolders(req.app.get('db'))
      .then((folder) => {
        if (folder.length !== 0) {
          folder = folder.map(folder => {
            return {
              id: folder.id,
              folder_name: xss(folder.folder_name), // sanitize folder_name
            };  
          });
        }
        return folder;
      })
      .then(folder => res.json(folder))
      .catch(next);
  })
  .post((req, res, next) => {
    const { folder_name } = req.body;

    if(!folder_name) {
      return res.status(400).json({
        error: { message: `Missing folder name in request body` }
      });
    };

    let newFolder = { 
      folder_name: xss(folder_name), 
    };

    FolderService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${folder.id}`))
          .json(folder);
      })
      .catch(next);
  });

folderRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    FolderService.getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder doesn't exist` }
          });
        };
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      id: res.folder.id,
      folder_name: xss(res.folder.folder_name), // sanitize folder_name
    });
  })
  .delete((req, res, next) => {
    FolderService.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = folderRouter;