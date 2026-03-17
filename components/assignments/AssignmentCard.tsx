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
  const hasSchedule = assignment.schedule && assignment.schedule.length > 0;
  const hasShotList = assignment.shotList && assignment.shotList.length > 0;

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

      {/* Multi-Day Schedule (from page content) */}
      {hasSchedule ? (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
          <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left text-gray-500 text-xs uppercase tracking-wider pb-3 pr-4">Assignment</th>
                  <th className="text-left text-gray-500 text-xs uppercase tracking-wider pb-3 pr-4">Date</th>
                  <th className="text-left text-gray-500 text-xs uppercase tracking-wider pb-3 pr-4">Show Time</th>
                  <th className="text-left text-gray-500 text-xs uppercase tracking-wider pb-3 pr-4">Start</th>
                  <th className="text-left text-gray-500 text-xs uppercase tracking-wider pb-3 pr-4">End</th>
                  {assignment.schedule!.some(s => s.attire) && (
                    <th className="text-left text-gray-500 text-xs uppercase tracking-wider pb-3 pr-4">Attire</th>
                  )}
                  {assignment.schedule!.some(s => s.gear) && (
                    <th className="text-left text-gray-500 text-xs uppercase tracking-wider pb-3">Gear</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {assignment.schedule!.map((entry, i) => (
                  <tr key={i} className="border-b border-[#222]">
                    <td className="py-3 pr-4 text-white font-medium">{entry.assignment || '-'}</td>
                    <td className="py-3 pr-4 text-gray-300">{entry.date || '-'}</td>
                    <td className="py-3 pr-4 text-[#c8a45e] font-medium">{entry.showTime || '-'}</td>
                    <td className="py-3 pr-4 text-gray-300">{entry.startTime || '-'}</td>
                    <td className="py-3 pr-4 text-gray-300">{entry.endTime || '-'}</td>
                    {assignment.schedule!.some(s => s.attire) && (
                      <td className="py-3 pr-4 text-gray-300">{entry.attire || '-'}</td>
                    )}
                    {assignment.schedule!.some(s => s.gear) && (
                      <td className="py-3 text-gray-300">{entry.gear || '-'}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {assignment.schedule!.some(s => s.location) && (
            <div className="mt-4 pt-4 border-t border-[#333]">
              {assignment.schedule!.filter(s => s.location).map((entry, i) => (
                <p key={i} className="text-gray-400 text-sm">
                  <span className="text-gray-500">{entry.date}:</span> {entry.location}
                </p>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Fallback: single-day schedule from properties */
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
      )}

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

      {/* Shot List */}
      {hasShotList && (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
          <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">Shot List</h3>
          <div className="space-y-4">
            {assignment.shotList!.map((entry, i) => (
              <div key={i}>
                <p className="text-white font-medium">{entry.heading}</p>
                {entry.details && (
                  <p className="text-gray-400 text-sm mt-1">{entry.details}</p>
                )}
                {entry.items && entry.items.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {entry.items.map((item, j) => (
                      <li key={j} className="text-gray-300 text-sm pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:bg-[#c8a45e] before:rounded-full">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
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

      {/* Parking Info */}
      {assignment.parkingInfo && (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
          <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">Parking</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{assignment.parkingInfo}</p>
        </div>
      )}

      {/* Maps & References */}
      {assignment.mapsAndReferences && (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
          <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">Maps & References</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap break-all">{assignment.mapsAndReferences}</p>
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

      {/* Other Info */}
      {assignment.otherInfo && (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
          <h3 className="text-[#c8a45e] font-semibold text-lg mb-4">Additional Notes</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{assignment.otherInfo}</p>
        </div>
      )}
    </div>
  );
}
