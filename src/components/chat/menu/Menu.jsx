import { Suspense, useState } from 'react';
import React from 'react';

import { Box } from '@mui/material';

//components
import Header from './Header';
import Search from './Search';
const Conversations = React.lazy(() => import('./Conversations'))

const Menu = () => {
    const [text, setText] = useState('');

    return (
        <Box>
            <Header />
            <Search setText={setText} />
            <Suspense fallback={<p>Loading Users...</p>}>
                <Conversations text={text} />
            </Suspense>
        </Box>
    )
}

export default Menu;