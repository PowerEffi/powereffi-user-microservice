# PowerEffi

PowerEffi platform user domain context microservice application.

## Architecture

The application is a microservice made with NextJs and uses authentication with JWT Token.

## Running The App

Initially it was necessary to create the application with the command:

```bash
npx create-next-app@latest "Name of the project" --ts
```
It was also necessary to install the dependencies below using the command "npm i name-of-package":

### Backend dependencies
- jsonwebtoken
- @types/jsonwebtoken (using -D parameter)
- md5
- @types/md5 (using -D parameter)
- moment
- mongoose

### Frontend dependencies
- react-bootstrap
- bootstrap@4.6.0 
- node-sass

To run the project you need to run the command in bash:

```bash
node run dev
```

The project is using NoSql database using docker compose, so you need to run the command below:

```bash
docker-compose up -d
```
