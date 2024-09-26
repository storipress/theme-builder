import ky from 'ky'

type PhotoVariant = 'raw' | 'full' | 'regular' | 'small' | 'thumb'

interface User {
  name: string
  links: Record<'html', string>

  profile_image: {
    large: string
    medium: string
    small: string
  }
}

export interface Photo {
  id: string
  description: string
  user: User
  urls: Record<PhotoVariant, string>
}

export interface SearchResult {
  results: Photo[]
}

export interface UnsplashClient {
  listPhotos: (page?: number) => Promise<Photo[]>
  searchPhotos: (query: string, page?: number) => Promise<Photo[]>
  downloadPhoto: (id: string) => Promise<void>
}

export function createUnsplashClient(key: string): UnsplashClient {
  const client = ky.extend({
    prefixUrl: 'https://api.unsplash.com',
    timeout: false,
    headers: {
      'Accept-Version': 'v1',
      Authorization: `Client-ID: ${key}`,
    },
  })

  return {
    listPhotos(page: number = 1) {
      return client.get('photos', { searchParams: { page } }).json<Photo[]>()
    },
    async searchPhotos(query: string, page: number = 1) {
      const { results } = await client.get('search/photos', { searchParams: { page, query } }).json<SearchResult>()
      return results
    },
    downloadPhoto(id: string) {
      return client.get(`photos/${id}/download`).json()
    },
  }
}
