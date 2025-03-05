"use client"

import { Button } from "@heroui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import React from 'react'

const NavBar = () => {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return <p>Loading...</p>;
    }
    
      if (status === "unauthenticated") {
        return (
            <button onClick={() => signIn("google")}>Log In</button>
        )
      }
    
      return (
        <div className="flex justify-between p-4">
          <div className="flex align-middle">
            <Link href={"/"} className="my-auto">
              <h1 className="my-auto text-xl">
                Youtube Summarizer
              </h1>
            </Link>
          </div>
          <div className="flex gap-8">
            <Image src={session?.user.image!} width={50} height={50} alt="User Avatar Image" className="rounded-full"></Image>
            <Button onPress={() => signOut()} className="my-auto">Log Out</Button>
          </div>
        </div>
      );
}

export default NavBar
