import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";

// Create Inertia app
createInertiaApp({
    resolve: (name) => {
        // Import all pages from ./pages folder with .js extension
        const pages = import.meta.glob("./pages/**/*.js", { eager: true });

        const page = pages[`./pages/${name}.js`];

        if (!page) {
            throw new Error(
                `Page "${name}" not found. Check the folder structure and spelling.`
            );
        }

        return page.default; // must return default export
    },
    setup({ el, App, props }) {
        // Render Inertia App into DOM
        createRoot(el).render(React.createElement(App, props));
    },
});
