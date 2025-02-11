import { auth } from '@/auth';
import Main from './main';

  export default async function DashboardAnalysis({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const session = await auth(); 
  const user = session?.user;

  return <Main user={user} slug={slug} />;
}