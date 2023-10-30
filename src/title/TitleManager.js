import { useEffect } from 'react';

const TitleManager = ({ title }) => {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
};

export default TitleManager;