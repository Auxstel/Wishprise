import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaProps {
    data: object;
}

export const Schema: React.FC<SchemaProps> = ({ data }) => {
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(data)}
            </script>
        </Helmet>
    );
};
