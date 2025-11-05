import MemberProfile from '@/components/MemberProfile';

export default function MemberProfilePage({ params }: { params: { id: string } }) {
  return <MemberProfile memberId={params.id} />;
}

