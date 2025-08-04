import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'
import { verifyToken } from '@/lib/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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

    await dbConnect()
    const db = require('mongoose').connection.db
    const collection = db.collection('saved_carts')

    // البحث عن عربة التسوق المحفوظة
    const savedCart = await collection.findOne({ userId: decoded.userId })

    if (!savedCart) {
      return res.status(200).json({ 
        success: true, 
        data: { cart: [] },
        message: 'No saved cart found' 
      })
    }

    res.status(200).json({ 
      success: true, 
      data: { 
        cart: savedCart.cart || [],
        updatedAt: savedCart.updatedAt
      },
      message: 'Cart loaded successfully' 
    })
  } catch (error) {
    console.error('Error loading cart:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    })
  }
} 