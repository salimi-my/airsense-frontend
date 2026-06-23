"use client";

import { AxiosError, type AxiosResponse } from "axios";
import { Edit, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "@/lib/axios";
import { showErrorToast } from "@/lib/error-handler";
import { getInitials } from "@/lib/utils";
import { User } from "@/types";

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg", // jpg, jpeg
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml", // svg
];

// Error messages
const ERROR_MESSAGES = {
  INVALID_FILE_TYPE:
    "Please select a valid image file (JPEG, PNG, WebP, GIF, or SVG)",
  FILE_TOO_LARGE: "File size must be less than 10MB",
} as const;

// Types
type OperationType = "idle" | "uploading" | "deleting";

interface AvatarUploadProps {
  user: User;
}

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function AvatarUpload({ user }: AvatarUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Consolidated state
  const [operation, setOperation] = useState<OperationType>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isLoading = operation !== "idle";

  // Cleanup preview URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // File validation helper
  const validateFile = useCallback((file: File): FileValidationResult => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.INVALID_FILE_TYPE,
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.FILE_TOO_LARGE,
      };
    }

    return { isValid: true };
  }, []);

  // Generic API call handler
  const handleApiCall = useCallback(
    async (
      apiCall: () => Promise<AxiosResponse>,
      operationType: OperationType,
      successMessage: string,
      onSuccess?: () => void,
    ) => {
      try {
        setOperation(operationType);
        const response = await apiCall();

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message || successMessage);
          onSuccess?.();
          router.refresh();
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          showErrorToast(error);
        }

        // Cleanup on error
        if (operationType === "uploading" && previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      } finally {
        setOperation("idle");
        if (operationType === "deleting") {
          setShowDeleteDialog(false);
        }
      }
    },
    [router, previewUrl],
  );

  const handleUpload = useCallback(
    async (file: File) => {
      const uploadCall = () => {
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("_method", "PATCH");

        return axios.post("/api/users/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      };

      await handleApiCall(
        uploadCall,
        "uploading",
        "Avatar updated successfully",
      );
    },
    [handleApiCall],
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      // Cleanup previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      handleUpload(file);
    },
    [validateFile, previewUrl, handleUpload],
  );

  const handleDelete = useCallback(async () => {
    const deleteCall = () => {
      const formData = new FormData();
      formData.append("_method", "DELETE");

      return axios.post("/api/users/delete-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    };

    await handleApiCall(
      deleteCall,
      "deleting",
      "Avatar removed successfully",
      () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      },
    );
  }, [handleApiCall, previewUrl]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getCurrentAvatarUrl = useCallback(() => {
    if (previewUrl) return previewUrl;
    return user.avatar_url && user.avatar_url.trim() !== ""
      ? user.avatar_url
      : undefined;
  }, [previewUrl, user.avatar_url]);

  const hasAvatar = !!(user.avatar_url || previewUrl);

  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Profile picture</h3>
        </div>

        <div className="flex items-start">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={getCurrentAvatarUrl()} alt={user.name} />
              <AvatarFallback className="text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Spinner className="size-6 text-white" />
              </div>
            )}

            <div className="absolute -right-1 -bottom-1">
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        disabled={isLoading}
                        className="bg-background dark:bg-background border-border hover:bg-accent hover:dark:bg-accent h-8 w-8 rounded-full border shadow-sm"
                        variant="outline"
                        aria-label="Edit user avatar"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="right">Edit user avatar</TooltipContent>
                </Tooltip>

                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem
                    onClick={handleUploadClick}
                    disabled={isLoading}
                    className="cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    Upload a photo...
                  </DropdownMenuItem>

                  {hasAvatar && (
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={isLoading}
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove photo
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_FILE_TYPES.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload avatar image"
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Avatar</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your current avatar? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={operation === "deleting"}
              variant="destructive"
            >
              {operation === "deleting" ? (
                <>
                  <Spinner className="size-4" />
                  Removing...
                </>
              ) : (
                "Remove Avatar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
