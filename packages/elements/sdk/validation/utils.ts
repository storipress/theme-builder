import { z } from 'zod'

export const SpacingClassSchema = z.object({
  lg: z.union([z.null(), z.string()]).optional(),
  md: z.union([z.null(), z.string()]).optional(),
  xs: z.union([z.null(), z.string()]).optional(),
})
export type SpacingClass = z.infer<typeof SpacingClassSchema>

export const SiteSchema = z.object({
  description: z.union([z.null(), z.string()]).optional(),
  facebook: z.union([z.null(), z.string()]).optional(),
  name: z.string(),
  twitter: z.union([z.null(), z.string()]).optional(),
})
export type Site = z.infer<typeof SiteSchema>

export const AuthorSchema = z.object({
  name: z.string(),
  url: z.string(),
})
export type Author = z.infer<typeof AuthorSchema>

export const OmitArticleDeskSchema = z.object({
  authors: z.array(AuthorSchema),
  blurb: z.string(),
  headline: z.string(),
  headlineAlt: z.union([z.null(), z.string()]).optional(),
  headlineCaption: z.union([z.null(), z.string()]).optional(),
  time: z.any(),
  title: z.string(),
  url: z.string(),
})
export type OmitArticleDesk = z.infer<typeof OmitArticleDeskSchema>

export const ArticleSchema = z.object({
  authors: z.array(AuthorSchema),
  blurb: z.string(),
  desk: z.string(),
  headline: z.string(),
  headlineAlt: z.union([z.null(), z.string()]).optional(),
  headlineCaption: z.union([z.null(), z.string()]).optional(),
  time: z.any(),
  title: z.string(),
  url: z.string(),
})
export type Article = z.infer<typeof ArticleSchema>

export const MockDataSchema = z.object({
  article: z.union([ArticleSchema, z.null()]).optional(),
  articles: z.union([z.array(OmitArticleDeskSchema), z.record(z.string(), z.array(OmitArticleDeskSchema))]),
  desks: z.array(z.string()),
  logo: z.union([z.null(), z.string()]).optional(),
  pages: z.union([z.array(z.string()), z.null()]).optional(),
  site: z.union([SiteSchema, z.null()]).optional(),
  spacing: z.union([SpacingClassSchema, z.null(), z.string()]).optional(),
})
export type MockData = z.infer<typeof MockDataSchema>
