import { fetchAcademic } from '../../lib/api';
import ProfileView from '../../components/ProfileView';

export default async function Page({ params }: { params: { slug: string } }) {
    const academic = await fetchAcademic(params.slug);

    if (!academic) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-xl font-bold text-red-500">Academic not found</h1>
            </div>
        );
    }

    return <ProfileView academic={academic} />;
}
