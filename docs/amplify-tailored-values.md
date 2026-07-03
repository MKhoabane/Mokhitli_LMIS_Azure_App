# Amplify Tailored Values

This file captures the current live frontend domain for the LMIS Amplify deployment.

## Confirmed Frontend Domain

```bash
https://master.ds7319uksh7nr.amplifyapp.com
```

## Backend CORS Setting

Your LMIS backend must allow this Amplify frontend origin.

Use:

```bash
CORS_ORIGIN=https://master.ds7319uksh7nr.amplifyapp.com
```

If you later add a custom frontend domain, append it as a comma-separated value:

```bash
CORS_ORIGIN=https://master.ds7319uksh7nr.amplifyapp.com,https://lmis.your-domain.example
```

## Amplify Frontend Environment Variable

The frontend still needs the live backend API URL.

Set this in Amplify once the backend domain is known:

```bash
VITE_API_BASE_URL=https://your-backend-domain.example/api
```

Example:

```bash
VITE_API_BASE_URL=https://api.your-domain.example/api
```

## Remaining Required Value

To fully finish the Amplify wiring, the remaining missing value is:

```bash
BACKEND_API_DOMAIN=https://your-backend-domain.example
```

Once that is available, the final frontend environment value becomes:

```bash
VITE_API_BASE_URL=https://your-backend-domain.example/api
```
