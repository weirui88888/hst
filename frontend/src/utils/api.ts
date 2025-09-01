// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// 通用请求函数
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API错误响应:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}

// Timeline API
export interface TimelineItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: Date;
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    aspectRatio?: string;
  }>;
  isPinned?: boolean;
}

export interface TimelineResponse {
  items: TimelineItem[];
}

export interface PinnedResponse {
  pinnedId: string | null;
}

export interface CreateTimelineItemRequest {
  title: string;
  content: string;
  tags?: string[];
  date: Date;
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    aspectRatio?: string;
  }>;
  isPinned?: boolean;
}

export interface UpdateTimelineItemRequest extends Partial<CreateTimelineItemRequest> {}

export const timelineAPI = {
  // 获取时间轴项目列表
  getItems: (): Promise<TimelineResponse> => 
    request<TimelineResponse>('/timeline/items'),
  
  // 获取置顶项目
  getPinned: (): Promise<PinnedResponse> => 
    request<PinnedResponse>('/timeline/pinned'),
  
  // 创建时间轴项目
  createItem: (data: CreateTimelineItemRequest): Promise<{ message: string; item: TimelineItem }> =>
    request<{ message: string; item: TimelineItem }>('/timeline/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // 更新时间轴项目
  updateItem: (id: string, data: UpdateTimelineItemRequest): Promise<{ message: string; item: TimelineItem }> =>
    request<{ message: string; item: TimelineItem }>(`/timeline/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // 删除时间轴项目
  deleteItem: (id: string): Promise<{ message: string }> =>
    request<{ message: string }>(`/timeline/items/${id}`, {
      method: 'DELETE',
    }),
};

// User Config API
export interface UserConfig {
  siteTitle: string;
  siteEndText: string;
  timeAxisPosition: 'left' | 'right';
  seasonalIndicator: boolean;
  animationsEnabled: boolean;
}

export interface UpdateUserConfigRequest {
  siteTitle: string;
  siteEndText: string;
  timeAxisPosition?: 'left' | 'right';
  seasonalIndicator?: boolean;
  animationsEnabled?: boolean;
}

export const userConfigAPI = {
  // 获取用户配置
  getConfig: (): Promise<UserConfig> => 
    request<UserConfig>('/user/config'),
  
  // 更新用户配置
  updateConfig: (data: UpdateUserConfigRequest): Promise<{ message: string; config: UserConfig }> =>
    request<{ message: string; config: UserConfig }>('/user/config', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
