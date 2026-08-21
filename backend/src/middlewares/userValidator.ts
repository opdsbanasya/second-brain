import type { NextFunction, Request, Response } from "express";
import validator from "validator";

export const userValidator = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        // Name Validation & Sanitization
        if (name !== undefined) {
            if (typeof name !== "string") return res.status(400).json({ message: "Name must be a string" });
            if (!validator.isLength(name, { min: 1, max: 100 })) {
                return res.status(400).json({ message: "Name must be between 1 and 100 characters" });
            }
            if(!validator.isAlpha(name, 'en-US', { ignore: ' ' })){
                return res.status(400).json({ message: "Name must contain only alphabetic characters" });
            }
            req.body.name = validator.escape(validator.trim(name));
        }

        // Email Validation & Sanitization
        if (email !== undefined) {
            if (typeof email !== "string") return res.status(400).json({ message: "Email must be a string" });
            if (!validator.isLength(email, { max: 254 })) {
                return res.status(400).json({ message: "Email must be less than 255 characters" });
            }
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: "Email is not valid" });
            }
            req.body.email = validator.trim(email);
        }

        // Password Length Validation (prevent bcrypt long-string DoS)
        if (password !== undefined) {
            if (typeof password !== "string") return res.status(400).json({ message: "Password must be a string" });
            if (!validator.isLength(password, { max: 128 })) {
                return res.status(400).json({ message: "Password is too long (max 128 characters)" });
            }
            if(!validator.isStrongPassword(password)){
                return res.status(400).json({ message: "Password is not strong enough" });
            }
        }

        next();
    } catch (error) {
        console.error("User validation error:", error);
        res.status(500).json({ message: "Internal server error during user validation" });
    }
};
