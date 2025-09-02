import AliOss from "ali-oss";
// 在前端环境缺少官方类型时，使用宽松类型占位，避免 TS 报错
type AliOssOptions = any;
type MultipartUploadOptions = any;

interface StsToken {
  accessKeyId: string;
  accessKeySecret: string;
  expiration?: string;
  securityToken?: string;
}

type AsyncGetStsToken = (...args: any[]) => Promise<StsToken>;

interface GetOssConfigOptions {
  stsToken: StsToken;
  bucket: string;
  region: string;
}
interface GetConfigOptions {
  asyncGetStsToken?: AsyncGetStsToken;
  bucket: string;
  region: string;
}

interface Config {
  bucket: string; // bucket库
  domain?: string; // 自定义域名
  directory?: string; // oss目录
  region: string; // 地域节点
  extraUploadOptions?: MultipartUploadOptions; // 额外的配置
  asyncGetStsToken?: AsyncGetStsToken; // 获取ststoken的异步方法，一般是调用后端服务获得
}

interface ConstructOssKeyOptions {
  name: string;
  directory?: string;
  randomName?: boolean | string;
}

interface UploadOptions {
  asyncGetStsToken?: AsyncGetStsToken;
  file: File;
  directory?: string;
  extraUploadOptions?: MultipartUploadOptions;
  randomName?: boolean | string;
  bucket?: string;
  region?: string;
}

interface BatchUploadOptions extends Omit<UploadOptions, "file"> {
  files: File[];
}

interface InitOssClientOptions {
  asyncGetStsToken?: AsyncGetStsToken;
  bucket?: string;
  region?: string;
}

class AliOssUpload {
  public bucket: string;
  public domain?: string;
  public directory?: string;
  public region: string;
  public defaultUploadOption?: MultipartUploadOptions;
  public asyncGetStsToken?: AsyncGetStsToken;
  constructor(config: Config) {
    const {
      bucket,
      domain,
      region,
      directory = "",
      extraUploadOptions = {},
      asyncGetStsToken,
    } = config;
    this.bucket = bucket;
    this.domain = this.handelDomain(domain);
    this.directory = directory;
    this.region = region;
    this.defaultUploadOption = extraUploadOptions;
    this.asyncGetStsToken = asyncGetStsToken;
  }

  handelDomain(domain?: string) {
    if (!domain) return;
    if (typeof domain !== "string") return;
    const regex = /\/$/;
    return regex.test(domain) ? domain : `${domain}/`;
  }

  handelDirectory(directory: string) {
    if (directory === "" || directory === "/") return "";
    return directory.replace(/^\/+|\/+$/g, "") + "/";
  }

  getConstructOssKey(options: ConstructOssKeyOptions) {
    const {
      directory: originDirectory = this.directory,
      name,
      randomName,
    } = options;
    const directory = this.handelDirectory(originDirectory!);
    const type = name.split(".")[name.split(".").length - 1];
    if (randomName) {
      return typeof randomName === "string"
        ? `${directory}${randomName}.${type}`
        : `${directory}${this.getUuid()}.${type}`;
    } else {
      return `${directory}${name}`;
    }
  }

  getUuid() {
    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  checkStsToken(stsToken: any) {
    if (
      typeof stsToken !== "object" ||
      !("accessKeyId" in stsToken) ||
      !("accessKeySecret" in stsToken)
    ) {
      throw new TypeError(
        "The return value of asyncGetStsToken method should be StsToken object type, and at least include accessKeyId and accessKeySecret field.",
      );
    }
  }

  getOssConfig(options: GetOssConfigOptions) {
    const { stsToken, region, bucket } = options;
    const { accessKeyId, accessKeySecret, securityToken } = stsToken;
    return {
      secure: true,
      region,
      accessKeyId,
      accessKeySecret,
      stsToken: securityToken,
      bucket,
    };
  }

  getConfig = async (options: GetConfigOptions) => {
    const { asyncGetStsToken, bucket, region } = options;
    if (!asyncGetStsToken && !this.asyncGetStsToken) {
      throw new Error(
        "Uploading files requires permission authentication information. You need to provide the global asynchronous method asyncGetStsToken when instantiating AliOssUpload, or actively pass in the asynchronous method asyncGetStsToken when calling the upload method.",
      );
    }
    if (asyncGetStsToken && typeof asyncGetStsToken !== "function") {
      throw new TypeError(
        "The asyncGetStsToken should be an asynchronous function and return stsToken object, and the object includes at least accessKeyId and accessKeySecret fields, and it is better to provide securityToken for temporary access.",
      );
    }
    if (
      !asyncGetStsToken &&
      this.asyncGetStsToken &&
      typeof this.asyncGetStsToken !== "function"
    ) {
      throw new TypeError(
        "The asyncGetStsToken should be an asynchronous function and return stsToken object, and the object includes at least accessKeyId and accessKeySecret fields, and it is better to provide securityToken for temporary access.",
      );
    }
    try {
      const stsToken = asyncGetStsToken
        ? await asyncGetStsToken()
        : await this.asyncGetStsToken!();
      this.checkStsToken(stsToken);
      const ossConfig: AliOssOptions = this.getOssConfig({
        stsToken,
        bucket,
        region,
      });
      return ossConfig;
    } catch (error: any) {
      console.error(error.message);
    }
  };

  initOssClient = async (options: InitOssClientOptions = {}) => {
    try {
      const {
        asyncGetStsToken,
        bucket = this.bucket,
        region = this.region,
      } = options;
      const ossConfig = await this.getConfig({
        asyncGetStsToken,
        bucket,
        region,
      });
      return new AliOss(ossConfig as AliOssOptions);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  upload = async (
    uploadOptions: UploadOptions,
  ): Promise<{ ossSourceUrl: string; [key: string]: any }> => {
    const {
      directory,
      asyncGetStsToken,
      file,
      extraUploadOptions,
      randomName = false,
      bucket = this.bucket,
      region = this.region,
    } = uploadOptions;

    try {
      const ossConfig = await this.getConfig({
        asyncGetStsToken,
        bucket,
        region,
      });
      const { name } = file;
      const ossClient = new AliOss(ossConfig as AliOssOptions);
      const uploadOptions = (extraUploadOptions ??
        this.defaultUploadOption) as MultipartUploadOptions;
      const uploadPath = this.getConstructOssKey({
        name,
        directory,
        randomName,
      });
      const res = await ossClient.put(uploadPath, file, uploadOptions);
      const result = this.domain
        ? {
            ossSourceUrl: `${this.domain}${res.name}`,
            ...res,
          }
        : {
            ossSourceUrl: `https://${bucket}.${region}.aliyuncs.com/${res.name}`,
            ...res,
          };
      // 便于在浏览器与 iOS PWA 环境中对比调试最终地址
      try {
        console.info(res);
        console.info(
          "[AliOssUpload] Upload success",
          JSON.stringify({
            ossSourceUrl: (result as any).ossSourceUrl,
            name: (result as any).name,
            resRequestId: (result as any).res?.requestId,
            bucket,
            region,
            domain: this.domain,
          }),
        );
      } catch {}
      return result as any;
    } catch (error: any) {
      console.error(error.message);
      return error.message;
    }
  };

  batchUpload = async (batchUploadOptions: BatchUploadOptions) => {
    let { files, ...uploadOptions } = batchUploadOptions;
    files = [...files];
    try {
      const uploadQueue = [];
      for (let i = 0; i < files.length; i++) {
        uploadQueue.push(
          this.upload({
            ...uploadOptions,
            file: files[i],
          }),
        );
      }
      return await Promise.all(uploadQueue);
    } catch (error: any) {}
  };
}

export default AliOssUpload;

// ========= Helper for app usage (env driven) =========
// 说明：在前端环境中通过 Vite 注入的环境变量（以 VITE_ 开头）来构建上传器与上传方法
// 需要在 .env.local 中配置：
// VITE_OSS_BUCKET=xxx
// VITE_OSS_REGION=oss-cn-hangzhou
// VITE_OSS_DOMAIN=https://img.example.com (可选)
// VITE_OSS_DIRECTORY=images/ (可选)
// VITE_OSS_ACCESS_KEY_ID=xxx (仅你当前要求的本地自测，生产不建议)
// VITE_OSS_ACCESS_KEY_SECRET=xxx (仅你当前要求的本地自测，生产不建议)

export async function uploadImageViaEnv(file: File): Promise<string> {
  const bucket = import.meta.env.VITE_OSS_BUCKET as string;
  const region = import.meta.env.VITE_OSS_REGION as string;
  const domain = (import.meta.env.VITE_OSS_DOMAIN as string) || undefined;
  const directory = (import.meta.env.VITE_OSS_DIRECTORY as string) || "";
  const accessKeyId = import.meta.env.VITE_OSS_ACCESS_KEY_ID as string;
  const accessKeySecret = import.meta.env.VITE_OSS_ACCESS_KEY_SECRET as string;

  if (!bucket || !region)
    throw new Error("OSS 配置缺失：VITE_OSS_BUCKET 或 VITE_OSS_REGION");
  if (!accessKeyId || !accessKeySecret)
    throw new Error(
      "缺少 VITE_OSS_ACCESS_KEY_ID 或 VITE_OSS_ACCESS_KEY_SECRET",
    );

  const uploader = new AliOssUpload({
    bucket,
    region,
    domain,
    directory,
    // 仅用于你当前本地自测：直接回传长期 AK/SK。强烈建议尽快切换到 STS。
    asyncGetStsToken: async () =>
      ({ accessKeyId, accessKeySecret }) as StsToken,
  });

  const res = await uploader.upload({ file, directory, randomName: true });
  return res.ossSourceUrl;
}
