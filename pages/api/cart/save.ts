import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    // التحقق من التوكن
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const { cart } = req.body

    if (!cart || !Array.isArray(cart)) {
      return res.status(400).json({ success: false, message: 'Invalid cart data' })
    }

    await dbConnect()
    const db = require('mongoose').connection.db
    const collection = db.collection('saved_carts')

    // حفظ أو تحديث عربة التسوق
    await collection.updateOne(
      { userId: decoded.userId },
      { 
        $set: { 
          userId: decoded.userId,
          cart: cart,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    res.status(200).json({ 
      success: true, 
      message: 'Cart saved successfully' 
    })
  } catch (error) {
    console.error('Error saving cart:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    })
  }
} 