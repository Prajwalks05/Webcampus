"use client";

import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import { ColumnDef } from "@tanstack/react-table";
import { frontendEnv } from "@webcampus/common/env";
import { Button } from "@webcampus/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@webcampus/ui/components/dropdown-menu";
import axios from "axios";
import { UserWithRole } from "better-auth/plugins";
import { ClipboardCopy, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const CopyableCell = ({ value }: { value: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    copy(value);
    console.log(`Copied: ${value}`);
  };

  return (
    <div
      className="group relative flex h-full items-center justify-between py-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ minWidth: "100px" }}
    >
      <span className="flex-grow truncate pr-6"> {value}</span>
      {isHovered && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-0 h-6 w-6 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleCopy}
          title={copiedText === value ? "Copied!" : "Copy to clipboard"}
        >
          <ClipboardCopy className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </Button>
      )}
    </div>
  );
};

export const adminDepartmentColumns: ColumnDef<UserWithRole>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CopyableCell value={row.original.id} />,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <CopyableCell value={row.original.name || ""} />,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <CopyableCell value={row.original.email || ""} />,
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const department = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async () => {
                const response = await axios.delete(
                  `${frontendEnv().NEXT_PUBLIC_API_BASE_URL}/user`,
                  {
                    data: {
                      userId: department.id,
                    },
                    withCredentials: true,
                  }
                );
                console.log(response);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
