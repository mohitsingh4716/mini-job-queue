# Mini Job Queue Dashboard

A full-stack app to create jobs and move them through a status lifecycle
(`PENDING → RUNNING → COMPLETED / FAILED`). Status transitions are validated and
enforced on the **server**, including a concurrency-safe atomic update so two
simultaneous requests can never both perform the same transition.

## Tech Stack

**Backend**
- NestJS + TypeScript
- PostgreSQL (Neon) + Prisma ORM
- REST API
- `class-validator` / `class-transformer` for DTO validation