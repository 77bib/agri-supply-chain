import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/jwt'
import { 
  addItemToCustomerCart, 
  removeItemFromCustomerCart, 
  updateItemQuantityInCustomerCart,
  clearCustomerCart
} from '@/lib/customer-cart-service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // التحقق من التوكن
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }

  const userId = decoded.userId
  console.log(`🔐 Cart Items API Request for userId: ${userId}`)

  switch (req.method) {
    case 'POST':
      try {
        console.log(`➕ POST request to add item - userId: ${userId}`)
        const { product } = req.body
        
        if (!product) {
          return res.status(400).json({ success: false, message: 'Product is required' })
        }

        console.log(`📦 Adding product to cart:`, product)
        const result = await addItemToCustomerCart(userId, product)
        res.status(201).json(result)
      } catch (error) {
        console.error('❌ Error handling POST request:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
      }
      break

    case 'DELETE':
      try {
        console.log(`🗑️ DELETE request to remove item - userId: ${userId}`)
        const { productId } = req.body
        
        if (!productId) {
          return res.status(400).json({ success: false, message: 'Product ID is required' })
        }

        console.log(`❌ Removing product from cart: ${productId}`)
        const result = await removeItemFromCustomerCart(userId, productId)
        res.status(200).json(result)
      } catch (error) {
        console.error('❌ Error handling DELETE request:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
      }
      break

    case 'PUT':
      try {
        console.log(`🔄 PUT request to update item quantity - userId: ${userId}`)
        const { productId, quantity } = req.body
        
        if (!productId || quantity === undefined) {
          return res.status(400).json({ success: false, message: 'Product ID and quantity are required' })
        }

        console.log(`📊 Updating product quantity: ${productId} -> ${quantity}`)
        const result = await updateItemQuantityInCustomerCart(userId, productId, quantity)
        res.status(200).json(result)
      } catch (error) {
        console.error('❌ Error handling PUT request:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
      }
      break

    case 'PATCH':
      try {
        console.log(`🧹 PATCH request to clear cart - userId: ${userId}`)
        const result = await clearCustomerCart(userId)
        res.status(200).json(result)
      } catch (error) {
        console.error('❌ Error handling PATCH request:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
      }
      break

    default:
      res.setHeader('Allow', ['POST', 'DELETE', 'PUT', 'PATCH'])
      res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` })
  }
} 