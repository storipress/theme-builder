import { z } from 'zod'

const BlockStateSchema = z.object({
  type: z.string(),
  desks: z.array(z.string()),
})

const BreakpointSchema = z.object({
  xs: z.unknown(),
  md: z.unknown(),
  lg: z.unknown(),
})

type BreakpointSchema = z.infer<typeof BreakpointSchema>

const StyleTreeMetaSchema = z.object({
  dirty: z.record(BreakpointSchema.keyof()),
})

type StyleTreeMetaSchema = z.infer<typeof StyleTreeMetaSchema>

interface StyleTreeSchema {
  name: string
  styles: Record<string, BreakpointSchema>
  children: Record<string, StyleTreeSchema>
  meta?: StyleTreeMetaSchema
}

const StyleTreeSchema: z.ZodType<StyleTreeSchema> = z.lazy(() =>
  z.object({
    name: z.string(),
    styles: z.record(BreakpointSchema),
    children: z.record(StyleTreeSchema),
  }),
)

function BlockDataSchema<T>(schema: z.ZodType<T>) {
  return z.record(z.union([z.record(schema), z.record(z.record(schema))]))
}

export const FrontPageSchema = z.object({
  blocks: z.array(z.string()),
  blockStates: z.record(BlockStateSchema),
  styles: StyleTreeSchema,
  images: BlockDataSchema(z.string()),
  texts: BlockDataSchema(z.string()),
})

export type FrontPage = z.infer<typeof FrontPageSchema>
