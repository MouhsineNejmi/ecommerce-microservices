import { Router, Request, Response } from 'express';
import moment from 'moment';

import { currentUser } from '../middlewares/current-user.middleware';
import { requireAdmin } from '../middlewares/require-admin.middleware';

import { Listing } from '../models/listings';
import { User } from '../models/user';
import { Reservation } from '../models/reservations';

import { asyncHandler } from '../utils/async-handler';

const router = Router();

router.use(currentUser, requireAdmin);

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const totalListings = await Listing.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalRevenue = await Reservation.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const activeHosts = await User.aggregate([
      {
        $lookup: {
          from: 'listings',
          localField: '_id',
          foreignField: 'host',
          as: 'hostListings',
        },
      },
      { $match: { 'hostListings.0': { $exists: true } } },
      { $count: 'count' },
    ]);

    return res.json({
      totalListings: totalListings || 0,
      totalReservations: totalReservations || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeHosts: activeHosts[0]?.count || 0,
    });
  })
);
router.get(
  '/reservations',
  asyncHandler(async (req: Request, res: Response) => {
    const recentReservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('listingId', 'id title')
      .populate('userId', 'id avatar name');

    return res.json(recentReservations);
  })
);
router.get(
  '/revenue',
  asyncHandler(async (req: Request, res: Response) => {
    const monthlyRevenue = await Reservation.aggregate([
      {
        $match: {
          // paymentStatus: 'completed',
          createdAt: {
            $gte: moment().subtract(6, 'months').toDate(),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDate' },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $project: {
          name: {
            $let: {
              vars: {
                monthsInString: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
              },
              in: {
                $arrayElemAt: ['$$monthsInString', { $subtract: ['$_id', 1] }],
              },
            },
          },
          revenue: 1,
          _id: 0,
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.json(monthlyRevenue);
  })
);

export default router;
