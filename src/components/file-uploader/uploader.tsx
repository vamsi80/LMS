"use client";

import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { CardContent } from "../ui/card";
import { RenderEmptyState, RenderErrorState } from "./renderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectURL?: string;
    fileType: "image" | "video";
}

export function Uploader() {
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
    });

    async function uploadFile(file: File) {
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0,
        }));

        try {
            //1 get presign URL
            const presignedResponce = await fetch('/api/firebase/upload', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true
                }),
            });

            if (!presignedResponce.ok) {
                toast.error('Failed to get presigined URL');
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }));

                return;
            }

            const { preSiginedURL, key } = await presignedResponce.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest()

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentageCompleted = (event.loaded / event.total) * 100
                        setFileState((prev) => ({
                            ...prev,
                            progress: Math.round(percentageCompleted)
                        }));
                    }
                }
                xhr.onload = () => {
                    if (xhr.status == 200 || xhr.status === 204) {
                        setFileState((prev) => ({
                            ...prev,
                            progress: 100,
                            uploading: false,
                            key: key
                        }));

                        toast.success('File uploded succsfully')
                        resolve()
                    } else {
                        reject(new Error("upload failed..."))
                    }
                };

                xhr.onerror = () => {
                    reject(new Error("upload failed"));
                };

                xhr.open("PUT", preSiginedURL);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            });

        } catch {
            toast.error("Somting went wrong");

            setFileState((prev) => ({
                ...prev,
                progress: 0,
                error: true,
                uploading: false,
            }));
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]
            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectURL: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: "image"
            });
            uploadFile(file);
        }
    }, []);

    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const tooManyFiles = fileRejection.find(
                (rejection) => rejection.errors[0].code === 'too-many-files'
            );

            const fileSizeToBig = fileRejection.find(
                (rejection) => rejection.errors[0].code === 'file-too-large'
            );

            if (tooManyFiles) {
                toast.error('Too many files selected, max is 1')
            }

            if (fileSizeToBig) {
                toast.error('File size is exceded the limit')
            }
        }
    }

    function renderContent() {
        if (fileState.uploading) {
            return <h1>uploading....</h1>;
        }

        if (fileState.error) {
            return <RenderErrorState />
        }

        if (fileState.objectURL) {
            return <h1>uploded file</h1>;
        }

        return <RenderEmptyState isDragActive={isDragActive} />
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, //5mb calculation
        onDropRejected: rejectedFiles,
    },

    );

    return (
        <div {...getRootProps()} className={cn("relative border-2 border-dashed border-gray-400 transition-colors duration-200 ease-in-out w-full h-64",
            isDragActive
                ? "border-primary bg-primary/10 border-solid"
                : "border-border hover:border-primary")}
        >
            <CardContent className="flex items-center justify-center h-full w-full p-4">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </div>
    );
}
