import JWT from 'jsonwebtoken'
/**
 * *Function tạo mới một . token - Cần -3- tham số đầu vào
*userInfo: Những thông tin-muốn đính-kèm vào token
*. secretSignature: Chữ ký bi một (dạng một chuoi string ngau nhien) tren docs thi de ten là privatekey tủy
đều được
*tokenLife: Thời-gian sống của token
 */
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign() của thư viện Jwt - Thuật toán mặc định tà H5256 nhề, cứ cho vào code đề dễ nhìn
    return JWT.sign(userInfo, secretSignature, {
      expiresIn: tokenLife,
      algorithm: 'HS256'
    })

  } catch (error) {
    throw new Error(error)
  }
}
const verifyToken = async (token, secretSignature) => {
  try {
    // Hàm verify của thư viên jwt
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}
export const JwtProvider = {
  generateToken, verifyToken
}