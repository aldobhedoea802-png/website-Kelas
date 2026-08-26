import { useEffect, useState } from "react";

function DarkModeToggle({ onChange, defaultDark }) {
    const [dark, setDark] = useState(defaultDark || false);

    // Inisialisasi dari localStorage
    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const isDark = saved === "dark";
        setDark(isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleDark = () => {
        const newDark = !dark;
        setDark(newDark);
        if (newDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
        // Panggil callback agar Home tahu terjadi perubahan
        if (onChange) onChange(newDark);
    };

    return (
        <button
            onClick={toggleDark}
            className="relative w-16 h-8 flex items-center bg-ink-200 dark:bg-ink-700 rounded-full p-1 transition duration-300"
        >
            <span
                className={`absolute text-xs left-2 transition ${
                    dark ? "opacity-0" : "opacity-100"
                }`}
            >
                🌞
            </span>
            <span
                className={`absolute right-2 text-xs transition ${
                    dark ? "opacity-100" : "opacity-0"
                }`}
            >
                🌙
            </span>
            <div
                className={`w-6 h-6 bg-paper-100 rounded-full shadow-md transform transition duration-300
                ${dark ? "translate-x-8" : "translate-x-0"}`}
            ></div>
        </button>
    );
}

export default DarkModeToggle;