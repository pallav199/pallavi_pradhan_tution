'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to login page with signup mode
        router.push('/login');
    }, [router]);

    return null;
}
