import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { bookingRoom, changeBooking, listBooking, listHotelBookings } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('', listBooking)
  .get('/hotel/:hotelId', listHotelBookings)
  .post('', bookingRoom)
  .put('/:bookingId', changeBooking);

export { bookingRouter };
