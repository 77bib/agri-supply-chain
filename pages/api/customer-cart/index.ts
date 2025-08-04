import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/jwt'
import { 
  getCustomerCart, 
  createCustomerCart, 
  updateCustomerInfo,
  getCartStats 
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
  console.log(`🔐 API Request for userId: ${userId}`)

  switch (req.method) {
    case 'GET':
      try {
        console.log(`📥 GET request for cart - userId: ${userId}`)
        const result = await getCustomerCart(userId)
        
        if (result.success) {
          console.log(`✅ Cart found for userId: ${userId}`)
          res.status(200).json(result)
        } else {
          console.log(`❌ No cart found for userId: ${userId}, creating new one...`)
          // إنشاء عربة تسوق جديدة مع معلومات فريدة لكل عميل
          const customerInfo = {
            name: decoded.name || `مستخدم ${userId.slice(0, 8)}`,
            email: decoded.email || `${userId.slice(0, 8)}@example.com`,
            phone: '',
            address: 'لم يتم تحديد العنوان بعد',
            city: 'لم يتم تحديد المدينة بعد',
            state: 'لم يتم تحديد الولاية بعد',
            zipCode: '00000',
            country: 'Morocco',
            preferences: {
              deliveryTime: 'anytime',
              specialInstructions: '',
              preferredPaymentMethod: 'card'
            }
          }
          
          console.log(`🆕 Creating new cart with customer info:`, customerInfo)
          const createResult = await createCustomerCart(userId, customerInfo)
          
          if (createResult.success) {
            console.log(`✅ New cart created successfully for userId: ${userId}`)
            res.status(200).json(createResult)
          } else {
            console.log(`❌ Failed to create cart for userId: ${userId}`)
            res.status(500).json(createResult)
          }
        }
      } catch (error) {
        console.error('❌ Error handling GET request:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
      }
      break

    case 'POST':
      try {
        console.log(`📝 POST request to create cart - userId: ${userId}`)
        const { customerInfo } = req.body
        
        if (!customerInfo) {
          return res.status(400).json({ success: false, message: 'Customer info is required' })
        }

        const result = await createCustomerCart(userId, customerInfo)
        res.status(201).json(result)
      } catch (error) {
        console.error('❌ Error handling POST request:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
      }
      break

    case 'PUT':
      try {
        console.log(`🔄 PUT request to update cart - userId: ${userId}`)
        const { customerInfo } = req.body
        
        if (!customerInfo) {
          return res.status(400).json({ success: false, message: 'Customer info is required' })
        }

        const result = await updateCustomerInfo(userId, customerInfo)
        res.status(200).json(result)
      } catch (error) {
        console.error('❌ Error handling PUT request:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` })
  }
} 