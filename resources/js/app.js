import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.js", { eager: true });

        const page = pages[`./pages/${name}.js`];

        if (!page) {
            throw new Error(
                `Page "${name}" not found. Check the folder structure and spelling.`
            );
        }

        return page.default;
    },
    setup({ el, App, props }) {
        createRoot(el).render(React.createElement(App, props));
    },
});
