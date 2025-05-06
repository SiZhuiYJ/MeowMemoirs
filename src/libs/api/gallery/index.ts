// @/libs/api/gallery/index.ts
import http from '@/libs/http'
import type { ResponseData } from '@/libs/http/type'
import type { item } from '@/libs/api/gallery/type'
interface items {
    items: item[]
}
export const galleryApi = {
    MMGetImageList() {
        return http.get<ResponseData<(items)>>('/Gallerys/GetImageList');
    },
}