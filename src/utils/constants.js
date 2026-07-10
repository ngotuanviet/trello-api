export const WHITELIST_DOMAINS = [
  'https://trello-api-ieln.onrender.com'
  // 'http://localhost:5173'
  // Không cần localhost nữa vi o file config/cors đã luôn luôn cho phep môi trường
  //dev(env.BUILD_MODE === 'dev')
  // ... vv ví dụ sau này sẽ deploy lên domain chính thức ... vv
]
export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}