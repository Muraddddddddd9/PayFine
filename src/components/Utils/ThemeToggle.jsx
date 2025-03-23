import { useState, useEffect } from 'react';
import { useColorMode, ColorModeButton } from "@/components/ui/color-mode"

const ThemeToggle = () => {
    const savedTheme = localStorage.getItem('theme');
    const [isLightTheme, setIsLightTheme] = useState(savedTheme === 'light');
    const { toggleColorMode } = useColorMode()

    useEffect(() => {
        if (isLightTheme) {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }, [isLightTheme]);

    const toggleTheme = () => {
        const newTheme = !isLightTheme;
        setIsLightTheme(newTheme);
        localStorage.setItem('theme', newTheme ? 'light' : 'dark');
    };

    return (
        <button style={{
            backgroundColor: "var(--color-backgroundSecond)",
            padding: "5px",
            borderRadius: "5px"
        }}
            onClick={() => {
                toggleTheme();
                toggleColorMode();
            }}
        >
            <ColorModeButton />
        </button>
    );
};

export default ThemeToggle;
