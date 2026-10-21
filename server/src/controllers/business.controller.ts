import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { User } from "../models/User";
import { Business } from "../models/Business";
import { createBusinessSchema } from "../validators/business";

export const createBusiness = async (req: AuthRequest, res: Response) => {
  const parsed = createBusinessSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }
  const { name, slug } = parsed.data;

  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.businessId) return res.status(409).json({ message: "You already have a business" });

  try {
    const business = await Business.create({ name, slug, owner: user._id });
    user.role = "owner";
    user.businessId = business._id;
    await user.save();
    return res.status(201).json({ id: business._id, name: business.name, slug: business.slug });
  } catch (error: any) {
    if (error.code === 11000) return res.status(409).json({ message: "Slug already taken" });
    throw error;
  }
};