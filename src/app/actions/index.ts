'use server'

import { signIn } from "@/auth";

export async function doSocialLogin(formData: any) {
    const action = formData.get("action");
    console.log(action)
    await signIn(action,{ redirectTo: "/home"})
}

export async function doLogout() {
    
}