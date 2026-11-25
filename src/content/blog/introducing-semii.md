---
title: "Introducing semii: Rails-speed scaffolding for Go APIs"
description: "semii 1.0 is here — a Go framework that generates production-ready REST APIs with auth, validation, migrations, tests and deployment as plain Go code you own."
date: 2026-11-25
author: "AhmadRaza-Khan"
---

Go is a wonderful language for backend services. Starting one is less wonderful: before the first
real endpoint, you wire up routing, configuration, logging, validation, error responses, a database
layer, migrations, authentication, tests, a Dockerfile and CI. Every team writes that code again, a
little differently each time.

**semii** removes that work. It is a scaffolding framework for Go REST APIs: a CLI that generates
the whole project, and a set of small packages that the generated code builds on. Today, semii
reaches **1.0**.

## One command to a working API

```sh
go install github.com/AhmadRaza-Khan/semii/cmd/semii@latest
semii new shop --db postgres --auth jwt
cd shop && cp .env.example .env && docker compose up -d db
semii migrate up
semii dev
```

That is a running API with sign-up, login, JWT access and refresh tokens, email verification,
password reset, health checks, structured logging, graceful shutdown, a Dockerfile and a GitHub
Actions pipeline. Adding a resource is one more line:

```sh
semii g resource Product name:string price:decimal:min=0 description:text:null
```

You get the migration, type-safe queries, a model, validated input types, a service, HTTP handlers,
routes, an in-memory fake, factories and tests — about fifteen files of plain Go.

## Conventions as code, not magic

Frameworks like Rails are fast because of conventions. In Go, we prefer to see what our program
does. semii delivers the conventions **through code generation**: everything lands in your
repository as ordinary, readable Go. There is no reflection-based routing, no annotations and no
hidden runtime. Every generated file starts with *"You own this file; edit freely"* — and you can.

The runtime packages are deliberately thin:

- **web** — routing on the standard library `http.ServeMux`, handlers that return errors, RFC 9457
  problem responses, JSON decoding with validation, pagination and middleware.
- **auth** — sessions with CSRF protection, JWT with rotating refresh token families, API keys,
  argon2id passwords, rate limiting and lockout.
- **db** — PostgreSQL with pgx, MySQL and SQLite through `database/sql`, MongoDB, and migrations.
- **testkit** — a fluent HTTP test client and a real, isolated database for each test.

## Secure by default

Every route must declare who can call it. A route without a policy stops the app from booting, so
nothing is accidentally public. The authentication flows were pentested against a generated app:
forged and expired tokens, refresh token reuse, session fixation, CSRF, account enumeration (in
responses and in timing), reset link reuse and API key abuse are all handled — and the checks ship
as tests inside your project.

## Four databases, one shape

Pick PostgreSQL, MySQL, SQLite or MongoDB with `--db`. Handlers, services and tests look the same on
every one; only the repository layer changes. SQLite is pure Go, so small services and quick
experiments need no Docker at all.

## Built to ship

Generated projects include a distroless Docker image, a compose file, CI with linting, race-tested
tests and `govulncheck`, an optional SSH deploy workflow, and ready-made systemd, PM2 and Nginx
configs. The binary carries its own `migrate` command for deploys.

## Try it

semii needs Go 1.26 or newer and is open source under the MIT License. Start with the
[getting started guide](/docs/getting-started), browse the [CLI reference](/docs/cli), or read the
code on [GitHub](https://github.com/AhmadRaza-Khan/semii). Issues and ideas are very welcome.
