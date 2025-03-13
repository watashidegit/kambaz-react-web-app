import { BsFileEarmarkText } from "react-icons/bs";

interface AssignmentIconProps {
    className?: string;
}

export default function AssignmentIcon({ className }: AssignmentIconProps) {
    return (
        <BsFileEarmarkText className={`text-success me-2 fs-5 ${className || ""}`} />
    );
}