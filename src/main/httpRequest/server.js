const HOST = process.env.NODE_ENV === 'development' ? 'https://yunpan-sit.midea.com:8443' : ''

export const API_LOGIN = HOST + '/v1/mideastore/service/login'
export const API_FILE_CATALOG = HOST + '/v1/mideastore/service/list'
export const API_ADD_FILE = HOST + '/v1/mideastore/service/add'
export const API_SEARCH_FILE = HOST + '/v1/mideastore/service/search/by/filename'
export const API_VIEW_LINK = HOST + '/v1/mideastore/service/get/view/link'
