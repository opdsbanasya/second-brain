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
    const rawQuery = ((req.query.query || req.query.q) as string)?.trim();
    
    if (!rawQuery && typeof rawQuery !== "string")
      return res.status(400).json({ message: "Query is required" });

    if (rawQuery.length > 100)
      return res.status(400).json({ message: "Query is too long" });

    const query = escapeRegex(rawQuery);

    if (!query) return res.status(400).json({ message: "Query is required" });

    req.rawQuery = query;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
