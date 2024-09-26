import type { MockData } from 'data'

const data: MockData = {
  logo: '',
  site: {
    name: 'foo',
  },
  desks: ['Latest'],
  pages: [],
  articles: [
    {
      title: 'Lorem ipsum dolor sit amet',
      blurb: 'Fusce lacinia dictum nulla eu pulvinar. Etiam ut efficitur tellus, sed tristique lectus',
      headline: 'https://via.placeholder.com/800x600',
      authors: [{ name: 'Mitchell Senior', url: '#' }],
      time: new Date(),
      url: 'https://example.com',
    },
  ],
}

export default data
