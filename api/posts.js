// Simple in-memory store (resets on cold starts / redeploys — perfect for demo)
let posts = [
  {
    id: 1,
    author: 'Alex Rivera',
    avatar: 'A',
    content: 'Just launched my new side project 🚀 Feeling excited about the future of social apps!',
    time: '2h',
    likes: 42,
    likedBy: [],
    comments: [
      { author: 'Jordan Lee', text: 'Congrats! Looking forward to trying it.' },
      { author: 'Sam Patel', text: 'Awesome work 👏' }
    ]
  },
  {
    id: 2,
    author: 'Jordan Lee',
    avatar: 'J',
    content: 'Beautiful sunset today 🌅 Nature always finds a way to surprise us.',
    time: '5h',
    likes: 128,
    likedBy: [],
    comments: []
  },
  {
    id: 3,
    author: 'Sam Patel',
    avatar: 'S',
    content: 'Who else is coding on a Wednesday night? 💻 Drop your stack in the comments!',
    time: '8h',
    likes: 67,
    likedBy: [],
    comments: [
      { author: 'Alex Rivera', text: 'Next.js + Tailwind all the way 🔥' }
    ]
  }
];

let nextId = 4;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/posts — list all posts
  if (req.method === 'GET') {
    return res.status(200).json(posts);
  }

  // POST /api/posts — create a new post
  if (req.method === 'POST') {
    const { author, avatar, content } = req.body || {};
    if (!author || !content) {
      return res.status(400).json({ error: 'author and content required' });
    }
    const newPost = {
      id: nextId++,
      author,
      avatar: avatar || author.charAt(0).toUpperCase(),
      content: content.trim(),
      time: 'Just now',
      likes: 0,
      likedBy: [],
      comments: []
    };
    posts.unshift(newPost);
    return res.status(201).json(newPost);
  }

  // PUT /api/posts — like or comment (action in body)
  if (req.method === 'PUT') {
    const { id, action, user, text } = req.body || {};
    const post = posts.find(p => p.id === Number(id));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (action === 'like') {
      const idx = post.likedBy.indexOf(user);
      if (idx === -1) {
        post.likedBy.push(user);
        post.likes += 1;
      } else {
        post.likedBy.splice(idx, 1);
        post.likes -= 1;
      }
      return res.status(200).json(post);
    }

    if (action === 'comment') {
      if (!text || !user) {
        return res.status(400).json({ error: 'user and text required' });
      }
      post.comments.push({ author: user, text: text.trim() });
      return res.status(200).json(post);
    }

    return res.status(400).json({ error: 'Unknown action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
