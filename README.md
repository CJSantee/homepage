# Homepage
![Deploy to Elastic Beanstalk](https://github.com/CJSantee/homepage/actions/workflows/eb-deploy.yaml/badge.svg)

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
SECURITY_KEY=anyvalue
```

### Troubleshooting
Connection to Prod DB timeout:
- Check security groups -> Inbound Rules includes Current IP Address