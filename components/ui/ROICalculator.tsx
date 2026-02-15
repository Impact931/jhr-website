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
  Settings,
  X,
  Plus,
} from "lucide-react";
import { useEditMode } from "@/context/inline-editor/EditModeContext";

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
  const { isEditMode, canEdit } = useEditMode();
  const showEditControls = canEdit && isEditMode;

  const [attendees, setAttendees] = useState(500);
  const [leadValue, setLeadValue] = useState(50);

  // Editable parameters
  const [showParams, setShowParams] = useState(false);
  const [participationRate, setParticipationRate] = useState(0.4);
  const [dwellMinPerPerson, setDwellMinPerPerson] = useState(5);
  const [engagementValuePerMin, setEngagementValuePerMin] = useState(0.5);
  const [attendeesMin, setAttendeesMin] = useState(100);
  const [attendeesMax, setAttendeesMax] = useState(2000);
  const [attendeesStep, setAttendeesStep] = useState(50);
  const [leadValueMin, setLeadValueMin] = useState(10);
  const [leadValueMax, setLeadValueMax] = useState(200);
  const [leadValueStep, setLeadValueStep] = useState(5);
  const [benefits, setBenefits] = useState([
    "Contact data delivered in real-time",
    "AI-retouched photos in under 5 minutes",
    "Branded image overlays with your logo",
    "Social sharing drives organic reach",
    "Warm leads vs. cold outreach",
    "Memorable attendee experience",
  ]);

  // Calculations
  const estimatedParticipants = Math.round(attendees * participationRate);
  const leadsCapture = estimatedParticipants;
  const leadsCaptureValue = leadsCapture * leadValue;

  // Dwell time value
  const dwellTimeMinutes = estimatedParticipants * dwellMinPerPerson;
  const dwellTimeValue = Math.round(dwellTimeMinutes * engagementValuePerMin);

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

      {/* Edit mode: parameter controls */}
      {showEditControls && (
        <div className="mb-6">
          <button
            onClick={() => setShowParams(!showParams)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#C9A227]/20 border border-[#C9A227]/40 rounded-lg text-xs font-medium text-[#C9A227] hover:bg-[#C9A227]/30 transition-colors"
          >
            <Settings size={14} />
            {showParams ? "Hide" : "Edit"} Calculator Parameters
          </button>
          {showParams && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-black/30 border border-[#C9A227]/30 rounded-xl">
              <div>
                <label className="block text-[10px] text-[#C9A227] uppercase tracking-wider mb-1">Attendees Min</label>
                <input type="number" value={attendeesMin} onChange={(e) => setAttendeesMin(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-black/50 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A227]" />
              </div>
              <div>
                <label className="block text-[10px] text-[#C9A227] uppercase tracking-wider mb-1">Attendees Max</label>
                <input type="number" value={attendeesMax} onChange={(e) => setAttendeesMax(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-black/50 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A227]" />
              </div>
              <div>
                <label className="block text-[10px] text-[#C9A227] uppercase tracking-wider mb-1">Attendees Step</label>
                <input type="number" value={attendeesStep} onChange={(e) => setAttendeesStep(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-black/50 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A227]" />
              </div>
              <div>
                <label className="block text-[10px] text-[#C9A227] uppercase tracking-wider mb-1">Lead Value Min ($)</label>
                <input type="number" value={leadValueMin} onChange={(e) => setLeadValueMin(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-black/50 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A227]" />
              </div>
              <div>
                <label className="block text-[10px] text-[#C9A227] uppercase tracking-wider mb-1">Lead Value Max ($)</label>
                <input type="number" value={leadValueMax} onChange={(e) => setLeadValueMax(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-black/50 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A227]" />
              </div>
              <div>
                <label className="block text-[10px] text-[#C9A227] uppercase tracking-wider mb-1">Lead Value Step ($)</label>
                <input type="number" value={leadValueStep} onChange={(e) => setLeadValueStep(Number(e.target.value))}
                  className="w-full px-2 py-1 bg-black/50 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A227]" />
              </div>
              <div>
                <label className="block text-[10px] text-[#C9A227] uppercase tracking-wider mb-1">Participation Rate (%)</label>
                <input type="number" value={Math.round(participationRate * 100)} onChange={(e) => setParticipationRate(Number(e.target.value) / 100)}
                  min={1} max={100}
                  className="w-full px-2 py-1 bg-black/50 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A227]" />
              </div>
              <div>
                <label className="block text-[10px] text-[#C9A227] uppercase tracking-wider mb-1">Dwell Min/Person</label>
                <input type="number" value={dwellMinPerPerson} onChange={(e) => setDwellMinPerPerson(Number(e.target.value))}
                  min={1}
                  className="w-full px-2 py-1 bg-black/50 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A227]" />
              </div>
              <div>
                <label className="block text-[10px] text-[#C9A227] uppercase tracking-wider mb-1">$/Min Engagement</label>
                <input type="number" value={engagementValuePerMin} step={0.1} onChange={(e) => setEngagementValuePerMin(Number(e.target.value))}
                  min={0.1}
                  className="w-full px-2 py-1 bg-black/50 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A227]" />
              </div>
            </div>
          )}
        </div>
      )}

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
            min={attendeesMin}
            max={attendeesMax}
            step={attendeesStep}
            value={attendees}
            onChange={(e) => setAttendees(Number(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-jhr-gold ${isDark ? 'bg-jhr-black-lighter' : 'bg-gray-200'}`}
          />
          <div
            className={`flex justify-between text-xs mt-1 ${
              isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
            }`}
          >
            <span>{attendeesMin.toLocaleString()}</span>
            <span>{attendeesMax.toLocaleString()}</span>
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
            min={leadValueMin}
            max={leadValueMax}
            step={leadValueStep}
            value={leadValue}
            onChange={(e) => setLeadValue(Number(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-jhr-gold ${isDark ? 'bg-jhr-black-lighter' : 'bg-gray-200'}`}
          />
          <div
            className={`flex justify-between text-xs mt-1 ${
              isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
            }`}
          >
            <span>${leadValueMin}</span>
            <span>${leadValueMax}</span>
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
          {benefits.map((benefit, i) => (
            <li
              key={i}
              className={`flex items-center gap-2 text-body-sm ${
                isDark ? "text-jhr-white-dim" : "text-jhr-light-text-muted"
              }`}
            >
              <CheckCircle size={16} className="text-jhr-gold flex-shrink-0" />
              {showEditControls ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => {
                      const updated = [...benefits];
                      updated[i] = e.target.value;
                      setBenefits(updated);
                    }}
                    className="flex-1 bg-transparent border-b border-gray-600 focus:border-[#C9A227] text-sm px-1 py-0.5 focus:outline-none"
                  />
                  <button
                    onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))}
                    className="text-gray-500 hover:text-red-400 p-0.5"
                    title="Remove"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                benefit
              )}
            </li>
          ))}
        </ul>
        {showEditControls && (
          <button
            onClick={() => setBenefits([...benefits, "New benefit"])}
            className="mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-[#C9A227] transition-colors"
          >
            <Plus size={14} /> Add benefit
          </button>
        )}
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
