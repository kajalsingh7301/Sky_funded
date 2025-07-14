import React from "react";
import "./TradersFeedback.css";
import EthereumIcon from "../Assets/payment_method_img1.jpg";
import BitcoinIcon from "../Assets/payment_method_img2.jpg";
import USDCIcon from "../Assets/payment_method_img3.jpg";
import PayPalIcon from "../Assets/payment_method_img4.jpg";
import MasterCardIcon from "../Assets/payment_method_img1.jpg";
import VisaIcon from "../Assets/payment_method_img2.jpg";
import p1 from "../Assets/p1.jpg";
import p2 from "../Assets/p2.jpg";
import p3 from "../Assets/p3.jpg";
import p4 from "../Assets/p4.jpg";
import p5 from "../Assets/p5.jpg";
import p6 from "../Assets/p6.jpg";
import p7 from "../Assets/p7.jpg";
import p8 from "../Assets/p8.jpg";
import p9 from "../Assets/p9.jpg";

const feedbacks = [
  {
    name: "Abdiirsak Faysal",
    daysAgo: "3 days ago",
    title: "Loving this prop firm!",
    message:
      "The tools provided really helped me pass phase one. Looking forward to becoming a funded trader soon.",
    rating: 5,
  },
  {
    name: "Joe T",
    daysAgo: "4 days ago",
    title: "Great support and environment",
    message:
      "The company offers excellent support and a transparent evaluation process. ",
    rating: 5,
  },
  {
    name: "Ali Abolhosseini",
    daysAgo: "5 days ago",
    title: "Good experience overall",
    message:
      "Quick support and clear process, though I'd like to see a better profit split for advanced traders.",
    rating: 4,
  },
  {
    name: "Samantha Green",
    daysAgo: "2 days ago",
    title: "Fantastic prop firm",
    message:
      "The platform is very user-friendly and the staff are always helpful. Passed my evaluation with ease.",
    rating: 5,
  },
  {
    name: "Carlos Mendez",
    daysAgo: "1 week ago",
    title: "Very professional and supportive",
    message:
      "Appreciate the tools and resources that make trading smoother. Great company culture too!",
    rating: 4,
  },
  {
    name: "Leila Ahmed",
    daysAgo: "3 days ago",
    title: "Great learning experience",
    message:
      "Learned a lot during the evaluation phase. The feedback was constructive and encouraging.",
    rating: 5,
  },
  {
    name: "Nate Rogers",
    daysAgo: "4 days ago",
    title: "Highly recommend",
    message:
      "If you're serious about trading, this firm offers everything you need to succeed.",
    rating: 5,
  },
  {
    name: "Maya Patel",
    daysAgo: "6 days ago",
    title: "Smooth evaluation process",
    message:
      "The evaluation was challenging but fair. The support team was very responsive to my queries.",
    rating: 4,
  },
  {
    name: "Ethan Brooks",
    daysAgo: "5 days ago",
    title: "Excellent platform",
    message:
      "Clean interface, helpful tools, and reliable payouts. I’m happy to be part of this prop firm.",
    rating: 5,
  },
  {
    name: "Isabella Chen",
    daysAgo: "2 days ago",
    title: "Professional and transparent",
    message:
      "Everything was clear from day one, and the profit splits are competitive. Would definitely recommend.",
    rating: 5,
  },
  {
    name: "Liam Johnson",
    daysAgo: "1 week ago",
    title: "Great community",
    message:
      "Besides good tools, the trader community is very supportive, which makes a difference.",
    rating: 4,
  },
  {
    name: "Sophia Martinez",
    daysAgo: "3 days ago",
    title: "Impressed with customer service",
    message:
      "The team helped me through every step. Very patient and knowledgeable staff.",
    rating: 5,
  },
  {
    name: "Sophia Martinez",
    daysAgo: "3 days ago",
    title: "Impressed with customer service",
    message:
      "The team helped me through every step. Very patient and knowledgeable staff.",
    rating: 5,
  },
  // New feedbacks below
  {
    name: "James O'Connor",
    daysAgo: "1 day ago",
    title: "Smooth onboarding",
    message:
      "From signup to the first trade, everything went smoothly. Instructions were clear and onboarding was fast.",
    rating: 5,
  },
  {
    name: "Fatima Noor",
    daysAgo: "2 days ago",
    title: "Great dashboard tools",
    message:
      "The tools on the dashboard are intuitive and very helpful. Love the real-time metrics.",
    rating: 4,
  },
  {
    name: "Dmitry Ivanov",
    daysAgo: "4 days ago",
    title: "Best prop firm so far",
    message:
      "I’ve tried a few firms, but this one stands out in terms of transparency and community support.",
    rating: 5,
  },
  {
    name: "Chen Wu",
    daysAgo: "1 week ago",
    title: "Fair rules and fast payouts",
    message:
      "Evaluation was fair and payouts were processed quickly. Great experience overall.",
    rating: 5,
  },
  {
    name: "Zara Khan",
    daysAgo: "5 days ago",
    title: "Helpful community and support",
    message:
      "I got stuck during my challenge and the support team responded quickly. ",
    rating: 4,
  },
];


const paymentMethods = [
  { name: "Ethereum", icon: EthereumIcon },
  { name: "Bitcoin", icon: BitcoinIcon },
  { name: "USDC", icon: USDCIcon },
  { name: "PayPal", icon: PayPalIcon },
  { name: "MasterCard", icon: MasterCardIcon },
  { name: "Visa", icon: VisaIcon },
  { name: "Elo", icon: p1 },
  { name: "Elo", icon: p2 },
  { name: "Elo", icon: p3 },
  { name: "Elo", icon: p4 },
  { name: "Elo", icon: p5 },
  { name: "Elo", icon: p6 },
  { name: "Elo", icon: p7 },
  { name: "Elo", icon: p8 },
  { name: "Elo", icon: p9 },
];

const FeedbackSection = () => {
  return (
    <div className="feedback-container">
      <div className="feed-back-div">
        <h2 className="feedback-title-1">
          Traders <span className="highlight">Feedback</span>
        </h2>
        <p className="feedback-subtitle">
          Sky Funded stands out with traders like you! Discover what real
          traders are saying about our top-tier prop trading firm.
        </p>
        <p className="rating">
          <span className="stars">★★★★★</span> Excellent - Rated 4.9 / 5 based on
          6230 reviews on Trustpilot
        </p>

        <div className="feedback-grid">
          {feedbacks.map((feedback, index) => (
            <div className="feedback-card" key={index}>
              <div className="feedback-stars">
                {"★".repeat(feedback.rating)}
                {"☆".repeat(5 - feedback.rating)}
              </div>
              <p className="feedback-name">
                {feedback.name}, {feedback.daysAgo}
              </p>
              <h3 className="feedback-title">{feedback.title}</h3>
              <p className="feedback-message">{feedback.message}</p>
            </div>
          ))}
        </div>

        <h2 className="payment-title">Available Payment Methods</h2>
        <div className="payment-scroll-container">
          <div className="payment-methods">
            {[...paymentMethods, ...paymentMethods].map((method, index) => (
              <div className="payment-card" key={index}>
                <img
                  src={method.icon}
                  alt={method.name}
                  className="payment-icon"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;




