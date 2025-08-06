import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/mongodb'
import Farmer from '@/models/Farmer'
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
      const { page = 1, limit = 10, status, crop, certification, search } = req.query

      const query: any = {}
      
      if (status) query.status = status
      if (crop) query.crops = crop
      if (certification) query.certifications = certification
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { farmName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { 'farmLocation.city': { $regex: search, $options: 'i' } }
        ]
      }

      const skip = (Number(page) - 1) * Number(limit)
      
      const [farmers, total] = await Promise.all([
        Farmer.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        Farmer.countDocuments(query)
      ])

      // Calculate statistics
      const stats = await Farmer.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalFarmers: { $sum: 1 },
            totalFarmSize: { $sum: '$farmSize' },
            averageYield: { $avg: '$performance.averageYield' },
            averageQualityScore: { $avg: '$performance.qualityScore' },
            activeFarmers: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            }
          }
        }
      ])

      const performanceStats = await Farmer.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            avgYield: { $avg: '$performance.averageYield' },
            avgQuality: { $avg: '$performance.qualityScore' }
          }
        }
      ])

      return res.status(200).json({
        success: true,
        data: farmers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        stats: stats[0] || {
          totalFarmers: 0,
          totalFarmSize: 0,
          averageYield: 0,
          averageQualityScore: 0,
          activeFarmers: 0
        },
        performanceStats
      })
    }

    if (req.method === 'POST') {
      const {
        name,
        email,
        phone,
        farmName,
        farmSize,
        farmLocation,
        certifications,
        crops
      } = req.body

      // Validate required fields
      if (!name || !email || !phone || !farmName || !farmSize || !farmLocation) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        })
      }

      // Check if farmer already exists
      const existingFarmer = await Farmer.findOne({ email })
      if (existingFarmer) {
        return res.status(400).json({
          success: false,
          message: 'Farmer with this email already exists'
        })
      }

      const farmer = new Farmer({
        name,
        email,
        phone,
        farmName,
        farmSize,
        farmLocation,
        certifications: certifications || [],
        crops: crops || [],
        performance: {
          totalHarvested: 0,
          averageYield: 0,
          qualityScore: 0,
          lastHarvestDate: null
        }
      })

      await farmer.save()

      return res.status(201).json({
        success: true,
        data: farmer,
        message: 'Farmer created successfully'
      })
    }
  } catch (error) {
    console.error('Farmers API error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
} 