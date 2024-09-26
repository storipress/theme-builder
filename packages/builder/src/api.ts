import type { IFramely as IframelyResponse } from 'shared/clients/iframely'
import type {
  GetPagesQuery,
  GetSiteQuery,
  GetWorkspacesQuery,
  IframelyIframelyInput,
  ListDesksQuery,
  ListLayoutsQuery,
  UpdateLayoutInput,
  UpdatePageInput,
  UploadLayoutPreviewInput,
} from './generated/graphql'
import ky from 'ky'

import invariant from 'tiny-invariant'
import { createClient } from './apollo'
import { apiEndpoint, env } from './env'
import {
  CreateLayout,
  CreatePage,
  DeleteLayout,
  DeletePage,
  GetBlocks,
  GetDesign,
  GetIntegrations,
  GetMe,
  GetPages,
  GetReleases,
  GetSite,
  GetSiteCustomSite,
  GetWorkspaces,
  Iframely,
  ListArticles,
  ListDesks,
  ListLayouts,
  RequestPresignedUploadUrl,
  TriggerSiteBuild,
  UnsplashDownloadPhoto,
  UnsplashListPhotos,
  UnsplashSearchPhotos,
  UpdateDesign,
  UpdateDesk,
  UpdateLayout,
  UpdatePage,
  UploadImage,
  UploadImageDocument,
  UploadLayoutPreview,
} from './generated/graphql'
import { authFail, clientID, token } from './global-bus'

export type Site = GetSiteQuery['site']
export type Workspace = GetWorkspacesQuery['workspaces'][number]
export type Desk = ListDesksQuery['desks'][number]
export type Page = GetPagesQuery['pages'][number]
export type Article = Awaited<ReturnType<typeof listArticles>>['data'][number]
export type Layout = ListLayoutsQuery['layouts'][number]
export type Profile = Awaited<ReturnType<typeof getProfile>>

export interface ImageResponse {
  bucket: string
  key: string
}

// TODO: use mutate API
const NETWORK_ONLY_POLICY = 'network-only' as const

export const client = createClient({
  apiEndpoint,
  getClient: () => clientID.state,
  getToken: () => token.state,
  echoLink: {
    pusherEndpoint: env.PUSHER_ENDPOINT,
  },
  onAuthFail: () => {
    authFail.post()
  },
})

export interface ListArticlesVariables {
  page?: number
  first?: number
  deskIds?: string[]
  featured?: boolean
}
export async function listArticles({ page, first, deskIds, featured }: ListArticlesVariables = {}) {
  const { data } = await client.query({
    query: ListArticles,
    variables: { page, first, featured, desk_ids: deskIds },
    fetchPolicy: NETWORK_ONLY_POLICY,
  })

  return data.articles!
}
export async function getPages() {
  const { data } = await client.query({ query: GetPages, fetchPolicy: NETWORK_ONLY_POLICY })

  return data.pages
}
export function createPage(title: string, seo: object) {
  return client.mutate({
    mutation: CreatePage,
    variables: {
      input: {
        title,
        seo,
      },
    },
  })
}
export function updatePage(input: UpdatePageInput) {
  return client.mutate({
    mutation: UpdatePage,
    variables: {
      input,
    },
  })
}
export function updatePageInfo(id: string, seo: object) {
  return client.mutate({
    mutation: UpdatePage,
    variables: {
      input: {
        id,
        seo,
      },
    },
  })
}
export async function deletePage(id: string) {
  return client.mutate({
    mutation: DeletePage,
    variables: {
      id,
    },
  })
}
export async function listDesks() {
  const { data } = await client.query({ query: ListDesks, fetchPolicy: NETWORK_ONLY_POLICY })
  return data.desks
}

export function updateDeskInfo(id: string, seo: object, slug: string) {
  return client.mutate({
    mutation: UpdateDesk,
    variables: {
      input: {
        id,
        slug,
        seo,
      },
    },
  })
}

export function updateDeskLayout(id: string, layoutId: string) {
  return client.mutate({
    mutation: UpdateDesk,
    variables: {
      input: {
        id,
        layout_id: layoutId,
      },
    },
  })
}

export async function listLayouts() {
  const { data } = await client.query({ query: ListLayouts, fetchPolicy: NETWORK_ONLY_POLICY })
  return data.layouts.map(({ preview, ...rest }) => ({
    ...rest,
    preview: preview ? { url: imageAppendEdits(preview.url, { width: '300' }) } : preview,
  }))
}

export function postNewLayout(name: string, template: string) {
  return client.mutate({
    mutation: CreateLayout,
    variables: {
      input: {
        name,
        template,
      },
    },
  })
}

export function updateLayout(input: UpdateLayoutInput) {
  return client.mutate({
    mutation: UpdateLayout,
    variables: {
      input,
    },
  })
}

export async function deleteLayout(id: string) {
  return client.mutate({
    mutation: DeleteLayout,
    variables: {
      id,
    },
  })
}

export async function getProfile() {
  const { data } = await client.query({ query: GetMe })
  return data.me
}

export async function getSite() {
  const { data } = await client.query({ query: GetSite, fetchPolicy: NETWORK_ONLY_POLICY })
  return data.site
}

export async function getSiteCustomSite() {
  const { data } = await client.query({ query: GetSiteCustomSite, fetchPolicy: NETWORK_ONLY_POLICY })
  return data.site.custom_site_template
}

export async function getWorkspaces() {
  const { data } = await client.query({ query: GetWorkspaces })
  return data.workspaces
}

export async function getDesign(key = 'home') {
  const { data } = await client.query({ query: GetDesign, variables: { key }, fetchPolicy: NETWORK_ONLY_POLICY })
  return data.design
}

export async function updateDesignInfo(key: string, seo?: object, draft?: object, current?: object) {
  return await client.mutate({
    mutation: UpdateDesign,
    variables: {
      input: {
        key,
        seo,
        draft,
        current,
      },
    },
  })
}

export async function uploadLogo(file: File): Promise<string> {
  invariant(clientID.state, 'no client id for upload logo')

  return uploadImage({
    id: clientID.state,
    file,
    type: UploadImage.PublicationLogo,
  })
}

export async function triggerSiteBuild(): Promise<string> {
  const { data } = await client.mutate({
    mutation: TriggerSiteBuild,
  })
  return data?.triggerSiteBuild as string
}

export async function getReleases(/** first: 10, page: 1 */) {
  const { data } = await client.query({ query: GetReleases, fetchPolicy: NETWORK_ONLY_POLICY })
  return data.releases?.data
}

export async function uploadLayoutPreview(input: UploadLayoutPreviewInput): Promise<string> {
  const { data } = await client.mutate({
    mutation: UploadLayoutPreview,
    variables: {
      input,
    },
  })

  return data?.uploadLayoutPreview as string
}

const IMG_CDN = env.ASSET_CDN as string

export function createImageURL(path: string, edits: Record<string, string> = {}) {
  const params = new URLSearchParams(edits)

  if (!path.startsWith(IMG_CDN)) {
    path = `${IMG_CDN}/${path}`
  }

  const url = new URL(path)
  url.search = params.toString()

  return url.toString()
}

export function imageAppendEdits(path: string, edits: Record<string, string> = {}) {
  const params = new URLSearchParams(edits)
  return `${path}?${params.toString()}`
}

export async function uploadOtherImage(id: string, file: File): Promise<string> {
  return await uploadImage({ file, id, type: UploadImage.OtherPageContentImage })
}

interface UploadImageInput {
  id: string
  file: File
  type: UploadImage
}

const ACCEPTED_IMAGES_UPLOAD_TYPE = new Set([
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg',
  'image/svg+xml',
])

async function uploadImage({ id, file, type }: UploadImageInput) {
  if (!ACCEPTED_IMAGES_UPLOAD_TYPE.has(file.type)) return

  const { data } = await client.mutate({
    mutation: RequestPresignedUploadUrl,
  })
  invariant(data, 'cannot create presigned url')
  const { key, signature, url: uploadURL } = data.requestPresignedUploadURL
  await ky.put(uploadURL, {
    body: file,
    timeout: false,
    headers: {
      'Content-Type': file.type,
    },
  })
  const res = await client.mutate({
    mutation: UploadImageDocument,
    variables: {
      input: {
        key,
        signature,
        target_id: id,
        type,
      },
    },
  })
  invariant(res.data, 'cannot upload image')
  return res.data.uploadImage.url
}

export async function oEmbed(input: IframelyIframelyInput): Promise<IframelyResponse> {
  const { data } = await client.query({ query: Iframely, variables: { input } })

  return data.iframelyIframely
}

export async function getIntegrations() {
  const { data } = await client.query({ query: GetIntegrations, fetchPolicy: NETWORK_ONLY_POLICY })
  return data.integrations
}

export async function getBlocks({ first = 20, page = 1 }) {
  const { data } = await client.query({
    query: GetBlocks,
    fetchPolicy: NETWORK_ONLY_POLICY,
    variables: {
      first,
      page,
    },
  })
  return data
}

export async function listPhotos(page = 1) {
  const { data } = await client.query({ query: UnsplashListPhotos, variables: { page } })
  return data.unsplashList
}

export async function searchPhotos(query: string, page = 1) {
  const { data } = await client.query({
    query: UnsplashSearchPhotos,
    variables: { input: { keyword: query, page } },
  })
  return data.unsplashSearch
}

export async function downloadPhoto(id: string) {
  await client.query({
    query: UnsplashDownloadPhoto,
    variables: { id },
  })
}
