import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import { RequestHeader } from '@common/enums/request-header.enum';
import type { RequestWithContext } from '@common/interfaces/request-context.interface';

export function requestContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const request = req as unknown as Partial<RequestWithContext> & RequestWithContext;
  const headerId = req.header(RequestHeader.REQUEST_ID);
  const requestId = headerId && headerId.trim().length > 0 ? headerId.trim() : randomUUID();

  request.requestId = requestId;
  request.requestStartedAt = Date.now();
  res.setHeader(RequestHeader.REQUEST_ID, requestId);
  next();
}

