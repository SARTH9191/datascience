import { redirect } from 'next/navigation';

export default async function OldCaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/app/cases/${id}`);
}
