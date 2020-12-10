EXPRESS BOILERPLATE
Get your Express project up and running easily with this boilerplate
Set up
Complete the following steps to start a new project (NEW-PROJECT-NAME) with starter packages, folders and files:

Clone this repository to your local machine git clone https://github.com/jenna-chestnut/express-boilerplate.git NEW-PROJECTS-NAME
cd into the cloned repository
Make a fresh start of the git history for this project with rm -rf .git && git init
Install the node dependencies npm install
Move the example Environment file to .env that will be ignored by git and read by the express server mv example.env .env
Edit the contents of the package.json to use NEW-PROJECT-NAME instead of "name": "express-boilerplate",
Scripts
Start the application npm start

Start nodemon for the application npm run dev

Run the tests npm test

Run a watching test environment npm run watch

Deploying
When your new project is ready for deployment, add a new Heroku application with heroku create.
This will make a new git remote called "heroku" and you can then npm run deploy which will push to this remote's main branch.# noteful-server
