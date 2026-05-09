import { Suspense, useState } from 'react';
import React from 'react';

import { Box } from '@mui/material';

//components
import Header from './Header';
import Search from './Search';
import Loader from '../../Loader/Loader';
const Conversations = React.lazy(() => import('./Conversations'))

const Menu = () => {
    const [text, setText] = useState('');

    return (
        <Box>
            <Header />
            <Search setText={setText} />
            <Suspense fallback={<Loader fill message="Loading users..." />}>
                <Conversations text={text} />
            </Suspense>
        </Box>
    )
}

export default Menu;
