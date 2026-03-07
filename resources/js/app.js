import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { AuthProvider } from "./context/AuthContext.js";
import { SidebarProvider } from "./context/SidebarContext.js";
import AuthSync from "./components/AuthSync.js";
import AdminLayout from "./components/Layout/AdminLayout.js";
import './i18n/config.js';
import '../css/app.css'

const pagesWithoutSidebar = [
    'Login/Login',
    'Signup/Signup',
    'ForgotPassword/ForgotPassword',
];

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.{js,jsx}", { eager: true });
        const page = pages[`./pages/${name}.js`] || pages[`./pages/${name}.jsx`];
        if (!page) {
            throw new Error(`Page "${name}" not found.`);
        }
        const PageComponent = page.default;
        const useSidebarLayout = !pagesWithoutSidebar.includes(name);

        return function WrappedPage() {
            const content = (
                <>
                    <AuthSync />
                    <PageComponent />
                </>
            );
            return useSidebarLayout ? <AdminLayout>{content}</AdminLayout> : content;
        };
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <AuthProvider>
                <SidebarProvider>
                    <App {...props} />
                </SidebarProvider>
            </AuthProvider>
        );
    },
});