"use client"

import { CalendarClock, SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { format } from "date-fns"
import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

export const Header = () => {
    const [search, setSearch] = useState<string>("")
    const [date, setDate] = useState<Date | undefined>()

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchValue = useDebounce(search, 1000)

    useEffect(() => {
        const url = queryString.stringifyUrl({
        url: pathname,
        query: {
            search: searchValue
        }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [searchValue, router, pathname])

    const handleDateChange = (date: Date) => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                date: date.toISOString()
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
        setDate(date);
    }

    const handlePerPageChange = (perPage: string) => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname, 
            query: {
                ...params,
                perPage,
            }
        }, {skipNull: true, skipEmptyString: true})

        router.push(url)
    }

    const handleStatusChange = (status: string) => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname, 
            query: {
                ...params,
                status
            }
        }, {skipNull: true, skipEmptyString: true})

        router.push(url)
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-3">
                    <Select onValueChange={(value) => handlePerPageChange(value)}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                ["5", "10", "20", "50"].map((v, i) => (
                                    <SelectItem value={v} key={i}>{v}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <div className="hidden sm:flex relative w-full max-w-[400px]">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full appearance-none bg-background pl-8 shadow-none"
                        onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-auto pl-3 text-left font-normal",
                                date && "text-muted-foreground"
                            )}
                            >
                            {date ? (
                                format(date, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarClock className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(date) => date && handleDateChange(date)}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                <Select onValueChange={(value) => handleStatusChange(value)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            ["all", "pending", "shipping", "delivered", "returned"].map((v, i) => (
                                <SelectItem value={v} key={i} className="capitalize">{v}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className="sm:hidden relative w-full">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search..."
                className="w-full appearance-none bg-background pl-8 shadow-none"
                />
            </div>
        </div>
    )
}