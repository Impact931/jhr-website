'use client';

import { useState } from 'react';

interface ResponseButtonsProps {
  assignmentId: string;
  operatorName: string;
}

export default function ResponseButtons({ assignmentId, operatorName }: ResponseButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [error, setError] = useState('');

  async function handleResponse(action: 'accept' | 'decline') {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/assignments/respond/${assignmentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ...(action === 'decline' && declineReason ? { declineReason } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      // Redirect to confirmation page
      window.location.href = data.redirect;
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg mb-2">Your Response</h3>
      <p className="text-gray-400 text-sm mb-6">
        {operatorName}, please accept or decline this assignment.
      </p>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {!showDeclineForm ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleResponse('accept')}
            disabled={loading}
            className="flex-1 min-h-[48px] px-6 py-3 bg-[#c8a45e] hover:bg-[#b8943e] text-[#111] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Accept Assignment'}
          </button>
          <button
            onClick={() => setShowDeclineForm(true)}
            disabled={loading}
            className="flex-1 min-h-[48px] px-6 py-3 bg-transparent border border-[#555] hover:border-red-500 hover:text-red-400 text-gray-400 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Decline
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="decline-reason" className="block text-gray-400 text-sm mb-2">
              Reason for declining (optional)
            </label>
            <textarea
              id="decline-reason"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g., Schedule conflict, unavailable that day..."
              className="w-full bg-[#222] border border-[#444] rounded-lg p-3 text-white placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-[#c8a45e]"
              rows={3}
              disabled={loading}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleResponse('decline')}
              disabled={loading}
              className="flex-1 min-h-[48px] px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Decline'}
            </button>
            <button
              onClick={() => {
                setShowDeclineForm(false);
                setDeclineReason('');
              }}
              disabled={loading}
              className="min-h-[48px] px-6 py-3 bg-transparent border border-[#555] text-gray-400 font-medium rounded-lg transition-colors hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
