import JoiDate from '@joi/date';
import joi from 'joi';

export const rentalsSchema = joi.object({
  customerId: joi.number().positive().required(),
  gameId: joi.number().positive().required(),
  rentDate: joi.extend(JoiDate).date().format('YYYY-MM-DD').utc(),
  daysRented: joi.number().positive().required(),
  returnDate: joi.extend(JoiDate).date().format('YYYY-MM-DD').utc().allow(null),
  originalPrice: joi.number().positive(),
  delayFee: joi.number().positive().allow(null)
});
