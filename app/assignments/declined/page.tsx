export default function AssignmentDeclinedPage() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#222] border-2 border-[#555] flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-white mb-3">Assignment Declined</h2>
      <p className="text-gray-400 max-w-md mx-auto">
        Your response has been recorded. The ops manager has been notified and will
        reassign this gig. No further action is needed on your part.
      </p>
    </div>
  );
}
