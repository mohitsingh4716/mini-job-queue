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

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env        # set VITE_API_URL to your backend URL
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Environment Variables

**backend/.env**

| Variable       | Description                                              |
| -------------- | -------------------------------------------------------- |
| `DATABASE_URL` | Neon PostgreSQL connection string (never hardcoded)      |
| `PORT`         | Port the API listens on (default `3000`)                 |
| `CORS_ORIGIN`  | Allowed frontend origin(s), comma-separated, or `*`      |


## Database / Prisma Commands

```bash
npx prisma generate          # generate the Prisma client
npx prisma migrate dev       # create + apply a migration (development)
npx prisma migrate deploy    # apply committed migrations (production)
npx prisma studio            # optional: browse data
```

### Job model

| Field       | Type        | Notes                          |
| ----------- | ----------- | ------------------------------ |
| `id`        | UUID        | primary key, auto-generated    |
| `title`     | String      | required                       |
| `type`      | String      | required                       |
| `status`    | `JobStatus` | enum, defaults to `PENDING`    |
| `createdAt` | DateTime    | timestamp, defaults to now     |

`JobStatus` enum: `PENDING`, `RUNNING`, `COMPLETED`, `FAILED`.

## API Endpoints

Base URL: `${API_URL}`

### `POST /jobs`
Create a job (status defaults to `PENDING`).

Request:
```json
{ "title": "Send emails", "type": "email" }
```
Response `201`:
```json
    {
        "id": "59c43a94-5ccd-486f-a75b-6540bccecf1a",
        "title": "Send emails",
        "type": "email",
        "status": "PENDING",
        "createdAt": "2026-09-16T07:17:55.845Z"
    }
```
Invalid body → `400`:
```json
{ "message": ["title should not be empty"], "error": "Bad Request", "statusCode": 400 }
```

### `GET /jobs`
Return all jobs, newest first.

Response `200`:
```json
[
    {
        "id": "59c43a94-5ccd-486f-a75b-6540bccecf1a",
        "title": "Send emails",
        "type": "email",
        "status": "PENDING",
        "createdAt": "2026-09-16T07:17:55.845Z"
    },
    {
        "id": "48a2c5e0-1abe-4035-9399-6842f24c8410",
        "title": "Data processing job",
        "type": "ETL",
        "status": "PENDING",
        "createdAt": "2026-09-16T07:08:43.649Z"
    }
]
```

### `PATCH /jobs/:id/status`
Change a job's status. Transition rules are enforced on the server.

Request:
```json
{ "status": "RUNNING" }
```
Response `200`: the updated job.
```
{
    "id": "59c43a94-5ccd-486f-a75b-6540bccecf1a",
    "title": "Send emails",
    "type": "email",
    "status": "RUNNING",
    "createdAt": "2026-09-16T07:17:55.845Z"
}
```

Errors:
- `400` invalid transition (e.g. `COMPLETED → RUNNING`) or invalid status value
- `404` job not found
- `409` the status changed concurrently and the transition is no longer valid

### `DELETE /jobs/:id`
Delete a job by id.

Response `200`:
```json
{
    "id": "48a2c5e0-1abe-4035-9399-6842f24c8410",
    "deleted": true
}
```
`404` if the job does not exist.

### `GET /health`
Health check (bonus). Response `200`:
```json
{ "status": "ok", "timestamp": "2026-09-15T14:53:03.403Z" }
```


## Status Transition Rules

Allowed:
- `PENDING → RUNNING`
- `PENDING → FAILED`
- `RUNNING → COMPLETED`

Everything else is rejected (e.g. `COMPLETED → RUNNING`, `FAILED → RUNNING`,
`RUNNING → PENDING`, `PENDING → COMPLETED`). These rules live in `JobsService`
and are enforced even if the API is called directly, bypassing the frontend.

## Concurrency Approach

The status transition is enforced by the backend using an atomic database update
conditioned on the current status, so concurrent requests cannot both
successfully perform the same transition.

Concretely, the update is:

```ts
await prisma.job.updateMany({
  where: { id, status: expectedPreviousStatus }, // e.g. PENDING
  data:  { status: newStatus },                  // e.g. RUNNING
});
```

`updateMany` returns a **count** of affected rows. If two tabs both read a job as
`PENDING` and both try `PENDING → RUNNING`, only the first request finds the row
still in `PENDING` and updates it (`count = 1`); the second matches zero rows
(`count = 0`) and the service returns a `409 Conflict`. The condition and the
write happen in a single SQL statement, so there is no read-then-write race — we
never "check status, then update" as two separate steps.

This was verified by firing 10 simultaneous `PENDING → RUNNING` requests at one
job: exactly one returned `200`, the rest returned `400`/`409`.

