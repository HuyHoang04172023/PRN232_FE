import formidable from 'formidable'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export const config = {
  api: {
    bodyParser: false
  }
}

export default defineEventHandler(async (event) => {
  const form = formidable({ multiples: false })

  const { files }: any = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })

  const file = files.image?.[0]
  if (!file) {
    throw createError({
      statusCode: 400,
      message: 'Không có file nào được gửi lên'
    })
  }

  const fileName = Date.now() + '-' + file.originalFilename
  const publicPath = join(process.cwd(), 'public/img')

  await mkdir(publicPath, { recursive: true })

  const savePath = join(publicPath, fileName)

  const fileData = await readFile(file.filepath)
  await writeFile(savePath, fileData)

  return {
    imageUrl: `/img/${fileName}`
  }
})
