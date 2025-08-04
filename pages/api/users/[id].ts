import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import Order from '../../../models/Order';
import Cart from '../../../models/Cart';
import { withAdmin, AdminRequest } from '../../../lib/admin-middleware';

async function handler(req: AdminRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      message: `Method ${method} not allowed`
    });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }

  try {
    await dbConnect();

    // Get user details
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's orders
    const orders = await Order.find({ userId: id })
      .populate('productId', 'name price image')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's cart
    const cart = await Cart.findOne({ userId: id });

    // Calculate statistics
    const totalOrders = await Order.countDocuments({ userId: id });
    const totalSpent = await Order.aggregate([
      { $match: { userId: id, status: { $in: ['delivered', 'confirmed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const orderStats = {
      total: totalOrders,
      totalSpent: totalSpent[0]?.total || 0,
      recentOrders: orders.length,
      hasActiveCart: !!cart && cart.items.length > 0
    };

    res.status(200).json({
      success: true,
      data: {
        user,
        orders,
        cart,
        statistics: orderStats
      }
    });

  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default withAdmin(handler); 