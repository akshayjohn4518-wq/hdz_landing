import { Request, Response } from 'express';
import { query } from '../db/connection.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { status, category } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: unknown[] = [];

    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    sql += ' ORDER BY order_index ASC, created_at DESC';

    const result = await query(sql, params);
    return res.json({ success: true, products: result.rows });
  } catch (err: unknown) {
    console.error('getProducts error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM products WHERE id::text = $1 OR slug = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    return res.json({ success: true, product: result.rows[0] });
  } catch (err: unknown) {
    console.error('getProductById error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, slug, category, status, summary, description, specs, featured } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ success: false, error: 'Title and slug are required' });
    }

    const result = await query(
      `INSERT INTO products (title, slug, category, status, summary, description, specs, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        slug,
        category || 'CORE',
        status || 'draft',
        summary || '',
        description || '',
        JSON.stringify(specs || {}),
        featured || false,
      ]
    );

    // Record system activity
    await query(
      `INSERT INTO system_activities (type, title, meta, badge_label, badge_variant)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'product_published',
        `${title} created`,
        `Product created in category ${category || 'CORE'}`,
        'CREATED',
        'operational',
      ]
    );

    return res.status(201).json({ success: true, product: result.rows[0] });
  } catch (err: unknown) {
    console.error('createProduct error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, category, status, summary, description, specs, featured } = req.body;

    const result = await query(
      `UPDATE products
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           category = COALESCE($3, category),
           status = COALESCE($4, status),
           summary = COALESCE($5, summary),
           description = COALESCE($6, description),
           specs = COALESCE($7, specs),
           featured = COALESCE($8, featured),
           updated_at = NOW()
       WHERE id::text = $9 OR slug = $9
       RETURNING *`,
      [
        title,
        slug,
        category,
        status,
        summary,
        description,
        specs ? JSON.stringify(specs) : null,
        featured,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Record activity
    await query(
      `INSERT INTO system_activities (type, title, meta, badge_label, badge_variant)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'product_updated',
        `${result.rows[0].title} updated`,
        'Specifications and metadata updated',
        'UPDATED',
        'neutral',
      ]
    );

    return res.json({ success: true, product: result.rows[0] });
  } catch (err: unknown) {
    console.error('updateProduct error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM products WHERE id::text = $1 RETURNING id, title', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: unknown) {
    console.error('deleteProduct error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};
