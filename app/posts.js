// ============================================
// YOUR BLOG POSTS
// ============================================
// To add a new post:
// 1. Copy one of the existing post objects below
// 2. Paste it at the TOP of the array (newest first)
// 3. Fill in your title, tag, date, summary, and body
// 4. Save, then: git add . → git commit -m "new post" → git push
// ============================================

export const posts = [
  {
    id: 2,
    tag: 'Climate',
    title: 'Soil, Shovels, and Suspicion: The Quiet Work Behind Soil Sampling',
    summary: 'The field is its own beast. From dealing with jawans to meticulous soil data collection.',
    read: '5 min read',
    date: 'Aug 8, 2025',
    external: true,
    link: 'https://altcarbon.com/blog/soil-shovels-and-suspicion-the-quiet-work-behind-soil-sampling',
    body: null,
  },
  {
    id: 1,
    tag: 'Climate',
    title: 'The journey of Basalt — from crushers to carbon removal',
    summary: 'How a humble rock begins its journey to fight climate change — one dusty road at a time.',
    read: '3 min read',
    date: 'Apr 9, 2025',
    external: true,
    link: 'https://altcarbon.com/blog/the-journey-of-basalt-from-crushers-to-carbon-removal',
    body: null,
  },

  // ============================================
  // TEMPLATE — copy this block to add a new post
  // ============================================
  // {
  //   id: 3,                          // increment the number each time
  //   tag: 'Personal',                // AI, Climate, Personal, Tech, Life
  //   title: 'Your post title here',
  //   summary: 'One sentence that makes someone want to read this.',
  //   read: '4 min read',
  //   date: 'May 19, 2026',
  //   external: false,                // false = post lives here, true = links out
  //   link: null,                     // only needed if external: true
  //   body: `Your full post content goes here.
  //
  // You can write multiple paragraphs by leaving a blank line between them.
  //
  // Like this — each paragraph separated by a blank line will display
  // as its own paragraph on the site.
  //
  // Write as much as you want here.`,
  // },
];