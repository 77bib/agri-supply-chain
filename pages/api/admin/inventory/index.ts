import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/mongodb'
import Inventory from '@/models/Inventory'
import { verifyAdminToken } from '@/lib/admin-middleware'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    // Verify admin token
    const adminCheck = await verifyAdminToken(req)
    if (!adminCheck.success) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    await connectDB()

    if (req.method === 'GET') {
      const { page = 1, limit = 10, status, quality, search } = req.query

      const query: any = {}
      
      if (status) query.status = status
      if (quality) query['quality.grade'] = quality
      if (search) {
        query.$or = [
          { batchId: { $regex: search, $options: 'i' } },
          { batchNumber: { $regex: search, $options: 'i' } },
          { 'storage.warehouse': { $regex: search, $options: 'i' } }
        ]
      }

      const skip = (Number(page) - 1) * Number(limit)
      
      const [inventory, total] = await Promise.all([
        Inventory.find(query)
          .populate('productId', 'name category')
          .populate('farmerId', 'name farmName')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        Inventory.countDocuments(query)
      ])

      // Calculate statistics
      const stats = await Inventory.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalBatches: { $sum: 1 },
            totalValue: { $sum: '$price.sellingPrice' },
            totalQuantity: { $sum: '$quantity' },
            lowStockBatches: {
              $sum: { $cond: [{ $lt: ['$quantity', 100] }, 1, 0] }
            },
            expiringSoon: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$expiryDate', new Date()] },
                      { $lte: ['$expiryDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ])

      // Get quality distribution
      const qualityDistribution = await Inventory.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$quality.grade',
            count: { $sum: 1 },
            avgValue: { $avg: '$price.sellingPrice' }
          }
        }
      ])

      // Get status distribution
      const statusDistribution = await Inventory.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])

      // Get active alerts
      const activeAlerts = await Inventory.aggregate([
        { $match: { ...query, 'alerts.resolved': false } },
        { $unwind: '$alerts' },
        { $match: { 'alerts.resolved': false } },
        {
          $group: {
            _id: '$alerts.type',
            count: { $sum: 1 },
            alerts: { $push: '$alerts' }
          }
        }
      ])

      return res.status(200).json({
        success: true,
        data: inventory,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        stats: stats[0] || {
          totalBatches: 0,
          totalValue: 0,
          totalQuantity: 0,
          lowStockBatches: 0,
          expiringSoon: 0
        },
        qualityDistribution,
        statusDistribution,
        activeAlerts
      })
    }

    if (req.method === 'POST') {
      const {
        batchId,
        productId,
        farmerId,
        batchNumber,
        harvestDate,
        expiryDate,
        quantity,
        unit,
        quality,
        storage,
        price,
        certifications
      } = req.body

      // Validate required fields
      if (!batchId || !productId || !farmerId || !batchNumber || !harvestDate || !expiryDate || !quantity || !unit || !quality || !storage || !price) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        })
      }

      // Check if batch already exists
      const existingBatch = await Inventory.findOne({ 
        $or: [{ batchId }, { batchNumber }] 
      })
      if (existingBatch) {
        return res.status(400).json({
          success: false,
          message: 'Batch with this ID or number already exists'
        })
      }

      const inventory = new Inventory({
        batchId,
        productId,
        farmerId,
        batchNumber,
        harvestDate,
        expiryDate,
        quantity,
        unit,
        quality,
        storage,
        price,
        certifications: certifications || [],
        traceability: {
          origin: storage.warehouse,
          processingHistory: [],
          qualityChecks: []
        },
        alerts: []
      })

      await inventory.save()

      return res.status(201).json({
        success: true,
        data: inventory,
        message: 'Inventory batch created successfully'
      })
    }
  } catch (error) {
    console.error('Inventory API error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
} 