interface image {
  RainbowID: string;
  imageName: string;
}
function PenaltySet() {
  let rootUrl = import.meta.env.VITE_SERVER || "https://localhost:5219"; //'http://172.16.1.236:999/'
  //恋爱日记
  function getLoveImgUrl(name: string) {
    return new URL(
      "/MeowMemoirs/File/MediaFile/LoveCalendar/MapStorage?path=" + name,
      rootUrl
    ).href;
  }
  //系统照片
  function getLocalImgUrl(name: string) {
    return new URL(
      "/MeowMemoirs/File/MediaFile/indigenous/MapStorage?path=" + name,
      rootUrl
    ).href;
  }
  //用户头像
  function DownloadUserImgUrl(data: image) {
    return new URL(
      `/MeowMemoirs/File/MediaFile/${data.RainbowID}/MapStorage?path=${
        data.imageName.split(".")[0]
      }&d=save`,
      rootUrl
    ).href;
  }
  //用户头像
  function getUserImgUrl(data: image) {
    return new URL(
      `/MeowMemoirs/File/MediaFile/${data.RainbowID}/MapStorage?path=${
        data.imageName.split(".")[0]
      }.webp`,
      rootUrl
    ).href;
  }
  function getHouseUserImgUrl(data: image) {
    return new URL(
      `/MeowMemoirs/File/MediaFile/indigenous/MapStorage?path=${
        data.imageName.split(".")[0]
      }.webp`,
      rootUrl
    ).href;
  }
  //留言板
  function getMessageImgUrl(data: image) {
    return new URL(
      `/MeowMemoirs/File/MediaFile/${
        data.RainbowID
      }/MapStorage?path=messageImage/${data.imageName.split(".")[0]}.webp`,
      rootUrl
    ).href;
  }
  //匿名留言
  function getHouseImgUrl(data: image) {
    return new URL(
      `/MeowMemoirs/File/MediaFile/${
        data.RainbowID
      }/MapStorage?path=messageImage/${
        data.imageName.split(".")[0]
      }.webp&d=house`,
      rootUrl
    ).href;
  }
  //图片集
  function getImgUrl(data: image) {
    return new URL(
      `/MeowMemoirs/File/MediaFile/indigenous/MapStorage?path=image/2- (${data}).jpg`,
      rootUrl
    ).href;
  }
  //Gallery
  function getGalleryImgUrl(filename: string) {
    return new URL(`/MeowMemoirs/Gallerys/Images?filename=${filename}`, rootUrl)
      .href;
  }
  return {
    getLoveImgUrl,
    getLocalImgUrl,
    getUserImgUrl,
    getHouseUserImgUrl,
    DownloadUserImgUrl,
    getMessageImgUrl,
    getHouseImgUrl,
    getImgUrl,
    getGalleryImgUrl,
  };
}
export default PenaltySet; // 导出
