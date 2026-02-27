import { API_URL } from './config';

export async function fetchAcademic(slug: string) {
    const res = await fetch(`${API_URL}/academic/${slug}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
}

export async function createRequest(data: any) {
    const res = await fetch(`${API_URL}/student/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return res.json();
}
