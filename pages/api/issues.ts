import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.headers['x-user-id'];

  if (!userId || typeof userId !== 'string') {
    return res.status(401).json({ error: 'Unauthorized: user ID missing' });
  }

  try {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ issues: data });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
