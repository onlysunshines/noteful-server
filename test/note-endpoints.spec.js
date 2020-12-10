/* eslint-disable no-useless-escape */
const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makeNotesArray, makeMaliciousNote, makeFoldersArray } = require("./noteful.fixtures");

describe("Note endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  before("clean the table", () => {
    return db.raw('TRUNCATE folder, note RESTART IDENTITY CASCADE');
  });

  after("disconnect from db", () => db.destroy());

  afterEach("cleanup", () => {
    return db.raw('TRUNCATE folder, note RESTART IDENTITY CASCADE');
  });

  describe("GET /api/note", () => {
    context(`Given no note`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/note").expect(200, []);
      });
    });

    context("Given there are note in the database", () => {
      const testFolders = makeFoldersArray();
      const testNotes = makeNotesArray();

      beforeEach("insert folders", () => {
        return db.into("folder").insert(testFolders);
      });
        
      beforeEach("insert notes", () => {
        return db.into("note").insert(testNotes);
      });

      it("GET /api/note responds with 200 and all note", () => {
        return supertest(app).get("/api/note").expect(200, testNotes);
      });
    });

    context(`Given an XSS attack article`, () => {
      const maliciousNote = makeMaliciousNote();
      const testFolders = makeFoldersArray();

      beforeEach('insert folders', () => {
        return db
          .into('folder')
          .insert(testFolders);
      });
      
      beforeEach('insert malicious article', () => {
        return db
          .into('note')
          .insert([ maliciousNote ]);
      });
      
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/note`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].note_name).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
          });
      });
    });
  });

  describe("POST /api/note", () => {
    const testFolders = makeFoldersArray();

    beforeEach('insert folders for foreign key constraints', () => {
      return db
        .into('folder')
        .insert(testFolders);
    });

    it("creates an note, responds with 201 and the new note", function() {
      this.retries(3);

      const newNote = {
        id: 1,
        note_name: 'Testing new note post',
        folder_id: 1,
        content: 'NEW NOTE CONTENT!!'
      };

      return supertest(app)
        .post("/api/note")
        .send(newNote)
        .expect(201)
        .expect((res) => {
          expect(res.body.note_name).to.eql(newNote.note_name);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/note/${res.body.id}`);
          const expected = new Date().toLocaleString();
          const actual = new Date(res.body.modified).toLocaleString();
          expect(actual).to.eql(expected);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/note/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });

    const fields = ['note_name', 'folder_id'];
    fields.forEach(field => {

      const newNote = {
        id: 1,
        note_name: 'Testing new note post',
        folder_id: 1,
        content: 'NEW NOTE CONTENT!!'
      };

      it(`responds with 400 and an error message when ${field} field is missing`, () => {

        delete newNote[field];
        return supertest(app)
          .post('/api/note')
          .send(newNote)
          .expect(400, {
            error: {message: `Missing ${field} in request body`}
          });
      });
    });

    context(`When an XSS attack article is put in, article is sanitized right away`, () => {
      const maliciousNote = makeMaliciousNote();
      
      it('removes XSS attack content', () => {
        return supertest(app)
          .post(`/api/note`)
          .send(maliciousNote)
          .expect(201)
          .expect(res => {
            expect(res.body.note_name).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
          });
      });
    });
  });

  describe("GET /api/note/:id", () => {
    context(`Given no note`, () => {
      it(`responds with 404`, () => {
        const noteId = 123456;
        return supertest(app)
          .get(`/api/note/${noteId}`)
          .expect(404, { error: { message: `note doesn't exist` } });
      });
    });

    context("Given there are notes in the database", () => {
      const testFolders = makeFoldersArray();
      const testNotes = makeNotesArray();
  
      before("insert folders", () => {
        return db.into("folder").insert(testFolders);
      });
          
      before("insert notes", () => {
        return db.into("note").insert(testNotes);
      });

      it("GET /api/note/:id responds with 200 and the specified article", () => {
        const noteId = 3;
        const expected = testNotes[noteId - 1];
        return supertest(app)
          .get(`/api/note/${noteId}`)
          .expect(200, expected);
      });
    });

    context(`Given an XSS attack note`, () => {
      const testFolders = makeFoldersArray();

      beforeEach('insert folders for foreign key constraints', () => {
        return db
          .into('folder')
          .insert(testFolders);
      });
      
      const maliciousNote = makeMaliciousNote();
      
      beforeEach('insert malicious note', () => {
        return db
          .into('note')
          .insert([ maliciousNote ]);
      });
      
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/note/${maliciousNote.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.note_name).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
          });
      });
    });
  });

  describe(`DELETE /api/note/:note_id`, () => {
    context(`Given no note`, () => {
      it(`responds with 404`, () => {
        const noteId = 123456;
        return supertest(app)
          .delete(`/api/note/${noteId}`)
          .expect(404, { error: { message: `note doesn't exist` } });
      });
    });

    context('Given there are note in the database', () => {
      const testFolders = makeFoldersArray();
      const testNotes = makeNotesArray();
  
      beforeEach("insert folders", () => {
        return db.into("folder").insert(testFolders);
      });
          
      beforeEach("insert notes", () => {
        return db.into("note").insert(testNotes);
      });
    
      it('responds with 204 and removes the note', () => {
        const idToRemove = 2;
        const expectedNote = testNotes.filter(note => note.id !== idToRemove);
        return supertest(app)
          .delete(`/api/note/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/note`)
              .expect(expectedNote)
          );
      });
    });
  });
});