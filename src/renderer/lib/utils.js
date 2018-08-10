/**
 * 显示文件类型图标
 * @param  {[String]} fileName [文件名]
 * @return 文件后缀
 */
export function toFileName (fileName) {
  if (fileName) {
    let filearray = fileName.split('.')
    let suffix = filearray[filearray.length - 1].toLowerCase()
    if (/^(txt|rar|pdf|png|ico|gif|bmp)$/gi.test(suffix)) {
      return suffix
    } else if (/^(7z|zip)$/gi.test(suffix)) {
      return 'zip'
    } else if (/MP3|AAC|WMA|FLAC|ALAC|WAV|AIFF|PCM/gi.test(suffix)) {
      return 'music'
    } else if (/AVI|wma|rmvb|rm|flash|mp4|mid|3GP/gi.test(suffix)) {
      return 'video'
    } else if (/xls|xlsx|xlsm|xltx|xltm|xlsb|xlam/gi.test(suffix)) {
      return 'xls'
    } else if (/jpeg|jpg/gi.test(suffix)) {
      return 'jpg'
    } else if (/tif|tiff|dwg|jiff/gi.test(suffix)) {
      return 'img'
    } else if (/doc|docx|docm|dotx|dotm/gi.test(suffix)) {
      return 'doc'
    } else if (/ppt|pptx|pptm|ppsx|potx|potm|ppam/gi.test(suffix)) {
      return 'ppt'
    } else {
      return 'other'
    }
  }
}

/**
 * [bytesToSize 转换文件大小]
 * @param  {String} bytes [源文件大小]
 * @return [文件大小]
 */
export function bytesToSize (bytes, k = 1024) {
  if (bytes === 0) return '0 bytes'
  let dm = 2
  let sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
