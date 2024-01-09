# FileShare
FileShare is a minimal app that helps you share files.

![FileShare](./pic/fileshare.png)

### Installation

### Requirements:

- A PostgreSQL Database with the name fileshare and a user with the ability to perform CRUD operations on it.
- .env file with the properties below
```
PORT={port_to_expose}
DB_USER={postgres_username}
DB_PASS={postgres_password}
DB=fileshare
DB_HOST={postgres_ip}
DB_PORT={postgres_port}
SECRET={mysupersecret}
UPLOAD=/uploads
LOG_FILE=/var/logs/fileshare/app.log
```
- NodeJS (v20.8.0)
> NodeJS is required for without docker installation


#### Without Docker

- ./install.sh
- npm start

#### With Docker:

- docker build -f docker/Dockerfile -t filesharev1.0 .
- docker run --name={containers_name} -d -p 8080:3000 filesharev1.0

### Uninstall Fileshare

To remove fileshare simply run:
- ./uninstall.sh

### About FileShare

FileShare was built using the following technologies:

- [Express](https://expressjs.com/)
- [express-session](https://www.npmjs.com/package/express-session)
- [Sequelize](https://sequelize.org/)
- [Multer](https://www.npmjs.com/package/multer)
- [PostgreSQL](https://www.postgresql.org/)
