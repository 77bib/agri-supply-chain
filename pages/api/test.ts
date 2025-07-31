import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'طريقة طلب غير مسموح بها' });
  }

  try {
    // اختبار الاتصال بقاعدة البيانات
    await dbConnect();
    
    res.status(200).json({
      success: true,
      message: 'تم الاتصال بقاعدة البيانات بنجاح',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', error);
    res.status(500).json({
      success: false,
      message: 'فشل في الاتصال بقاعدة البيانات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }
} 