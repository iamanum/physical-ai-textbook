// textbook/src/theme/Layout/index.js
import React from 'react';
import Layout from '@theme-original/Layout';
import FloatingChatButton from '@site/src/components/FloatingChatButton';

export default function LayoutWrapper(props) {
  return (
    <>
      <Layout {...props}>
        {props.children}
        <FloatingChatButton />
      </Layout>
    </>
  );
}