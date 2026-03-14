import { redirect } from 'next/navigation';
import { getAssignment } from '@/lib/assignments-db';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import ResponseButtons from '@/components/assignments/ResponseButtons';

interface Props {
  params: { id: string };
}

export default async function AssignmentPage({ params }: Props) {
  const assignment = await getAssignment(params.id);

  if (!assignment) {
    redirect('/assignments/expired');
  }

  // Check TTL expiry
  const now = Math.floor(Date.now() / 1000);
  if (assignment.ttl && now > assignment.ttl) {
    redirect('/assignments/expired');
  }

  // Already responded
  if (assignment.status === 'accepted' || assignment.status === 'declined') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#222] flex items-center justify-center">
          <span className="text-2xl">
            {assignment.status === 'accepted' ? '\u2713' : '\u2717'}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Already {assignment.status === 'accepted' ? 'Accepted' : 'Declined'}
        </h2>
        <p className="text-gray-400">
          You responded to this assignment on{' '}
          {assignment.respondedAt
            ? new Date(assignment.respondedAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'a previous date'}
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="text-center mb-8">
        <p className="text-[#c8a45e] text-sm font-medium uppercase tracking-wider mb-2">
          Assignment Offer
        </p>
        <h2 className="text-3xl font-bold text-white">{assignment.dealName}</h2>
        <p className="text-gray-400 mt-2">
          Hi {assignment.operatorName}, you have a new assignment from JHR Photography.
        </p>
      </div>

      <AssignmentCard assignment={assignment} />

      {/* Accept / Decline */}
      <div className="pt-4">
        <ResponseButtons assignmentId={assignment.id} operatorName={assignment.operatorName} />
      </div>

      {/* Confidentiality notice */}
      <p className="text-center text-gray-600 text-xs pt-4">
        This assignment sheet is confidential. Do not share or forward this link.
        It expires {new Date(assignment.ttl * 1000).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}.
      </p>
    </div>
  );
}
