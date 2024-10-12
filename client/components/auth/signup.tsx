"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SignupForm() {
    return (
        <div className="flex flex-col gap-10 backdrop-blur-sm p-10 w-96">
            <h2 className="text-4xl font-semibold text-center font-syne">
                Sign Up
            </h2>
            <form className="space-y-4 w-full font-inter">
                <Input id="firstname" placeholder="Your Name" type="text" />
                <Input placeholder="Email" type="email" />
                <Input
                    placeholder="Password"
                    type="password"
                    className="py-5"
                />
                <Button type="submit" className="btn-primary">
                    Sign Up
                </Button>
            </form>
        </div>
    );
}
