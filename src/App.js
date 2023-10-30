import { lazy, Suspense } from 'react';

import { GoogleOAuthProvider } from '@react-oauth/google'
import AccountProvider from "./context/AccountProvider";

import Loader from './components/Loader/Loader';

const Messenger = lazy(() => import('./components/Messenger'))


const App = () => {
    const clientId = '94553721167-clh0t57pq0uhr9b1tkr4ij58p1s3e5lg.apps.googleusercontent.com'

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <AccountProvider>
                <Suspense fallback={<Loader />}>
                    <Messenger />
                </Suspense>
            </AccountProvider>
        </GoogleOAuthProvider>
    )
}

export default App;
