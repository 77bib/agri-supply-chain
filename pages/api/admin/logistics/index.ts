import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/mongodb'
import Transport from '@/models/Transport'
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
      const { page = 1, limit = 10, status, vehicleType, search } = req.query

      const query: any = {}
      
      if (status) query.status = status
      if (vehicleType) query.vehicleType = vehicleType
      if (search) {
        query.$or = [
          { vehicleId: { $regex: search, $options: 'i' } },
          { licensePlate: { $regex: search, $options: 'i' } },
          { 'driver.name': { $regex: search, $options: 'i' } },
          { 'route.origin.address': { $regex: search, $options: 'i' } },
          { 'route.destination.address': { $regex: search, $options: 'i' } }
        ]
      }

      const skip = (Number(page) - 1) * Number(limit)
      
      const [transports, total] = await Promise.all([
        Transport.find(query)
          .populate('shipment.orderId', 'totalPrice status')
          .populate('shipment.products.productId', 'name price')
          .sort({ 'schedule.departureTime': -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        Transport.countDocuments(query)
      ])

      // Calculate statistics
      const stats = await Transport.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalShipments: { $sum: 1 },
            activeShipments: {
              $sum: { $cond: [{ $eq: ['$status', 'in_transit'] }, 1, 0] }
            },
            deliveredShipments: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            delayedShipments: {
              $sum: { $cond: [{ $eq: ['$status', 'delayed'] }, 1, 0] }
            },
            totalWeight: { $sum: '$shipment.totalWeight' }
          }
        }
      ])

      // Get status distribution
      const statusDistribution = await Transport.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])

      // Get vehicle type distribution
      const vehicleDistribution = await Transport.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$vehicleType',
            count: { $sum: 1 }
          }
        }
      ])

      // Get active alerts
      const activeAlerts = await Transport.aggregate([
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
        data: transports,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        stats: stats[0] || {
          totalShipments: 0,
          activeShipments: 0,
          deliveredShipments: 0,
          delayedShipments: 0,
          totalWeight: 0
        },
        statusDistribution,
        vehicleDistribution,
        activeAlerts
      })
    }

    if (req.method === 'POST') {
      const {
        vehicleId,
        vehicleType,
        licensePlate,
        driver,
        route,
        shipment,
        schedule
      } = req.body

      // Validate required fields
      if (!vehicleId || !vehicleType || !licensePlate || !driver || !route || !shipment || !schedule) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        })
      }

      // Check if vehicle already exists
      const existingTransport = await Transport.findOne({ 
        $or: [{ vehicleId }, { licensePlate }] 
      })
      if (existingTransport) {
        return res.status(400).json({
          success: false,
          message: 'Vehicle with this ID or license plate already exists'
        })
      }

      const transport = new Transport({
        vehicleId,
        vehicleType,
        licensePlate,
        driver,
        route,
        shipment,
        schedule,
        tracking: {
          currentLocation: null,
          temperature: null,
          humidity: null,
          speed: null,
          fuelLevel: null
        },
        alerts: []
      })

      await transport.save()

      return res.status(201).json({
        success: true,
        data: transport,
        message: 'Transport created successfully'
      })
    }
  } catch (error) {
    console.error('Logistics API error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
} 