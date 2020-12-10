const faker = require('faker');

const returnSomething = () => {
  return 'Hello, app! Use endpoints api/folder and api/note for your data';
};

const makeFoldersArray = () => {
  return [
    {
      id: 1,
      folder_name: "SuperImportant"
    },
    {
      id: 2,
      folder_name: "SuperSuper"
    },
    {
      id: 3,
      folder_name: "SuperSpangley"
    }
  ];
};

const makeMaliciousFolder = () => {
  return {
    id: 1,
    folder_name: 'Naughty naughty very naughty <script>alert("xss");</script>'
  };
};

const makeNotesArray = () => {
  return [
    {
      id: 1,
      note_name: "Doggoss",
      folder_id: 2,
      modified: new Date().toISOString(),
      content: faker.lorem.paragraphs()
    },
    {
      id: 2,
      note_name: "Cattos",
      folder_id: 1,
      modified: new Date().toISOString(),
      content: faker.lorem.paragraphs()
    },
    {
      id: 3,
      note_name: "Piggos",
      folder_id: 3,
      modified: new Date().toISOString(),
      content: faker.lorem.paragraphs()
    },
    {
      id: 4,
      note_name: "Birddos",
      folder_id: 1,
      modified: new Date().toISOString(),
      content: faker.lorem.paragraphs()
    }
  ];
};

const makeMaliciousNote = () => {
  return {
    id: 1,
    note_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    folder_id: 1,
    content: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.'
  };
};

module.exports = {
  returnSomething,
  makeFoldersArray,
  makeMaliciousFolder,
  makeNotesArray,
  makeMaliciousNote
};