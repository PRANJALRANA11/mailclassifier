"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Card, CardContent } from "../../components/ui/card"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../components/ui/sheet"

export default function Emails() {
    const [position, setPosition] = React.useState("bottom")
    return (
        <div className='w-3/5 mx-auto  '>
            <div className="flex mt-10">
                <div >
                    <Avatar >
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <h4 className="ml-4  w-10 font-semibold ">
                        Pranjal

                    </h4>
                    <p className='ml-4'>pranajlrana1235@gmail.com</p>
                </div>
                <div className="ml-[42.9rem]">
                    <Button variant="outline">Logout</Button>
                </div>
            </div>
            <div className="flex mt-40">
                <div className='ml-14'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline"><svg className="w-4 h-4 mr-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                            </svg>
                                15 </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Select Mails</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Input type="number" />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="ml-[49.9rem]">
                    <Button >classify</Button>
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild><div className='mt-20 ml-10 max-h-[20rem] overflow-y-auto hover:cursor-pointer'>
                    <Card className="w-full mb-4 rounded-lg h-24 border-2 border-white ">
                        <CardContent className="p-6 flex">

                            <div>

                                <span className="text-lg font-bold text-white">Emily Davis</span>
                                <p className="text-sm text-white mt-2">
                                    Hi Emily, Thanks for your order. We are pleased to inform you that your order has been shipped. You can..
                                </p>
                            </div>
                            <div className='ml-52'>
                                <p className="text-md text-red-500 font-semibold  ">Important</p>
                            </div>
                        </CardContent>
                    </Card>


                </div></SheetTrigger>
                <SheetContent className="w-[80rem]">
                    <SheetHeader>
                        <SheetTitle className="mt-10 flex">Are you absolutely sure? <p className='ml-10 text-md text-red-500 font-semibold '>Important</p></SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>



        </div>
    )
}
