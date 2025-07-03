// api/my-event-handler.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // CORS headers instellen
  response.setHeader('Access-Control-Allow-Origin', '*'); // Of specifiek je frontend domein: 'https://jouw-frontend-domein.vercel.app'
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end(); // Pre-flight request afhandelen
  }

  if (request.method === 'POST') {
    console.log("Hello!!")
    console.warn(request)
  } else {
    response.status(405).json({ message: 'Methode niet toegestaan' });
  }
}