import { status, errorMessage, successMessage } from "../helpers/status.js";
import { createError } from "../utils/createError.js";
import Gig from '../model/gig.model.js'

export const createGig = async (req, res, next) => {
    if (!req.isSeller)
      return next(createError(status.conflict, "Only sellers can create a gig!"));
  
    const newGig = new Gig({
      userId: req.userId,
      ...req.body,
    });
  
    try {
      await newGig.save();
      res.status(201).json({msg: "Gig saved successfully"});
    } catch (error) {
      next(error)
    }
};

export const getAllGig = async (req,res,next) => {
    try {
        const gig = await Gig.find({})

        if (!gig) {
            return next(createError(status.notfound, "Gig not found"))
        }
        res.status(status.success).json({ response: gig })
    } catch (error) {
        next(createError(status.error, error.message))
    }
}

export const getGig = async (req,res,next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig){
            return next(createError(status.notfound, "Gig not found"))
        }

        res.status(status.success).json({ response: gig})
        
    } catch (error) {
        next(createError(status.error, error.message))
    }
}

export const updateGig = async (req,res,next) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) return next(createError(status.notfound,'Gig not found'))
        if (gig.userId !== req.userId) return next(createError(status.notfound,'You are not allow to update this GIG'))

        const gigUpdate = await Gig.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true })
        res.status(status.success).json({ response: gigUpdate })
        
    } catch (error) {
        next(createError(status.error, error.message))
    }
}

export const deleteGig = async (req,res,next) => {
    try {
        const gig = await Gig.findById(req.params.id)
        if (!gig) {
            return next(createError(status.error,'Gig not found'))
        }

        if (gig.userId !== req.userId) return next(createError(status.unauthorized, 'You are not allow to delete this GIG'))
        
        await Gig.findByIdAndDelete(req.params.id)
        res.status(status.success).json({msg: "Gig delete successfully"})
    } catch (error) {
        next(createError(status.error, error.message))
    }
}