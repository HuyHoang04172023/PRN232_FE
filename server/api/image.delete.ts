// server/api/image.delete.ts
import { unlink } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const imageUrl = body.imageUrl as string

  if (!imageUrl || !imageUrl.startsWith('/img/')) {
    throw createError({ statusCode: 400, message: 'Đường dẫn ảnh không hợp lệ.' })
  }

  const filePath = join(process.cwd(), 'public', imageUrl)

  try {
    await unlink(filePath)
    return { message: 'Ảnh đã được xóa.' }
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Xóa ảnh thất bại.' })
  }
})
