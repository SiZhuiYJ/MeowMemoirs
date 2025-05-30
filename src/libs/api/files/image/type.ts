export interface image {
  imageId: number;
  url: string;
  tags: string;
  size: number;
  createTime: string;
  uploadTime: string;
  createAddress: string;
  deviceName: string;
  Longitude: number;
  Latitude: number;
}
export interface tag {
  tagId: string;
  tagName: string;
}
