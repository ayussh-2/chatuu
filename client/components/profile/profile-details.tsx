"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Key, Trash2 } from "lucide-react";
import Link from "next/link";

export function ProfileDetails() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">Account</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage your account settings.
                        </p>
                    </div>
                    <Key className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="mt-4 space-y-4">
                    <Link href="/reset">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Change Password
                        </Button>
                    </Link>
                    {/* <Button
                        variant="destructive"
                        className="w-full justify-start"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                    </Button> */}
                </div>
            </Card>
        </motion.div>
    );
}
