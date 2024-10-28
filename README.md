# **Book Review Website** 💻

## ⭐️ Overview

This project uses frontend and backend logic to compile a media review application for books.

It uses:

```text
🔹 NodeJS and Express frameworks
🔹 EJS for templating
🔹 MongoDB for the database storage
🔹 Filepond to help store and input pictures
```

## ⚙️ Prerequisites

In order to run this application you will need to have the following:

```text
🔸 MongoDB account
🔸 NodeJS installed 
🔸 VS code installed
```

## 🐾 Step One

Change your directory to where you wish to run this script and store the cloned repository:

```bash
cd <filename>
```

## 🐾 Step Two

Clone the repository from github and then move into the new directory.

```bash
git clone https://github.com/laurawarren88/media_review_app.git
cd media_review_app
```

## 🐾 Step Three

Take a look 👀 around the file 📂 structure and see what is happening with VS code.

```bash
code .
```

You will need to add a .env 🤫 file into the file tree to store the necessary information to run the script.

I'll walk you through it:

```bash
touch .env
vim .env
```

In the file you need to include your information ℹ️ into the following variables:

```text
DATABASE_URL=
NODE_ENV=development
SECRET=
```

After the '=' sign for DATABASE_URL input the connection for your MongoDB, it will look something like this: mongodb+srv://<username>:<password>@cluster0.ib6l0.mongodb.net/<cluster_name>?retryWrites=true&w=majority&appName=Cluster0

For the secret variable input anything you like.

## 🐾 Step Four

Install the packages from package.json

```bash
npm start
```

## 🐾 Step Five

Once you have the packages installed, set up your enviroment variables and are connected to your MongoDB you can run the application.

```bash
nodemon run start
```

This should then allow you to run the application in your web browser in the following location: http://localhost:3000.

From here you can set up a user and register and account and sign in.

Once you are signed in you can add reviews to books.

If you need to add books you will need to set up an Admin account in your MongoDB and set the user to isAdmin: true this will enable that user to add, edit and delte books.
