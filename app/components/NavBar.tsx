"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

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
        <div>
          <h1>Welcome, {session!.user!.name}!</h1>
          <p>Email: {session!.user!.email}</p>
          <Image src={session?.user.image!} width={50} height={50} alt="User Avatar Image"></Image>
          <button onClick={() => signOut()}>Log Out</button>
        </div>
      );
}

export default NavBar
