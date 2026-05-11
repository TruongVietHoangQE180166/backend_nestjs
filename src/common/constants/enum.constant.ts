/**
 * ENUMS (Định nghĩa các tập giá trị cố định dựa trên Prisma schema)
 */

export enum RoleName {
  ADMIN = 'ADMIN', // Quản trị viên hệ thống
  USER = 'USER', // Người dùng/Độc giả thông thường
  TEACHER = 'TEACHER', // Tác giả hoặc người hướng dẫn
}

export enum StoryType {
  TRANSLATED = 'TRANSLATED', // Truyện dịch
  CONVERTED = 'CONVERTED', // Truyện convert (trung-việt nhanh)
  ORIGINAL = 'ORIGINAL', // Truyện tự sáng tác
}

export enum StoryStatus {
  ONGOING = 'ONGOING', // Đang ra chương mới
  COMPLETED = 'COMPLETED', // Đã hoàn thành
  PAUSED = 'PAUSED', // Tạm dừng cập nhật
}

export enum StoryApprovalStatus {
  PENDING = 'PENDING', // Chờ Admin duyệt để hiển thị
  APPROVED = 'APPROVED', // Đã duyệt
  REJECTED = 'REJECTED', // Bị từ chối (có thể do vi phạm)
}

export enum TagType {
  CHARACTER = 'CHARACTER', // Phân loại theo tính cách nhân vật (ví dụ: Lạnh lùng, Bá đạo)
  WORLD = 'WORLD', // Phân loại theo bối cảnh (ví dụ: Tu tiên, Đô thị)
  CONTENT = 'CONTENT', // Các nội dung/tình tiết đặc biệt khác
}
