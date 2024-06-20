import { status } from "../helpers/status.js";
import Review from "../model/review.model.js";
import Gig from "../model/gig.model.js";
import { createError } from "../utils/createError.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller)
    return next(createError(status.unauthorized, "Seller can't review"));

  const newReview = new Review({
    gigId: req.body.gigId,
    userId: req.userId,
    star: req.body.star,
    desc: req.body.desc,
  });

  try {
    const review = await Review.findOne({
      userId: req.userId,
      gigId: req.body.gigId,
    });

    if (review)
      return next(
        createError(
          status.unauthorized,
          "You have already create a review for this gig"
        )
      );

    const savedReview = await newReview.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(status.success).json(savedReview);
  } catch (error) {
    next(createError(status.error, error));
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.id });
    if (!reviews)
      return res.status(status.notfound).json({ msg: "Review not found" });

    res.status(status.success).json(reviews);
  } catch (error) {
    next(createError(status.error, error));
  }
};

export const deleteReview = async (req, res, next) => {
  if (!req.isSeller)
      return res.status(status.unauthorized).json({ msg: "You are not authorized"})
  try {
    const review = await Review.findOneAndDelete(req.params.id);
    if (!review)
      return res.status(status.notfound).json({ msg: "Review not found" });
    res.status(status.success).json({ msg: "Delete Review Successfully" });
  } catch (error) {
    next(createError(status.error, error));
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const reviewOne = await Review.findById({
        _id: req.params.id
    })
    if (!reviewOne) {
        return next(createError(404, "Review not found"));
    }
    console.log(reviewOne)
    const { desc, star } = req.body

    const review = await Review.findByIdAndUpdate(
        req.params.id, 
        {
        $set: {
            desc,
            star,
            userId: req.userId,
            gigId: reviewOne.gigId,
        },
    }
    ,{ new: true }
    )
    if (!review) {
        return next(createError(404, "Review not found"));
      }
  
    res.status(200).json(review);
  } catch (error) {
    console.log(error)
    next(createError(status.error, error));
  }
};


