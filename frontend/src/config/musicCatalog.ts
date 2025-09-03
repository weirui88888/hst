// 在 public/music/ 放入 my-song.mp3。
// 在 SITE_MUSIC_OPTIONS 追加一项:
// { id: 'my-song', name: 'My Song Display Name' }
// 设置页即会出现新歌选项，播放器也会按规则播放。

export interface SiteMusicOption {
  id: string; // e.g. 'you-are-the-reason'
  name: string; // e.g. 'You are the reason'
}

// 可扩展的站点音乐选项列表
// 规则：public/music 下的文件名需与 id 对应（id.mp3）
export const SITE_MUSIC_OPTIONS: SiteMusicOption[] = [
  { id: "you-are-the-reason", name: "You are the reason" },
  { id: "bleeding-love", name: "Bleeding love" },
];

export function getMusicSrcById(id: string): string {
  // 统一以 /music/<id>.mp3 的约定加载资源
  return `/music/${id}.mp3`;
}
