"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface ROICalculatorProps {
  variant?: "dark" | "light";
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export function ROICalculator({
  variant = "dark",
  showCTA = true,
  ctaText = "Schedule a Strategy Call",
  ctaHref = "/schedule",
}: ROICalculatorProps) {
  const [attendees, setAttendees] = useState(500);
  const [leadValue, setLeadValue] = useState(50);
  const [participationRate] = useState(0.4); // 40% participation rate assumption

  // Calculations
  const estimatedParticipants = Math.round(attendees * participationRate);
  const leadsCapture = estimatedParticipants;
  const leadsCaptureValue = leadsCapture * leadValue;

  // Dwell time value: ~5 min per participant at booth = brand exposure
  const dwellTimeMinutes = estimatedParticipants * 5;
  const dwellTimeValue = Math.round(dwellTimeMinutes * 0.5); // ~$0.50/min of engagement value

  // Total ROI
  const totalValue = leadsCaptureValue + dwellTimeValue;

  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-2xl p-8 md:p-12 border ${
        isDark
          ? "bg-jhr-black-light border-jhr-black-lighter"
          : "bg-white border-jhr-light-border shadow-lg"
      }`}
    >
      <div className="text-center mb-10">
        <h3
          className={`text-display-sm font-display font-bold mb-3 ${
            isDark ? "text-jhr-white" : "text-jhr-black"
          }`}
        >
          Activation <span className="text-jhr-gold">ROI Calculator</span>
        </h3>
        <p className={isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"}>
          See the value a Headshot Activation brings to your event or booth
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Attendees Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label
              className={`flex items-center gap-2 font-medium ${
                isDark ? "text-jhr-white" : "text-jhr-black"
              }`}
            >
              <Users size={18} className="text-jhr-gold" />
              Expected Attendees
            </label>
            <span className="text-heading-lg font-display font-bold text-jhr-gold">
              {attendees.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={attendees}
            onChange={(e) => setAttendees(Number(e.target.value))}
            className="w-full h-2 bg-jhr-black-lighter rounded-lg appearance-none cursor-pointer accent-jhr-gold"
          />
          <div
            className={`flex justify-between text-xs mt-1 ${
              isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
            }`}
          >
            <span>100</span>
            <span>2,000</span>
          </div>
        </div>

        {/* Lead Value Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label
              className={`flex items-center gap-2 font-medium ${
                isDark ? "text-jhr-white" : "text-jhr-black"
              }`}
            >
              <DollarSign size={18} className="text-jhr-gold" />
              Average Lead Value
            </label>
            <span className="text-heading-lg font-display font-bold text-jhr-gold">
              {formatCurrency(leadValue)}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={leadValue}
            onChange={(e) => setLeadValue(Number(e.target.value))}
            className="w-full h-2 bg-jhr-black-lighter rounded-lg appearance-none cursor-pointer accent-jhr-gold"
          />
          <div
            className={`flex justify-between text-xs mt-1 ${
              isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
            }`}
          >
            <span>$10</span>
            <span>$200</span>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* Leads Captured */}
        <motion.div
          key={`leads-${leadsCapture}`}
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-xl p-6 text-center border ${
            isDark
              ? "bg-jhr-black border-jhr-black-lighter"
              : "bg-jhr-light border-jhr-light-border"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users size={18} className="text-jhr-gold" />
            <span
              className={`text-sm ${
                isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
              }`}
            >
              Leads Captured
            </span>
          </div>
          <div
            className={`text-display-sm font-display font-bold ${
              isDark ? "text-jhr-white" : "text-jhr-black"
            }`}
          >
            {leadsCapture.toLocaleString()}
          </div>
          <div
            className={`text-body-sm mt-1 ${
              isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
            }`}
          >
            ≈ {formatCurrency(leadsCaptureValue)} value
          </div>
        </motion.div>

        {/* Dwell Time */}
        <motion.div
          key={`dwell-${dwellTimeMinutes}`}
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-xl p-6 text-center border ${
            isDark
              ? "bg-jhr-black border-jhr-black-lighter"
              : "bg-jhr-light border-jhr-light-border"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock size={18} className="text-jhr-gold" />
            <span
              className={`text-sm ${
                isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
              }`}
            >
              Dwell Time
            </span>
          </div>
          <div
            className={`text-display-sm font-display font-bold ${
              isDark ? "text-jhr-white" : "text-jhr-black"
            }`}
          >
            {Math.round(dwellTimeMinutes / 60)}+ hrs
          </div>
          <div
            className={`text-body-sm mt-1 ${
              isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
            }`}
          >
            ≈ {formatCurrency(dwellTimeValue)} engagement
          </div>
        </motion.div>

        {/* Total ROI */}
        <motion.div
          key={`total-${totalValue}`}
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-jhr-gold/10 rounded-xl p-6 text-center border border-jhr-gold/30"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp size={18} className="text-jhr-gold" />
            <span
              className={`text-sm ${
                isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
              }`}
            >
              Total Value
            </span>
          </div>
          <div className="text-display-sm font-display font-bold text-jhr-gold">
            {formatCurrency(totalValue)}
          </div>
          <div
            className={`text-body-sm mt-1 ${
              isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
            }`}
          >
            activation ROI
          </div>
        </motion.div>
      </div>

      {/* Benefits List */}
      <div
        className={`rounded-xl p-6 mb-8 border ${
          isDark
            ? "bg-jhr-black border-jhr-black-lighter"
            : "bg-jhr-light border-jhr-light-border"
        }`}
      >
        <h4
          className={`font-display font-semibold mb-4 ${
            isDark ? "text-jhr-white" : "text-jhr-black"
          }`}
        >
          What You Get:
        </h4>
        <ul className="grid md:grid-cols-2 gap-3">
          {[
            "Contact data delivered in real-time",
            "AI-retouched photos in under 5 minutes",
            "Branded image overlays with your logo",
            "Social sharing drives organic reach",
            "Warm leads vs. cold outreach",
            "Memorable attendee experience",
          ].map((benefit, i) => (
            <li
              key={i}
              className={`flex items-center gap-2 text-body-sm ${
                isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
              }`}
            >
              <CheckCircle size={16} className="text-jhr-gold flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      {showCTA && (
        <div className="text-center">
          <Link href={ctaHref} className="btn-primary">
            {ctaText}
            <ArrowRight size={18} className="ml-2" />
          </Link>
          <p
            className={`text-body-sm mt-3 ${
              isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
            }`}
          >
            Get a custom proposal for your event
          </p>
        </div>
      )}
    </div>
  );
}
