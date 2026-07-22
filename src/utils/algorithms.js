// https://www.mongodb.com/docs/manual/reference/method/cursor.skip/#pagination-example
// Tinn toan gia tri skip phuc vu cac tac vu phan trang
export const pagingSkipValue = (page, itemsPerPage) => {
  // Luôn đầm bảo nều giá trị không hợp lệ thì return về 0 hêt
  if (!page || !itemsPerPage) return 0
  if (page <= 0 || itemsPerPage <= 0) return 0

  /*
* Giài thích công thức đơn giản dễ hiều:
* Ví dụ trường hợp mỗi page hiền thị 12 sàn phầm(itemsPerPage = 12)
  * Case 01: User đứng ở page 1(page = 1) thì sẽ lẩy 1 - 1 = 0 sau đó nhân với 12 thì cũng = 0, lúc này giá
trị skip là 0, nghĩa là không skip bằn ghi
  * Case 02: User đứng ở page 2(page = 2) thì sẽ lầy 2 - 1 = 1 sau đó nhân với 12 thì = 12, lúc này giá trị
skip là 12, nghĩa là skip 12 bàn ghi của 1 page trước đó
  * ...
* Case 03: User đứng ở page 5(page = 5) thì sẽ lầy 5 - 1 = 4 sau đó nhân với 12 thì = 48, lúc này giá trị
skip là 48, nghĩa là skip 48 bằn ghi cùa 4 page trước đó
  * ... vV Tương tự với mọi page khác
*/
  return (page - 1) * itemsPerPage
}