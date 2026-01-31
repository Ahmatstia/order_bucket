import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function CustomerGreeting() {
    const [customerName] = useLocalStorage("customer_name", "");

    if (!customerName) return null;

    return (
        <div className="inline-flex items-center bg-primary-50 text-primary-800 rounded-full px-4 py-2 text-sm">
            <span className="mr-2">👋</span>
            Hai, <span className="font-bold ml-1">{customerName}</span>!
        </div>
    );
}
