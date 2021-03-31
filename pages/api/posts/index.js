import shortid from 'shortid'
import db from '../../../db'
import { sleep } from '../../../utils'

export default async (req, res) => {
  await sleep(1000) // simulate network delay

  try {
    if (req.method === 'GET') {
      return await GET(req, res)
    } else if (req.method === 'POST') {
      return await POST(req, res)
    }
  } catch (err) {
    console.error(err)
    res.status(500)
    res.json({ message: 'An unknown error occurred!' })
  }
}

// req.cookies - A cookie object sent by the request. defaults to {}
// req.query - an object containing query params. defaults to {}
// req.body - contains the body parsed by `content-type`, or null by default
async function GET(req, res) {
  const {
    query: { pageOffset, pageSize },
  } = req

  const posts = db.posts.map((d) => ({
    ...d,
    content: undefined, // Don't return content in list calls
  }))

  if (Number(pageSize)) {
    const start = Number(pageSize) * Number(pageOffset)
    const end = start + Number(pageSize)
    const page = posts.slice(start, end)

    return res.json({
      items: page, // contains posts filtered by the pagination query
      // where the next page should start
      nextPageOffset: posts.length > end ? Number(pageOffset) + 1 : undefined,
    })
  }

  res.json(posts)
}

async function POST(req, res) {
  const {
    body: { title, content },
  } = req

  const row = {
    id: shortid.generate(),
    title,
    content,
  }

  db.posts.push(row) // you can directly mutate imported object

  res.json(row)
}
