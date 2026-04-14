// Simple login page

import { useOktaAuth } from "@okta/okta-react";

export default function LoginPage() {
    const { OktaAuth, authState } = useOktaAuth();

    // If already logged in, send user to dashboard
    if (authState?.isAuthenticated) {
        window.location.replace('/dashboard');
        return null;
    }

    return (
        <div>
            <h1>OSS Dev Analytics</h1>
            <p>please login to continue</p>

            <button onClick={() => oktaAuth.signInWithRedirect()}>
                login with okta
            </button>
        </div>
    );
}