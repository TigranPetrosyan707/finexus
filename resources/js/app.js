import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { AuthProvider } from "./context/AuthContext.js";
import './i18n/config.js';
import '../css/app.css'

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.{js,jsx}", { eager: true });
        const page = pages[`./pages/${name}.js`] || pages[`./pages/${name}.jsx`];
        if (!page) {
            throw new Error(`Page "${name}" not found.`);
        }
        return page.default;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <AuthProvider>
                <App {...props} />
            </AuthProvider>
        );
    },
});