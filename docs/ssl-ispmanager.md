# SSL renewal in ISPmanager

This site is deployed from Git, but SSL certificates are managed by the hosting panel. A `git pull` updates site files only. It does not renew the certificate and does not reload nginx by itself.

## What was added to the repository

- `.htaccess` skips redirects for `/.well-known/acme-challenge/`.
- `.well-known/acme-challenge/.gitkeep` keeps the challenge directory in Git.

This helps ISPmanager or Let's Encrypt place and verify temporary challenge files during certificate issue or renewal.

## Renew the certificate in ISPmanager

1. Open ISPmanager.
2. Go to `WWW-domains`.
3. Open `mathematika20.ru`.
4. Check that SSL is enabled.
5. Select a Let's Encrypt or free SSL certificate.
6. Include both domain names:
   - `mathematika20.ru`
   - `www.mathematika20.ru`
7. Enable automatic renewal if the option is available.
8. Save and apply changes.

## If the renewed certificate is not visible

Restart or reload the web server from ISPmanager:

- `Restart nginx`
- `Restart Apache`
- `Apply configuration`

The exact button name depends on the ISPmanager version and hosting permissions.

If the panel does not expose restart actions, contact REG.RU support with this text:

```text
Здравствуйте. Для домена mathematika20.ru продлен или перевыпущен SSL-сертификат, но сервер продолжает отдавать старый сертификат. Просьба применить web-конфигурацию и перезагрузить nginx/Apache для доменов mathematika20.ru и www.mathematika20.ru.
```

## Verification commands

Run from any terminal:

```bash
openssl s_client -connect mathematika20.ru:443 -servername mathematika20.ru </dev/null 2>/dev/null | openssl x509 -noout -dates -issuer -subject
openssl s_client -connect www.mathematika20.ru:443 -servername www.mathematika20.ru </dev/null 2>/dev/null | openssl x509 -noout -dates -issuer -subject
curl -I https://mathematika20.ru/
curl -I https://www.mathematika20.ru/
curl -I https://mathematika20.ru/.well-known/acme-challenge/test
```

Expected result:

- `notAfter` must be in the future.
- `https://mathematika20.ru/` must return `200`.
- `https://www.mathematika20.ru/` must redirect to `https://mathematika20.ru/`.
- `/.well-known/acme-challenge/` must not cause a redirect loop.
