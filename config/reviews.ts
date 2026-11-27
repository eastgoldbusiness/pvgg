/**
 * Google Reviews Configuration for Pavan Vela Grand
 *
 * Source of truth: Actual customer Google reviews for Pavan Vela Grand
 * Google Share Link: https://share.google/EUtx4odruKGXQQbZK
 *
 * GOVERNANCE RULES:
 * 1. Only authentic customer reviews supplied from Google Business Profile.
 * 2. Exact verbatim quotes, star ratings (including 4-star for Suja Manimaran), and relative dates.
 * 3. No fake reviews, invented ratings, or synthetic testimonials.
 * 4. Structured for easy extension when new Google reviews are added.
 */

export interface GoogleReviewItem {
  readonly id: string;
  readonly author: string;
  readonly initial: string;
  readonly rating: number; // 1 to 5
  readonly date: string;
  readonly text: string;
}

export const GOOGLE_REVIEWS_CONFIG = {
  businessName: "PAVAN VELA GRAND",
  googleReviewsUrl:
    "https://www.google.com/travel/search?q=Pavan%20Vela%20Grand&g2lb=4965990%2C72471280%2C72573224%2C72686036%2C72803964%2C72882230%2C73064764%2C121529350%2C121608706%2C121921501%2C121951222%2C122078727%2C122097177%2C122121959%2C122134888%2C122147525%2C122263494&hl=en-IN&gl=in&cs=1&ssta=1&ts=CAEaRwopEicyJTB4M2IwMGFhYmUyNTg1Njg4ZjoweDQ5YTgzNTU3NWRjMDA2MzgSGhIUCgcI6g8QCxgcEgcI6g8QCxgdGAEyAhAA&qs=CAEyE0Nnb0l1SXlBN3ZXcWpkUkpFQUU4AkIJCTgGwF1XNahJ&ap=ugEHcmV2aWV3cw&ictx=111&ved=0CAAQ5JsGahcKEwjYrJXmiqiYAxUAAAAAHQAAAAAQBg",
  googleShareUrl: "https://share.google/EUtx4odruKGXQQbZK",
  heading: "What Our Guests Say on Google",
  subheading: "Authentic reviews from verified travelers and families who stayed at Pavan Vela Grand on Palani Road Bypass, Dindigul.",
  ratingLabel: "Based on Google Reviews",
  poweredByText: "Powered by Google",
} as const;

export const GOOGLE_REVIEWS: readonly GoogleReviewItem[] = [
  {
    id: "review-1",
    author: "Vinoth. Crotser",
    initial: "V",
    rating: 5,
    date: "Edited a week ago",
    text: "Had a wonderful experience! The rooms were clean and well-maintained, the ambience was pleasant, and the service was excellent. The staff were friendly and attentive, and the overall hospitality was impressive. Food quality was also good. Highly recommended for a comfortable and pleasant stay!",
  },
  {
    id: "review-2",
    author: "Paranthaman Jayaganesan",
    initial: "P",
    rating: 5,
    date: "5 months ago",
    text: "Supportive staff from check-in till checkout. Guests were managed well and the overall experience was smooth. Water flow in the washroom was a bit slow, but not a major issue. Had a peaceful stay with family and overall very satisfied. Definitely much better than a nearby hotel we stayed at earlier, despite this costing less.",
  },
  {
    id: "review-3",
    author: "Jebastin Lara",
    initial: "J",
    rating: 5,
    date: "2 weeks ago",
    text: "Had a very pleasant stay for a very reasonable price. The staff were very helpful too.",
  },
  {
    id: "review-4",
    author: "Senthil Kumaran",
    initial: "S",
    rating: 5,
    date: "5 months ago",
    text: "Great value.\n\nNice rooms.\n\nGood room service.",
  },
  {
    id: "review-5",
    author: "Mani Malan",
    initial: "M",
    rating: 5,
    date: "6 months ago",
    text: "I had a great 3-day stay here! The rooms were lovely and well-maintained, and the location is absolutely perfect. I also really appreciated the helpers; they were polite and provided excellent service. Great place to stay!",
  },
  {
    id: "review-6",
    author: "Suja Manimaran",
    initial: "S",
    rating: 4,
    date: "5 months ago",
    text: "Only price was high for just stay from 1am midnight to morning 10am and ground floor room was noisy due to roadside bypass. Otherwise a good sleep for few hours and easy access, thanks.",
  },
  {
    id: "review-7",
    author: "John Thomas",
    initial: "J",
    rating: 5,
    date: "a year ago",
    text: "Overall a good place to stay for the night. Had to stay for a night with family. Got the large 3 bedroom, was neat and clean. Pricing was fine, staff was also good. Parking is available but not walled but has security cameras.",
  },
] as const;
