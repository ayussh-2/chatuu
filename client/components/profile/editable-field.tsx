"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface EditableFieldProps {
    label: string;
    value: string;
    onSave: (value: string) => void;
    className?: string;
    isAllowedEditing?: boolean;
}

export function EditableField({
    label,
    value: initialValue,
    onSave,
    className = "",
    isAllowedEditing = false,
}: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const handleSave = () => {
        onSave(value);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setValue(initialValue);
        setIsEditing(false);
    };

    return (
        <div className="group relative inline-block">
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-2"
                    >
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="h-8 min-w-[200px]"
                            placeholder={label}
                            autoFocus
                        />
                        <div className="flex gap-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleSave}
                                className="h-8 w-8"
                            >
                                <Check className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleCancel}
                                className="h-8 w-8"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                    >
                        <span className={className}>{value}</span>
                        {isAllowedEditing && (
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setIsEditing(true)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
