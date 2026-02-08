import "./bootstrap";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./contexts/CartContext";

createInertiaApp({
    resolve: (name) => {
        // Debug: Log halaman yang di-resolve
        console.log(`📄 Resolving page: ${name}`);

        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Debug: Log props yang diterima
        console.log("🔄 Inertia props:", props);

        root.render(
            <CartProvider>
                <App {...props} />
            </CartProvider>,
        );
    },
});
