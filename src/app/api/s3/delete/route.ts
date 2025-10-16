import { env } from "@/lib/env";
import { S3 } from "@/lib/firebase-clint";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const key = body.key;

        if (!key) {
            return NextResponse.json({ error: 'Invalid Requst Body' }, { status: 400 });
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key,
        });

        await S3.send(command);
        return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
    }
    catch {
        return NextResponse.json({ error: 'Missing Invalid Requst Body' }, { status: 500 });
    }
}