import { env } from '@/lib/env';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3 } from '@/lib/firebase-clint';

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, { message: 'Filenameis required' }),
    contentType: z.string().min(1, { message: 'Content is Required' }),
    size: z.number().min(1, { message: 'Size is Required' }),
    isImage: z.boolean(),
})
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validation = fileUploadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid Requst Body' },
                { status: 400 }
            )
        }

        const { fileName, contentType, size } = validation.data
        const uniqueKey = `${uuidv4()}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType: contentType,
            ContentLength: size,
            Key: uniqueKey
        })

        const preSiginedURL = await getSignedUrl(S3, command, {
            expiresIn: 360, //URLexpires in 6 minutes
        });

        const response = {
            preSiginedURL,
            key: uniqueKey,
        }

        return NextResponse.json(response)

    } catch {
        return NextResponse.json(
            { error: "Failed to generate presigned URL" },
            { status: 500 }
        )
    }
}
