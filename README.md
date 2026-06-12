# Work organizer App
A cross-platform desktop app built with electron (as the backend) and React TypeScript for the frontend and a postgresql database, for managing work, projects and tasks
fully offline.

## To get the Project working on your machine:

### Clone the repo and cd to the project with:
```bash
$ git clone https://github.com/chems-eddine24/electron-desktop-app
$ cd electron-desktop-app
```
### install packages with:
```bash
$ npm i
```
### Open up your terminal and run:
```bash
$ sudo -u postgres psql
```
### and then run:
```postgresql
create database DB_NAME
```
### add a .env file and add :
```.dotenv
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/DB_NAME
```
### make sure you are in the electron-desktop-app folder and run:
```bash
$ npx drizzle-kit push
```
### start the project with:
```bash
$ npm run dev
```
#### the main server is running at 5173 port so make sure nothing uses this port already, if yes you can either change the port or kill whatever is using the 5173 port with:
```bash
$ sudo kill -9 $(sudo lsof -t -i :5173)
```