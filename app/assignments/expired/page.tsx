export default function AssignmentExpiredPage() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#222] border-2 border-[#555] flex items-center justify-center">
        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-white mb-3">No Longer Available</h2>
      <p className="text-gray-400 max-w-md mx-auto">
        This assignment link has expired or is no longer valid. If you believe this is
        an error, please contact the ops manager directly.
      </p>
    </div>
  );
}
