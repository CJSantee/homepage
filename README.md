# Colin Santee

## Running in Development

```
bin/dev
```

## Sending emails in development

Update `config/environments/development.rb:44`

Change:

```
	config.action_mailer.delivery_method = :test
```

To:

```
	config.action_mailer.delivery_method = :smtp
```
