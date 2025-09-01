import AliOssUpload from './aliOssUpload';

export function createEnvAliOssUploader(): AliOssUpload {
  const bucket = import.meta.env.VITE_OSS_BUCKET as string;
  const region = import.meta.env.VITE_OSS_REGION as string;
  const domain = (import.meta.env.VITE_OSS_DOMAIN as string) || undefined;
  const directory = (import.meta.env.VITE_OSS_DIRECTORY as string) || '';
  const accessKeyId = import.meta.env.VITE_OSS_ACCESS_KEY_ID as string;
  const accessKeySecret = import.meta.env.VITE_OSS_ACCESS_KEY_SECRET as string;

  if (!bucket || !region) {
    throw new Error('OSS 配置缺失：VITE_OSS_BUCKET 或 VITE_OSS_REGION');
  }

  const uploader = new AliOssUpload({
    bucket,
    region,
    domain,
    directory,
    // 仅用于本地联调：直接回传 AK/SK；生产务必改为 STS
    asyncGetStsToken: async () => ({ accessKeyId, accessKeySecret }) as any,
  });

  return uploader;
}

export const ossUploader = createEnvAliOssUploader();
