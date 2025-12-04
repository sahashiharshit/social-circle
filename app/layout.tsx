
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import {Toaster} from "sonner";
export const metadata = {
    title: 'Social circle',
    description: 'A Blog and image posting app.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster richColors closeButton/>
                </ThemeProvider>
            </body>
        </html>
    );
}