import type { NextFunction, Request, Response } from "express";

export const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const sanitizeSearchQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawQuery = ((req.query.query || req.query.q) as string)?.trim() || "";

    if (rawQuery.length > 100)
      return res.status(400).json({ message: "Query is too long" });

    const query = escapeRegex(rawQuery);

    req.rawQuery = query;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
