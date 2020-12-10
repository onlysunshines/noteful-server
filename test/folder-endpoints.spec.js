/* eslint-disable no-useless-escape */
const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makeFoldersArray, makeMaliciousFolder } = require("./noteful.fixtures");

describe("Folder endpoints", () => {
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

  describe("GET /api/folder", () => {
    context(`Given no folder`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/folder").expect(200, []);
      });
    });

    context("Given there are folder in the database", () => {
      const testFolders = makeFoldersArray();

      beforeEach("insert folder", () => {
        return db.into("folder").insert(testFolders);
      });

      it("GET /api/folder responds with 200 and all folder", () => {
        return supertest(app).get("/api/folder").expect(200, testFolders);
      });
    });

    context(`Given an XSS attack article`, () => {
      const maliciousFolder = makeMaliciousFolder();
      
      beforeEach('insert malicious article', () => {
        return db
          .into('folder')
          .insert([ maliciousFolder ]);
      });
      
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/folder`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].folder_name).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
          });
      });
    });
  });

  describe("POST /api/folder", () => {
    it("creates an folder, responds with 201 and the new folder", function() {
      this.retries(3);
      const newFolder = {
        folder_name: "Listicle",
      };
      return supertest(app)
        .post("/api/folder")
        .send(newFolder)
        .expect(201)
        .expect((res) => {
          expect(res.body.folder_name).to.eql(newFolder.folder_name);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/folder/${res.body.id}`);
        //   const expected = new Date().toLocaleDateString();
        //   const actual = new Date(res.body.date_published).toLocaleDateString();
        //   expect(actual).to.eql(expected);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/folder/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });

    it(`responds with 400 and an error message when folder_name field is missing`, () => {
      const newFolder = {};
      return supertest(app)
        .post('/api/folder')
        .send(newFolder)
        .expect(400, {
          error: {message: `Missing folder name in request body`}
        });
    });
  });

  context(`When an XSS attack article is put in, article is sanitized right away`, () => {
    const maliciousFolder = makeMaliciousFolder();
      
    it('removes XSS attack content', () => {
      return supertest(app)
        .post(`/api/folder`)
        .send(maliciousFolder)
        .expect(201)
        .expect(res => {
          expect(res.body.folder_name).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
        });
    });
  });

  describe("GET /api/folder/:id", () => {
    context(`Given no folder`, () => {
      it(`responds with 404`, () => {
        const folderId = 123456;
        return supertest(app)
          .get(`/api/folder/${folderId}`)
          .expect(404, { error: { message: `Folder doesn't exist` } });
      });
    });

    context("Given there are folder in the database", () => {
      const testFolders = makeFoldersArray();

      beforeEach("insert folder", () => {
        return db.into("folder").insert(testFolders);
      });

      it("GET /api/folder/:id responds with 200 and the specified article", () => {
        const folderId = 3;
        const expected = testFolders[folderId - 1];
        return supertest(app)
          .get(`/api/folder/${folderId}`)
          .expect(200, expected);
      });
    });

    context(`Given an XSS attack folder`, () => {
      const maliciousFolder = makeMaliciousFolder();
      
      beforeEach('insert malicious folder', () => {
        return db
          .into('folder')
          .insert([ maliciousFolder ]);
      });
      
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/folder/${maliciousFolder.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.folder_name).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;');
          });
      });
    });
  });

  describe(`DELETE /api/folder/:folder_id`, () => {
    context(`Given no folder`, () => {
      it(`responds with 404`, () => {
        const folderId = 123456;
        return supertest(app)
          .delete(`/api/folder/${folderId}`)
          .expect(404, { error: { message: `Folder doesn't exist` } });
      });
    });

    context('Given there are folder in the database', () => {
      const testFolders = makeFoldersArray();
    
      beforeEach('insert folder', () => {
        return db
          .into('folder')
          .insert(testFolders);
      });
    
      it('responds with 204 and removes the folder', () => {
        const idToRemove = 2;
        const expectedFolder = testFolders.filter(folder => folder.id !== idToRemove);
        return supertest(app)
          .delete(`/api/folder/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/folder`)
              .expect(expectedFolder)
          );
      });
    });
  });
});