import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { id, start, end } = req.body;
    console.log(`Ontvangen: ${id}, van ${start} tot ${end}`);
    res.status(200).json({ status: 'OK', id });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}