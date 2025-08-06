"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer"
        >
          <Sun className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer"
        >
          <Moon className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer"
        >
          <div className="h-4 w-4 mr-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-sm"></div>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 