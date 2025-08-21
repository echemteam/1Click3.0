// app/layout.js
import React from 'react';
import './globals.scss';
import ReduxProvider from '../features/layout/ReduxProvider';
import Header from '@components/header/Header';
import Footer from '@components/footer/Footer';
import FloatingButton from '@components/ui/floatingButton/FloatingButton'
import Breadcrumb from '@components/ui/breadcrumb/BreadCrumb';
import { TabProvider } from '@features/context/TabContext';

export const metadata = {
  title: '1Click Chemistry',
  description: 'One-click e-commerce platform for chemicals.',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReduxProvider>
          <div className='main-layout-section'>
            <div className='header-section'>
              <TabProvider>
                <Header />
              </TabProvider>
            </div>
            <Breadcrumb />
            <div className='body-section'>
              <main>
                {children}
              </main>
            </div>
            <div className='footer-section'>
              <Footer />
            </div>
          </div>
        </ReduxProvider>
        <FloatingButton />
      </body>
    </html>
  );
};

export default RootLayout;
