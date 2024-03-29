# Homepage
![Deploy to Elastic Beanstalk](https://github.com/CJSantee/homepage/actions/workflows/eb-deploy.yaml/badge.svg)

## Getting Started
### Install node_modules
```
$ npm i 
```
### Install ts-node
```
$ npm i -g ts-node
```
### Install postgresql
[Postgres.app](https://postgresapp.com/downloads.html)
Create new db within app: homepage-db

### Install node_modules for client
```
$ cd client 
$ npm i
```

## Development
### Running React Frontend
```
$ cd client
$ npm start
```

### Running NodeJS Backend*
```
$ npm run dev
```
\*Must build Frontend to view changes when being served by express: `cd client; npm run build`

### Example .env
```
NODE_ENV=development # development | production | test
DATABASE_URL=postgres://postgres:@localhost:5432/homepage-db
SECRET_KEY=anyvalue
TWILIO_ACCOUNT_SID=xxxx
TWILIO_AUTH_TOKEN=xxxx
ENCRYPTION_ROUNDS=10
```

### Troubleshooting
Connection to Prod DB timeout:
- Check security groups -> Inbound Rules includes Current IP Address

Rendering SVG:
[Using SVGR Via Create React App](https://blog.logrocket.com/how-to-use-svgs-react/#using-svg-component)
[Note from Stack Overflow](https://stackoverflow.com/questions/59820954/syntaxerror-unknown-namespace-tags-are-not-supported-by-default)

### Future Ideas
Wordle Score Analyzer
Chess.com + LiChess API integration
Site viewers / analytics
