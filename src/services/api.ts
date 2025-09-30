const BASE_URL = (process.env.REACT_APP_API_URL as string) || 'http://localhost:4000/api';

export async function createCandidate(data: any) {
  const res = await fetch(`${BASE_URL}/candidates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create candidate');
  return res.json();
}

export async function updateCandidateApi(id: string, updates: any) {
  const res = await fetch(`${BASE_URL}/candidates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update candidate');
  return res.json();
}

export async function listCandidates(params?: { q?: string; status?: string; sort?: string }) {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  const res = await fetch(`${BASE_URL}/candidates${query}`);
  if (!res.ok) throw new Error('Failed to fetch candidates');
  return res.json();
}

export async function getCandidate(id: string) {
  const res = await fetch(`${BASE_URL}/candidates/${id}`);
  if (!res.ok) throw new Error('Failed to fetch candidate');
  return res.json();
}

export async function addAnswerApi(id: string, answer: any) {
  const res = await fetch(`${BASE_URL}/candidates/${id}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answer),
  });
  if (!res.ok) throw new Error('Failed to add answer');
  return res.json();
}


