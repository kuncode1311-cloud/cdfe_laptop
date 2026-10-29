import { redirect } from 'next/navigation';
import { layDuongDanAdmin } from '@/app/admin/constants/admin-routes';

// Giữ tương thích các liên kết /admin?tab=... đã có trước đây.
export default async function AdminPage({ searchParams }) {
    const { tab } = await searchParams;
    redirect(layDuongDanAdmin(tab));
}
