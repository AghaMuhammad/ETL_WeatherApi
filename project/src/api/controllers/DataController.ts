import { Request, Response, NextFunction } from 'express';
import DataService from '../../domain/services/DataService';

export const getData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract filter and pagination parameters from the query string.
    const filter = req.query.filter ? req.query.filter.toString() : undefined;
    const page = req.query.page ? parseInt(req.query.page.toString(), 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 10;

    // Call the DataService to retrieve data based on query parameters.
    const data = await DataService.getData({ filter, page, limit });

    // Return the data with appropriate status code and pagination details.
    res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
      },
    });
  } catch (error) {
    // Pass errors to the global error handler.
    next(error);
  }
};
