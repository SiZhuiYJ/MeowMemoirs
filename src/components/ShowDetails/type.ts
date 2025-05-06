// 类型定义
export interface ShowData {
    mediumId: number
    type: 'atlas' | 'video'
    userImg: string
    userName: string
    dateTime: string
    title: string
    coverImage: string
    content: string
    MediaContent: string[]
}
// 定义视频，点赞，转发，收藏，评论的类型
export interface VideoData {
    like: number
    share: number
    collect: number
    comment: number
    isLike: boolean
    isShare: boolean
    isCollect: boolean
    isComment: boolean
}