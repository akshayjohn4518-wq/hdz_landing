import { Request, Response } from 'express';
import { query } from '../db/connection.js';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, company, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required fields',
      });
    }

    const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;

    const result = await query(
      `INSERT INTO contacts (name, email, company, subject, message, status, ip_address)
       VALUES ($1, $2, $3, $4, $5, 'new', $6)
       RETURNING *`,
      [name, email, company || '', subject || 'General Inquiry', message, ipAddress]
    );

    // Record system activity feed entry
    await query(
      `INSERT INTO system_activities (type, title, meta, badge_label, badge_variant)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'contact_received',
        `Partnership dispatch from ${company || name}`,
        'Received via public inquiry endpoint',
        'INQUIRY',
        'warning',
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Dispatch received. Operational team notified.',
      contact: result.rows[0],
    });
  } catch (err: unknown) {
    console.error('submitContact error:', err);
    return res.status(500).json({ success: false, error: 'Failed to submit contact inquiry' });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM contacts WHERE 1=1';
    const params: unknown[] = [];

    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return res.json({ success: true, contacts: result.rows });
  } catch (err: unknown) {
    console.error('getContacts error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve contacts' });
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'in_review', 'replied', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const result = await query(
      'UPDATE contacts SET status = $1 WHERE id::text = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    return res.json({ success: true, contact: result.rows[0] });
  } catch (err: unknown) {
    console.error('updateContactStatus error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update contact status' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM contacts WHERE id::text = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    return res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (err: unknown) {
    console.error('deleteContact error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete contact' });
  }
};
