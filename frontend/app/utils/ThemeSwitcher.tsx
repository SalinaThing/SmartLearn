"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if(!mounted) {
        return null
    };

    return(
        <div className="flex items-center justify-center mx-4">
            {theme === "light" ? (
                <BiMoon
                    className="cursor-pointer"
                    size={25}
                    fill="#000000"
                    onClick={() => setTheme("dark")}
                />
            ) : (
                <BiSun
                    className="cursor-pointer"
                    size={25}
                    fill="#000000"
                    onClick={() => setTheme("light")}
                />
            )}
        </div>
    )
}
