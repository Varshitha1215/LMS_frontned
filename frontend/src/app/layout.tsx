import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeContextProvider } from '@/context/ThemeContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { AchievementsProvider } from '@/context/AchievementsContext';
import { UserManagementProvider } from '@/context/UserManagementContext';

export const metadata: Metadata = {
  title: "CodeJudge - Online Code Compiler",
  description: "A secure, scalable online code compiler and judge system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ key: 'css' }}>
          <ThemeContextProvider>
            <UserManagementProvider>
              <EnrollmentProvider>
                <AchievementsProvider>
                  {children}
                </AchievementsProvider>
              </EnrollmentProvider>
            </UserManagementProvider>
          </ThemeContextProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}