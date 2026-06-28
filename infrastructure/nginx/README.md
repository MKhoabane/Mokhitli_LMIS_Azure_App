# Nginx

Use `lmis.conf` as the production domain-hosting template when Nginx terminates TLS in front of the LMIS app.

## Expected Topology

- Nginx listens on ports `80` and `443`
- The LMIS Node app listens on `127.0.0.1:5000`
- TLS certificates are provided by Let's Encrypt or your certificate manager

## Steps

1. Update `server_name` values to your real domain
2. Update certificate paths if your TLS layout differs
3. Copy `lmis.conf` into `/etc/nginx/sites-available/`
4. Enable the site and reload Nginx
