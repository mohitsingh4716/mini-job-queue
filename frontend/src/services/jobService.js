const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function handleResponse(response) {
  if (response.ok) {
    // DELETE and others may still return JSON; guard against empty bodies.
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  // Try to surface the backend's error message, falling back to a generic one.
  let message = `Request failed (${response.status})`;
  try {
    const body = await response.json();
    if (body && body.message) {
      message = Array.isArray(body.message)
        ? body.message.join(', ')
        : body.message;
    }
  } catch {
    // Response had no JSON body; keep the generic message.
  }
  throw new Error(message);
}

export async function getJobs() {
  const res = await fetch(`${API_URL}/jobs`);
  return handleResponse(res);
}

export async function createJob(job) {
  const res = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  return handleResponse(res);
}

export async function updateJobStatus(id, status) {
  const res = await fetch(`${API_URL}/jobs/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function deleteJob(id) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
