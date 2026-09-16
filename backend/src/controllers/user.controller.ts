import type { Request, Response } from "express";
import type { UserInputUpdate } from "../types/User.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { isStrongPassword } from "../utils/validation.js";

export const getUser = async (req: Request, res: Response) => {
    try {
        const { user } = req;
        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        // read the user data
        let { name, password, currentPassword }: UserInputUpdate = req.body;
        const { user } = req;

        if(!name && !password) {
            return res.status(400).json({
                message: "Please provide at least one field",
            })
        }

        if (password && !isStrongPassword(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            });
        }

        if (password) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required" });
            }
            const matchesCurrentPassword = await bcrypt.compare(currentPassword, user!.password);
            if (!matchesCurrentPassword) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
        }

        if (password) {
            const hashPassword = await bcrypt.hash(password, 10);
            password = hashPassword;
        }

        // update
        const UpdatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                name: name?.trim() ? name.trim() : user!.name,
                password: password ? password : user.password,
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        )

        // send response
        const { password: _, ...userWithoutPassword } = UpdatedUser!.toObject();
        return res.status(200).json({
            message: "User updated successfully",
            user: userWithoutPassword,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
