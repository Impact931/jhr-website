export default function AssignmentAcceptedPage() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-900/30 border-2 border-green-500 flex items-center justify-center">
        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-white mb-3">Assignment Accepted</h2>
      <p className="text-gray-400 max-w-md mx-auto mb-6">
        Thank you for accepting this assignment. A confirmation email has been sent with
        all the details. The ops manager has been notified.
      </p>
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 max-w-md mx-auto">
        <h3 className="text-[#c8a45e] font-semibold mb-2">What happens next?</h3>
        <ul className="text-gray-400 text-sm space-y-2 text-left">
          <li>Check your email for the confirmation with full event details</li>
          <li>Review venue directions and parking information</li>
          <li>Prepare your gear as specified in the assignment</li>
          <li>Arrive at the venue by your listed show time</li>
        </ul>
      </div>
    </div>
  );
}
