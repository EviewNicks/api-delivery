import type { HouseCafeReservationEnriched } from '@/lib/types';

interface ReservationStatusBadgeProps {
  status: HouseCafeReservationEnriched['status'];
}

export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  const isUpcoming = status === 'upcoming';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isUpcoming
          ? 'bg-green-100 text-green-800'
          : 'bg-neutral-100 text-neutral-600'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full mr-2 ${
          isUpcoming ? 'bg-green-500' : 'bg-neutral-400'
        }`}
      ></span>
      {isUpcoming ? 'Mendatang' : 'Selesai'}
    </span>
  );
}
