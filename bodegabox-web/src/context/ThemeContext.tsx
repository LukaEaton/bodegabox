import React, { createContext, useContext, useEffect, useState } from "react";
import { RgbaColor } from "react-colorful";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    secondaryColor: string;
    setSecondaryColor: (color: string) => void;
    parseRgba: (rgba: string) => RgbaColor;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => {},
    secondaryColor: document.documentElement.style.getPropertyValue("--secondary-color"),
    setSecondaryColor: () => {},
    parseRgba: () => ({ r: 0, g: 0, b: 0, a: 1 }),
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>("light");
    const [secondaryColor, setSecondaryColor] = useState(getComputedStyle(document.documentElement).getPropertyValue("--secondary-color"));
    
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as Theme | null;
        const storedColor = localStorage.getItem("secondaryColor");
        if (storedTheme) setTheme(storedTheme);
        if (storedColor) setSecondaryColor(storedColor);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.style.setProperty("--secondary-color", setAlpha(secondaryColor, 1));
        document.documentElement.style.setProperty("--secondary-color-opaque", setAlpha(secondaryColor, 0.7));
        document.documentElement.style.setProperty("--secondary-color-transparent", setAlpha(secondaryColor, 0.4));
        localStorage.setItem("secondaryColor", setAlpha(secondaryColor, 1));
    }, [secondaryColor]);

    const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

    function parseRgba(rgba: string): RgbaColor {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]*)\)?/);
        if (!match) return { r: 0, g: 0, b: 0, a: 1 };
        return {
            r: Number(match[1]),
            g: Number(match[2]),
            b: Number(match[3]),
            a: match[4] ? Number(match[4]) : 1,
        };
    }

    function setAlpha(rgb: string, alpha: number) {
        const { r, g, b } = parseRgba(rgb);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return (
    <ThemeContext.Provider value={{ theme, toggleTheme, secondaryColor, setSecondaryColor, parseRgba }}>
        {children}
    </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
