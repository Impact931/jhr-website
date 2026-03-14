import type { Assignment } from '@/lib/assignments-types';

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
    });
  } catch {
    return iso;
  }
}

export default function AssignmentCard({ assignment }: { assignment: Assignment }) {
  return (
    <div className="space-y-4">
      {/* Details card */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
        <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">Assignment Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Client</p>
            <p className="text-white">{assignment.clientName || 'TBD'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Pay</p>
            <p className="text-green-400 text-xl font-bold">{assignment.totalPay || 'TBD'}</p>
          </div>
        </div>
      </div>

      {/* Schedule card */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
        <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">Schedule</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 text-sm min-w-[100px]">Show Time</span>
            <span className="text-white text-right">{formatTime(assignment.showTime)}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-500 text-sm min-w-[100px]">Start</span>
            <span className="text-white text-right">{formatTime(assignment.startTime)}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-500 text-sm min-w-[100px]">End</span>
            <span className="text-white text-right">{formatTime(assignment.endTime)}</span>
          </div>
        </div>
      </div>

      {/* Location card */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
        <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">Location</h3>
        <p className="text-white text-lg">{assignment.venue || 'TBD'}</p>
        {assignment.venueAddress && (
          <p className="text-gray-400 mt-1">{assignment.venueAddress}</p>
        )}
        {assignment.googleMapsUrl && (
          <a
            href={assignment.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-[#c8a45e] text-sm hover:underline"
          >
            Open in Google Maps &rarr;
          </a>
        )}
        {assignment.locationNotes && (
          <div className="mt-4 pt-4 border-t border-[#333]">
            <p className="text-gray-500 text-sm mb-1">Location Notes</p>
            <p className="text-gray-300 text-sm">{assignment.locationNotes}</p>
          </div>
        )}
      </div>

      {/* Point of Contact */}
      {assignment.pocName && (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
          <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">Point of Contact</h3>
          <p className="text-white">{assignment.pocName}</p>
          {assignment.pocPhone && (
            <a href={`tel:${assignment.pocPhone}`} className="text-[#c8a45e] text-sm hover:underline">
              {assignment.pocPhone}
            </a>
          )}
        </div>
      )}

      {/* Briefing */}
      {assignment.assignmentBriefing && (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
          <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">Your Assignment</h3>
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {assignment.assignmentBriefing}
          </div>
        </div>
      )}

      {/* What to Bring */}
      {(assignment.attire || assignment.gear) && (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
          <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">What to Bring</h3>
          {assignment.attire && (
            <div className="mb-3">
              <p className="text-gray-500 text-sm">Attire</p>
              <p className="text-white">{assignment.attire}</p>
            </div>
          )}
          {assignment.gear && (
            <div>
              <p className="text-gray-500 text-sm">Gear</p>
              <p className="text-white">{assignment.gear}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
