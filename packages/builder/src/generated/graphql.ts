import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Date: { input: any; output: any }
  DateTime: { input: any; output: any }
  EmailString: { input: any; output: any }
  JSON: { input: any; output: any }
  Mixed: { input: any; output: any }
  Upload: { input: any; output: any }
}

/** add author to article form */
export type AddAuthorToArticleInput = {
  /** article id */
  id: Scalars['ID']['input']
  /** user id(author id) */
  user_id: Scalars['ID']['input']
}

export type AddSlackChannelsInput = {
  /** notify channels */
  channels: Array<Scalars['String']['input']>
  /** notify condition */
  key: Scalars['ID']['input']
}

/** add tag to article form */
export type AddTagToArticleInput = {
  /** article id */
  id: Scalars['ID']['input']
  /** tag id */
  tag_id: Scalars['ID']['input']
}

export type AppSubscriptionPlans = {
  __typename?: 'AppSubscriptionPlans'
  /** price currency */
  currency: Scalars['String']['output']
  /**
   * plan group,
   * possible values: blogger, publisher
   */
  group: Scalars['String']['output']
  /**
   * price id, use in price_id field when calling
   * createAppSubscription or updateAppSubscription
   */
  id: Scalars['ID']['output']
  /**
   * billing period type,
   * possible values: month, year
   */
  interval: Scalars['String']['output']
  /** billing period value */
  interval_count: Scalars['Int']['output']
  /**
   * price value, string type of integer with two decimal points,
   * e.g. 1800 means $18.00
   */
  price: Scalars['String']['output']
  /** possible values: licensed, metered */
  usage_type: Scalars['String']['output']
}

export type ApplyCouponCodeToAppSubscriptionInput = {
  promotion_code: Scalars['String']['input']
}

export type ApplyDealFuelCodeInput = {
  code: Scalars['String']['input']
}

export type ApplyViededingueCodeInput = {
  code: Scalars['String']['input']
}

/** Publication Articles */
export type Article = {
  __typename?: 'Article'
  /** article's authors */
  authors: Array<User>
  /** auto post data */
  auto_posting?: Maybe<Scalars['JSON']['output']>
  /** article description */
  blurb?: Maybe<Scalars['String']['output']>
  /** custom fields for content block */
  content_blocks: Array<CustomField>
  /** cover image and its properties */
  cover?: Maybe<Scalars['JSON']['output']>
  /** article created time */
  created_at: Scalars['DateTime']['output']
  /** article desk */
  desk: Desk
  /** article content, prosemirror format */
  document?: Maybe<Scalars['JSON']['output']>
  /** determinate article is in draft stage or not */
  draft: Scalars['Boolean']['output']
  /** article content encryption key */
  encryption_key: Scalars['String']['output']
  /** determinate article is featured or not */
  featured: Scalars['Boolean']['output']
  /** article content, html format */
  html?: Maybe<Scalars['String']['output']>
  /** article id */
  id: Scalars['ID']['output']
  /** layout this article used */
  layout?: Maybe<Layout>
  /** custom fields for metafield */
  metafields: Array<CustomField>
  /** newsletter is on or not for this article */
  newsletter: Scalars['Boolean']['output']
  /** when the newsletter is on, the time that the email has been sent */
  newsletter_at?: Maybe<Scalars['DateTime']['output']>
  /** use for kanban sorting, group with desk_id field */
  order: Scalars['Int']['output']
  /** article url pathname history */
  pathnames?: Maybe<Scalars['JSON']['output']>
  /** article content, plaintext format */
  plaintext?: Maybe<Scalars['String']['output']>
  /** determinate article is free, member or subscriber */
  plan: ArticlePlan
  /** determinate article publish type is right now, schedule or none */
  publish_type: ArticlePublishType
  /** determinate article is in published stage or not */
  published: Scalars['Boolean']['output']
  /** article published time */
  published_at?: Maybe<Scalars['DateTime']['output']>
  /** related articles */
  relevances: Array<Article>
  /** determinate article is in scheduled stage or not */
  scheduled: Scalars['Boolean']['output']
  /** seo meta data */
  seo?: Maybe<Scalars['JSON']['output']>
  /** article shadow authors(no real account authors) */
  shadow_authors?: Maybe<Array<Scalars['String']['output']>>
  /** article string id */
  sid: Scalars['ID']['output']
  /**
   * use for article url,
   * e.g. /posts/{slug}
   */
  slug: Scalars['String']['output']
  /** current article stage */
  stage: Stage
  /** article's tags */
  tags: Array<Tag>
  /** editing note threads */
  threads: Array<ArticleThread>
  /** article title */
  title: Scalars['String']['output']
  /** article last updated time, all modified opteration will update this field */
  updated_at: Scalars['DateTime']['output']
  /** article url */
  url: Scalars['String']['output']
}

/** A paginated list of Article edges. */
export type ArticleConnection = {
  __typename?: 'ArticleConnection'
  /** A list of Article edges. */
  edges: Array<ArticleEdge>
  /** Pagination information about the list of edges. */
  pageInfo: PageInfo
}

/** An edge that contains a node of type Article and a cursor. */
export type ArticleEdge = {
  __typename?: 'ArticleEdge'
  /** A unique cursor that can be used for pagination. */
  cursor: Scalars['String']['output']
  /** The Article node. */
  node: Article
}

/** A paginated list of Article items. */
export type ArticlePaginator = {
  __typename?: 'ArticlePaginator'
  /** A list of Article items. */
  data: Array<Article>
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo
}

/** Plan */
export enum ArticlePlan {
  /** public accessible article */
  Free = 'free',
  /** login required article */
  Member = 'member',
  /** paid member only article */
  Subscriber = 'subscriber',
}

/** Publish type */
export enum ArticlePublishType {
  /** Immediate */
  Immediate = 'immediate',
  /** None */
  None = 'none',
  /** Schedule */
  Schedule = 'schedule',
}

/** Sort by */
export enum ArticleSortBy {
  /** Article name */
  ArticleName = 'articleName',
  /** Article name desc */
  ArticleNameDesc = 'articleNameDesc',
  /** Date created */
  DateCreated = 'dateCreated',
  /** Date created desc */
  DateCreatedDesc = 'dateCreatedDesc',
  /** Date updated */
  DateUpdated = 'dateUpdated',
  /** Date updated desc */
  DateUpdatedDesc = 'dateUpdatedDesc',
}

export type ArticleThread = {
  __typename?: 'ArticleThread'
  /** article id */
  article_id: Scalars['ID']['output']
  /** thread create time */
  created_at: Scalars['DateTime']['output']
  /** thread id */
  id: Scalars['ID']['output']
  /** notes owned by the article's thread */
  notes: Array<ArticleThreadNote>
  /** thread position in document */
  position: Scalars['JSON']['output']
  /** thread resolve(delete) time */
  resolved_at?: Maybe<Scalars['DateTime']['output']>
  /** thread last update time */
  updated_at: Scalars['DateTime']['output']
}

export type ArticleThreadNotesArgs = {
  hasThread?: InputMaybe<WhereConditions>
}

/** article thread note */
export type ArticleThreadNote = {
  __typename?: 'ArticleThreadNote'
  /** article which owns this note */
  article: Article
  /** note content */
  content: Scalars['String']['output']
  /** note create time */
  created_at: Scalars['DateTime']['output']
  /** note id */
  id: Scalars['ID']['output']
  /** article thread which owns this note */
  thread: ArticleThread
  /** note last update time */
  updated_at: Scalars['DateTime']['output']
  /** user who owns this note */
  user: User
}

/** article thread note */
export type ArticleThreadNoteArticleArgs = {
  trashed?: InputMaybe<Trashed>
}

/** article thread note */
export type ArticleThreadNoteThreadArgs = {
  trashed?: InputMaybe<Trashed>
}

export type AssignUserToDeskInput = {
  /** desk id */
  desk_id: Scalars['ID']['input']
  /** user id */
  user_id: Scalars['ID']['input']
}

export type AuthToken = {
  __typename?: 'AuthToken'
  /** access token */
  access_token: Scalars['String']['output']
  expires_in: Scalars['Int']['output']
  token_type: Scalars['String']['output']
  user_id: Scalars['ID']['output']
}

/** State */
export enum AutoPostingState {
  /** the auto posting was aborted */
  Aborted = 'aborted',
  /** the auto posting was cancelled */
  Cancelled = 'cancelled',
  /** the auto posting was initialized */
  Initialized = 'initialized',
  /** the auto posting was past */
  None = 'none',
  /** the auto posting was posted */
  Posted = 'posted',
  /** the auto posting was waiting for post */
  Waiting = 'waiting',
}

export type Billing = {
  __typename?: 'Billing'
  /**
   * user's stripe account balance
   * @deprecated No longer supported
   */
  account_balance: Scalars['String']['output']
  /** subscription is canceled or not */
  canceled: Scalars['Boolean']['output']
  /** user's storipress credit balance */
  credit_balance: Scalars['String']['output']
  /**
   * discount(coupon) applies to current invoice
   * @deprecated use next_pm_discounts
   */
  discount: Scalars['String']['output']
  /** subscription ending time */
  ends_at?: Maybe<Scalars['DateTime']['output']>
  has_historical_subscriptions: Scalars['Boolean']['output']
  /** user has a payment method or not */
  has_pm: Scalars['Boolean']['output']
  has_prophet: Scalars['Boolean']['output']
  /** user id */
  id: Scalars['ID']['output']
  /**
   * billing cycle,
   * possible values: monthly(stripe), yearly(stripe), lifetime(appsumo)
   */
  interval?: Maybe<Scalars['String']['output']>
  /** next upcoming invoice time */
  next_pm_date?: Maybe<Scalars['DateTime']['output']>
  /** next upcoming invoice discounts */
  next_pm_discounts: Array<BillingDiscount>
  /** next upcoming invoice total price(tax excluded) */
  next_pm_subtotal?: Maybe<Scalars['String']['output']>
  /** next upcoming invoice tax price */
  next_pm_tax?: Maybe<Scalars['String']['output']>
  /** next upcoming invoice taxes details */
  next_pm_taxes: Array<BillingTax>
  /** next upcoming invoice total price(tax included) */
  next_pm_total?: Maybe<Scalars['String']['output']>
  /** canceled subscription is still in grace period or not */
  on_grace_period: Scalars['Boolean']['output']
  /** user is during the trial period or not */
  on_trial: Scalars['Boolean']['output']
  /**
   * subscription plan info:
   * - blogger(stripe)
   * - publisher(stripe)
   * - storipress_tier1(appsumo)
   * - storipress_tier2(appsumo)
   * - storipress_tier3(appsumo)
   * - storipress_bf_tier1(appsumo)
   * - storipress_bf_tier2(appsumo)
   * - storipress_bf_tier3(appsumo)
   * - storipress_bf_tier3(viededingue)
   * - storipress_bf_tier3(dealfuel)
   * - prophet
   */
  plan?: Maybe<Scalars['String']['output']>
  /** subscription plan id */
  plan_id?: Maybe<Scalars['String']['output']>
  /** card last 4 number */
  pm_last_four?: Maybe<Scalars['String']['output']>
  /** card brand */
  pm_type?: Maybe<Scalars['String']['output']>
  /** user's publications number */
  publications_count: Scalars['Int']['output']
  /** user's publications quota */
  publications_quota: Scalars['Int']['output']
  /** subscription editor seats */
  quantity?: Maybe<Scalars['Int']['output']>
  /** possible values: prophet, viededingue, dealfuel, appsumo, stripe */
  referer?: Maybe<Scalars['String']['output']>
  /** in used editors number */
  seats_in_use: Scalars['Int']['output']
  /**
   * subscription source,
   * possible values: stripe, appsumo
   */
  source?: Maybe<Scalars['String']['output']>
  /** user has active subscription or not */
  subscribed: Scalars['Boolean']['output']
  /** free trail ending time */
  trial_ends_at?: Maybe<Scalars['DateTime']['output']>
}

export type BillingDiscount = {
  __typename?: 'BillingDiscount'
  /**
   * discount amount,
   * e.g. 500
   */
  amount?: Maybe<Scalars['String']['output']>
  /**
   * fixed type of discount value,
   * e.g. 300 means $3.00
   */
  amount_off?: Maybe<Scalars['String']['output']>
  /**
   * discount name,
   * e.g. 10% off for 3 months
   */
  name: Scalars['String']['output']
  /**
   * percentage type of discount value,
   * e.g. 10.0 means 10%
   */
  percent_off?: Maybe<Scalars['Float']['output']>
}

export type BillingTax = {
  __typename?: 'BillingTax'
  /**
   * the total tax that will be paid,
   * e.g. 1650
   */
  amount: Scalars['String']['output']
  /**
   * the jurisdiction for the tax rate,
   * e.g. Australia
   */
  jurisdiction?: Maybe<Scalars['String']['output']>
  /**
   * tax name,
   * e.g. GST
   */
  name: Scalars['String']['output']
  /**
   * the tax rate percent out of 100,
   * e.g. 10.0
   */
  percentage?: Maybe<Scalars['Float']['output']>
}

export type Block = {
  __typename?: 'Block'
  /** block create time */
  created_at: Scalars['DateTime']['output']
  /** block id */
  id: Scalars['ID']['output']
  /** block last update time */
  updated_at: Scalars['DateTime']['output']
  /** block uuid */
  uuid: Scalars['String']['output']
}

/** A paginated list of Block items. */
export type BlockPaginator = {
  __typename?: 'BlockPaginator'
  /** A list of Block items. */
  data: Array<Block>
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo
}

/** email update form */
export type ChangeAccountEmailInput = {
  /** new account email field */
  email: Scalars['EmailString']['input']
  /** current password field */
  password: Scalars['String']['input']
}

export type ChangeArticleStageInput = {
  /** article id */
  id: Scalars['ID']['input']
  /** stage id */
  stage_id: Scalars['ID']['input']
}

export type ChangeRoleInput = {
  /** user id */
  id: Scalars['ID']['input']
  /** role id */
  role_id: Scalars['ID']['input']
}

export type CheckCustomDomainAvailabilityInput = {
  /** domain name */
  value: Scalars['String']['input']
}

export type CheckCustomDomainAvailabilityResponse = {
  __typename?: 'CheckCustomDomainAvailabilityResponse'
  /** whether this domain is available or not */
  available: Scalars['Boolean']['output']
  /** whether this domain is available for mailing or not */
  mail: Scalars['Boolean']['output']
  /** whether this domain is available for redirect or not */
  redirect: Scalars['Boolean']['output']
  /** whether this domain is available for static site or not */
  site: Scalars['Boolean']['output']
}

/** email confirm form */
export type ConfirmEmailInput = {
  /** email field */
  email: Scalars['EmailString']['input']
  /** link expired time field */
  expire_on: Scalars['Int']['input']
  /** hmac for inputs */
  signature: Scalars['String']['input']
}

export type ConfirmProphetCheckoutInput = {
  checkout_id: Scalars['String']['input']
}

export type ConfirmProphetCheckoutResponse = {
  __typename?: 'ConfirmProphetCheckoutResponse'
  email: Scalars['String']['output']
  exists: Scalars['Boolean']['output']
  first_name?: Maybe<Scalars['String']['output']>
  last_name?: Maybe<Scalars['String']['output']>
}

export type CreateAppSubscriptionInput = {
  price_id: Scalars['String']['input']
  promotion_code?: InputMaybe<Scalars['String']['input']>
  quantity?: InputMaybe<Scalars['Int']['input']>
}

export type CreateArticleInput = {
  /** author ids(user id) */
  author_ids?: InputMaybe<Array<Scalars['ID']['input']>>
  /** article description */
  blurb?: InputMaybe<Scalars['String']['input']>
  /** desk id */
  desk_id: Scalars['ID']['input']
  /** article published_at */
  published_at?: InputMaybe<Scalars['DateTime']['input']>
  /** article title */
  title?: InputMaybe<Scalars['String']['input']>
}

export type CreateArticleThreadInput = {
  /** article id */
  article_id: Scalars['ID']['input']
  /** position in article document */
  position: Scalars['JSON']['input']
}

export type CreateBlockInput = {
  /** block archive file */
  file?: InputMaybe<Scalars['Upload']['input']>
  /** presigned upload url key */
  key?: InputMaybe<Scalars['ID']['input']>
  /** signature of the request */
  signature?: InputMaybe<Scalars['String']['input']>
}

export type CreateCustomFieldGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>
  /** custom field group key */
  key: Scalars['String']['input']
  /** custom field group name */
  name: Scalars['String']['input']
  /** custom field group type */
  type: CustomFieldGroupType
}

export type CreateCustomFieldInput = {
  /** custom field group id */
  custom_field_group_id: Scalars['ID']['input']
  description?: InputMaybe<Scalars['String']['input']>
  /** custom field key */
  key: Scalars['String']['input']
  /** custom field name */
  name: Scalars['String']['input']
  /** custom field options */
  options?: InputMaybe<Scalars['JSON']['input']>
  /** custom field type */
  type: CustomFieldType
}

export type CreateCustomFieldValueInput = {
  /** custom field id */
  id: Scalars['ID']['input']
  /** target id */
  target_id: Scalars['ID']['input']
  /** custom field value */
  value?: InputMaybe<Scalars['Mixed']['input']>
}

export type CreateDeskInput = {
  /** desk description */
  description?: InputMaybe<Scalars['String']['input']>
  /** parent desk id */
  desk_id?: InputMaybe<Scalars['ID']['input']>
  /** layout id */
  layout_id?: InputMaybe<Scalars['ID']['input']>
  /** desk name */
  name: Scalars['String']['input']
  /** determinate desk is open_access or not */
  open_access?: InputMaybe<Scalars['Boolean']['input']>
  /** seo meta data */
  seo?: InputMaybe<Scalars['JSON']['input']>
}

export type CreateInvitationInput = {
  /** desk id */
  desk_id: Array<Scalars['ID']['input']>
  /** email */
  email: Scalars['EmailString']['input']
  /** role id */
  role_id: Scalars['ID']['input']
}

export type CreateLayoutInput = {
  /** layout data */
  data?: InputMaybe<Scalars['JSON']['input']>
  /** layout name */
  name: Scalars['String']['input']
  /** template id */
  template: Scalars['String']['input']
}

export type CreateLinkInput = {
  source: LinkSource
  target_id?: InputMaybe<Scalars['ID']['input']>
  target_type?: InputMaybe<LinkTarget>
  value?: InputMaybe<Scalars['String']['input']>
}

export type CreateLinterInput = {
  /** linter description */
  description?: InputMaybe<Scalars['String']['input']>
  /** linter prompt */
  prompt: Scalars['String']['input']
  /** linter title */
  title: Scalars['String']['input']
}

export type CreateNoteInput = {
  /** note content */
  content: Scalars['String']['input']
  /** thread id */
  thread_id: Scalars['ID']['input']
}

export type CreatePageInput = {
  /** live content */
  current?: InputMaybe<Scalars['JSON']['input']>
  /** draft content */
  draft?: InputMaybe<Scalars['JSON']['input']>
  /** layout id */
  layout_id?: InputMaybe<Scalars['ID']['input']>
  /** seo meta data */
  seo?: InputMaybe<Scalars['JSON']['input']>
  /**
   * page title,
   * e.g. About Us
   */
  title: Scalars['String']['input']
}

export type CreateRedirectionInput = {
  /** path */
  path: Scalars['String']['input']
  /** target */
  target: Scalars['String']['input']
}

export type CreateScraperArticleInput = {
  /** articles' path */
  path: Array<Scalars['String']['input']>
  /** scraper token */
  token: Scalars['String']['input']
}

export type CreateScraperSelectorInput = {
  /** arbitrary data */
  data?: InputMaybe<Scalars['JSON']['input']>
  /** scraper token */
  token: Scalars['String']['input']
  /** selector type */
  type: Scalars['String']['input']
  /** selector value */
  value?: InputMaybe<Scalars['String']['input']>
}

export type CreateSiteInput = {
  /** emails which will be invited to current publication */
  invites: Array<Scalars['EmailString']['input']>
  /** publication name */
  name: Scalars['String']['input']
  /** publication timezone */
  timezone?: InputMaybe<Scalars['String']['input']>
}

export type CreateStageInput = {
  /** target stage id, place new stage after target stage id */
  after: Scalars['ID']['input']
  /** stage color */
  color: Scalars['String']['input']
  /** stage icon */
  icon: Scalars['String']['input']
  /** stage name */
  name: Scalars['String']['input']
}

export type CreateTagInput = {
  /** tag description */
  description?: InputMaybe<Scalars['String']['input']>
  /** tag name */
  name: Scalars['String']['input']
}

export type CreateWebflowCollectionInput = {
  /** collection Type */
  type: WebflowCollectionType
}

export type Credit = {
  __typename?: 'Credit'
  /** credit amount */
  amount: Scalars['String']['output']
  /** credit remark */
  data?: Maybe<Scalars['JSON']['output']>
  /**
   * credit earned at
   * (the time that state was from draft to available)
   */
  earned_at?: Maybe<Scalars['DateTime']['output']>
  /**
   * credit earned source,
   * e.g. invitation
   */
  earned_from: Scalars['String']['output']
  /** credit id */
  id: Scalars['ID']['output']
  /** credit initialized at */
  initialized_at: Scalars['DateTime']['output']
  /** credit state */
  state: CreditState
  /** credit used or not */
  used: Scalars['Boolean']['output']
  /** credit used at */
  used_at?: Maybe<Scalars['DateTime']['output']>
}

/** A paginated list of Credit items. */
export type CreditPaginator = {
  __typename?: 'CreditPaginator'
  /** A list of Credit items. */
  data: Array<Credit>
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo
}

/** State */
export enum CreditState {
  /** Available */
  Available = 'available',
  /** Draft */
  Draft = 'draft',
  /** Used */
  Used = 'used',
  /** Void */
  Void = 'void',
}

export type CreditsOverview = {
  __typename?: 'CreditsOverview'
  /** default credit amount of current type */
  amount: Scalars['String']['output']
  /** available credit number */
  count: Scalars['Int']['output']
  /** total amount */
  total: Scalars['String']['output']
  /**
   * type of credit,
   * e.g. invitation
   */
  type: Scalars['String']['output']
}

export type CustomDomain = {
  __typename?: 'CustomDomain'
  domain: Scalars['String']['output']
  error?: Maybe<Scalars['String']['output']>
  group: CustomDomainGroup
  hostname: Scalars['String']['output']
  ok: Scalars['Boolean']['output']
  type: Scalars['String']['output']
  value: Scalars['String']['output']
}

export type CustomDomainDnsStatus = {
  __typename?: 'CustomDomainDnsStatus'
  mail: Array<CustomDomain>
  redirect: Array<CustomDomain>
  site: Array<CustomDomain>
}

/** Group */
export enum CustomDomainGroup {
  /** Mail */
  Mail = 'mail',
  /** Redirect */
  Redirect = 'redirect',
  /** Site */
  Site = 'site',
}

export type CustomField = {
  __typename?: 'CustomField'
  description?: Maybe<Scalars['String']['output']>
  group: CustomFieldGroup
  id: Scalars['ID']['output']
  key: Scalars['ID']['output']
  name: Scalars['String']['output']
  options?: Maybe<CustomFieldOptions>
  type: CustomFieldType
  values: Array<CustomFieldValue>
}

export type CustomFieldBooleanOptions = {
  __typename?: 'CustomFieldBooleanOptions'
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldBooleanValue = {
  __typename?: 'CustomFieldBooleanValue'
  id: Scalars['ID']['output']
  value?: Maybe<Scalars['Boolean']['output']>
}

export type CustomFieldColorOptions = {
  __typename?: 'CustomFieldColorOptions'
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldColorValue = {
  __typename?: 'CustomFieldColorValue'
  id: Scalars['ID']['output']
  value?: Maybe<Scalars['String']['output']>
}

export type CustomFieldDateOptions = {
  __typename?: 'CustomFieldDateOptions'
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  time?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldDateValue = {
  __typename?: 'CustomFieldDateValue'
  id: Scalars['ID']['output']
  value?: Maybe<Scalars['DateTime']['output']>
}

export type CustomFieldFileOptions = {
  __typename?: 'CustomFieldFileOptions'
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldFileValue = {
  __typename?: 'CustomFieldFileValue'
  id: Scalars['ID']['output']
  value?: Maybe<CustomFieldFileValueAttributes>
}

export type CustomFieldFileValueAttributes = {
  __typename?: 'CustomFieldFileValueAttributes'
  key: Scalars['ID']['output']
  mime_type: Scalars['String']['output']
  size: Scalars['Int']['output']
  url: Scalars['String']['output']
}

export type CustomFieldGroup = {
  __typename?: 'CustomFieldGroup'
  description?: Maybe<Scalars['String']['output']>
  /** @deprecated https://github.com/nuwave/lighthouse/issues/332 */
  desks: Array<Desk>
  fields: Array<CustomField>
  id: Scalars['ID']['output']
  key: Scalars['ID']['output']
  name: Scalars['String']['output']
  /** @deprecated https://github.com/nuwave/lighthouse/issues/332 */
  tags: Array<Tag>
  type: CustomFieldGroupType
}

/** A paginated list of CustomFieldGroup items. */
export type CustomFieldGroupPaginator = {
  __typename?: 'CustomFieldGroupPaginator'
  /** A list of CustomFieldGroup items. */
  data: Array<CustomFieldGroup>
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo
}

/** Group type */
export enum CustomFieldGroupType {
  /** Article content block */
  ArticleContentBlock = 'articleContentBlock',
  /** Article metafield */
  ArticleMetafield = 'articleMetafield',
  /** Desk metafield */
  DeskMetafield = 'deskMetafield',
  /** Publication metafield */
  PublicationMetafield = 'publicationMetafield',
  /** Tag metafield */
  TagMetafield = 'tagMetafield',
}

export type CustomFieldIgnoreOptions = {
  __typename?: 'CustomFieldIgnoreOptions'
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldJsonOptions = {
  __typename?: 'CustomFieldJsonOptions'
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldJsonValue = {
  __typename?: 'CustomFieldJsonValue'
  id: Scalars['ID']['output']
  value?: Maybe<Scalars['String']['output']>
}

export type CustomFieldNumberOptions = {
  __typename?: 'CustomFieldNumberOptions'
  float?: Maybe<Scalars['Boolean']['output']>
  max?: Maybe<Scalars['Float']['output']>
  min?: Maybe<Scalars['Float']['output']>
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldNumberValue = {
  __typename?: 'CustomFieldNumberValue'
  id: Scalars['ID']['output']
  value?: Maybe<Scalars['Float']['output']>
}

export type CustomFieldOptions =
  | CustomFieldBooleanOptions
  | CustomFieldColorOptions
  | CustomFieldDateOptions
  | CustomFieldFileOptions
  | CustomFieldIgnoreOptions
  | CustomFieldJsonOptions
  | CustomFieldNumberOptions
  | CustomFieldReferenceOptions
  | CustomFieldRichTextOptions
  | CustomFieldSelectOptions
  | CustomFieldTextOptions
  | CustomFieldUrlOptions

export type CustomFieldReferenceOptions = {
  __typename?: 'CustomFieldReferenceOptions'
  collection_id?: Maybe<Scalars['String']['output']>
  multiple?: Maybe<Scalars['Boolean']['output']>
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  target?: Maybe<CustomFieldReferenceTarget>
  type: CustomFieldType
}

/** Reference target */
export enum CustomFieldReferenceTarget {
  /** Article */
  Article = 'article',
  /** Desk */
  Desk = 'desk',
  /** Tag */
  Tag = 'tag',
  /** User */
  User = 'user',
  /** Webflow */
  Webflow = 'webflow',
}

export type CustomFieldReferenceTargetValue = Article | Desk | Tag | User | WebflowReference

export type CustomFieldReferenceValue = {
  __typename?: 'CustomFieldReferenceValue'
  id: Scalars['ID']['output']
  value?: Maybe<Array<CustomFieldReferenceTargetValue>>
}

export type CustomFieldRichTextOptions = {
  __typename?: 'CustomFieldRichTextOptions'
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldRichTextValue = {
  __typename?: 'CustomFieldRichTextValue'
  id: Scalars['ID']['output']
  value?: Maybe<Scalars['String']['output']>
}

export type CustomFieldSelectOptions = {
  __typename?: 'CustomFieldSelectOptions'
  choices?: Maybe<Scalars['Mixed']['output']>
  multiple?: Maybe<Scalars['Boolean']['output']>
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldSelectValue = {
  __typename?: 'CustomFieldSelectValue'
  id: Scalars['ID']['output']
  value?: Maybe<Array<Scalars['String']['output']>>
}

export type CustomFieldTextOptions = {
  __typename?: 'CustomFieldTextOptions'
  max?: Maybe<Scalars['Int']['output']>
  min?: Maybe<Scalars['Int']['output']>
  multiline?: Maybe<Scalars['Boolean']['output']>
  placeholder?: Maybe<Scalars['String']['output']>
  regex?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldTextValue = {
  __typename?: 'CustomFieldTextValue'
  id: Scalars['ID']['output']
  value?: Maybe<Scalars['String']['output']>
}

/** Type */
export enum CustomFieldType {
  /** Boolean */
  Boolean = 'boolean',
  /** Color */
  Color = 'color',
  /** Date */
  Date = 'date',
  /** File */
  File = 'file',
  /** Json */
  Json = 'json',
  /** Number */
  Number = 'number',
  /** Reference */
  Reference = 'reference',
  /** Rich text */
  RichText = 'richText',
  /** Select */
  Select = 'select',
  /** Text */
  Text = 'text',
  /** Url */
  Url = 'url',
}

export type CustomFieldUrlOptions = {
  __typename?: 'CustomFieldUrlOptions'
  placeholder?: Maybe<Scalars['String']['output']>
  repeat?: Maybe<Scalars['Boolean']['output']>
  required?: Maybe<Scalars['Boolean']['output']>
  type: CustomFieldType
}

export type CustomFieldUrlValue = {
  __typename?: 'CustomFieldUrlValue'
  id: Scalars['ID']['output']
  value?: Maybe<Scalars['String']['output']>
}

export type CustomFieldValue =
  | CustomFieldBooleanValue
  | CustomFieldColorValue
  | CustomFieldDateValue
  | CustomFieldFileValue
  | CustomFieldJsonValue
  | CustomFieldNumberValue
  | CustomFieldReferenceValue
  | CustomFieldRichTextValue
  | CustomFieldSelectValue
  | CustomFieldTextValue
  | CustomFieldUrlValue

export type DateRange = {
  from: Scalars['DateTime']['input']
  to: Scalars['DateTime']['input']
}

export type DeleteScraperArticleInput = {
  /** scraper article id */
  id: Scalars['ID']['input']
  /** scraper token */
  token: Scalars['String']['input']
}

export type DeleteScraperSelectorInput = {
  /** scraper selector id */
  id: Scalars['ID']['input']
  /** scraper token */
  token: Scalars['String']['input']
}

export type DeleteSlackChannelsInput = {
  /** notify channels */
  channels: Array<Scalars['String']['input']>
  /** notify condition */
  key: Scalars['ID']['input']
}

export type Design = {
  __typename?: 'Design'
  /** live content */
  current?: Maybe<Scalars['JSON']['output']>
  /** draft content */
  draft?: Maybe<Scalars['JSON']['output']>
  /** design key */
  key: Scalars['ID']['output']
  /** seo meta data */
  seo?: Maybe<Scalars['JSON']['output']>
}

export type Desk = {
  __typename?: 'Desk'
  /** articles number in this desk */
  articles_count: Scalars['Int']['output']
  /** desk description */
  description?: Maybe<Scalars['String']['output']>
  /** parent desk */
  desk?: Maybe<Desk>
  /** child desks */
  desks: Array<Desk>
  /** draft articles number in the desk(included sub-desks) */
  draft_articles_count: Scalars['Int']['output']
  /** desk id */
  id: Scalars['ID']['output']
  /** desk layout */
  layout?: Maybe<Layout>
  /** custom fields for metafield */
  metafields: Array<CustomField>
  /** desk name */
  name: Scalars['String']['output']
  /** determinate desk is open_access or not */
  open_access: Scalars['Boolean']['output']
  /** desk order */
  order: Scalars['Int']['output']
  /** published articles number in the desk(included sub-desks) */
  published_articles_count: Scalars['Int']['output']
  /** seo meta data */
  seo?: Maybe<Scalars['JSON']['output']>
  /** desk string id */
  sid: Scalars['ID']['output']
  /**
   * desk slug, use for structure url,
   * e.g. /desks/{slug}
   */
  slug: Scalars['String']['output']
  /** total articles number in the desk(included sub-desks) */
  total_articles_count: Scalars['Int']['output']
}

export type DeskLayoutInput = {
  connect?: InputMaybe<Scalars['ID']['input']>
  disconnect?: InputMaybe<Scalars['ID']['input']>
}

export type Email = {
  __typename?: 'Email'
  /** email content(HTML format) */
  content: Scalars['String']['output']
  /** email id */
  id: Scalars['ID']['output']
  /** email subject(title) */
  subject: Scalars['String']['output']
  /** email target */
  target?: Maybe<EmailTargetUnion>
  /** email receiver(recipient) */
  to: Scalars['EmailString']['output']
}

export type EmailDnsRecord = {
  __typename?: 'EmailDNSRecord'
  hostname: Scalars['String']['output']
  type: Scalars['String']['output']
  value: Scalars['String']['output']
}

export type EmailTargetUnion = Article

export type EnableCustomDomainInput = {
  /**
   * domain name,
   * e.g. example.com
   */
  value: Scalars['String']['input']
}

export type EnableSubscriptionInput = {
  /** subscription panel background color */
  accent_color?: InputMaybe<Scalars['String']['input']>
  /** subscription currency */
  currency?: InputMaybe<Scalars['String']['input']>
  /** support email */
  email?: InputMaybe<Scalars['EmailString']['input']>
  /** subscription monthly price */
  monthly_price?: InputMaybe<Scalars['String']['input']>
  /** enable newsletter or not */
  newsletter: Scalars['Boolean']['input']
  /** enable paid subscription or not */
  subscription: Scalars['Boolean']['input']
  /** subscription yearly price */
  yearly_price?: InputMaybe<Scalars['String']['input']>
}

export type FacebookConfiguration = {
  __typename?: 'FacebookConfiguration'
  pages?: Maybe<Array<FacebookPage>>
}

export type FacebookPage = {
  __typename?: 'FacebookPage'
  /** facebook page name */
  name: Scalars['String']['output']
  /** facebook page id */
  page_id: Scalars['String']['output']
  /** facebook page thumbnail */
  thumbnail: Scalars['String']['output']
}

export type FacebookSearchPage = {
  __typename?: 'FacebookSearchPage'
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
}

export type HubSpotInfo = {
  __typename?: 'HubSpotInfo'
  /** whether the integration is activated or not */
  activated_at?: Maybe<Scalars['DateTime']['output']>
}

export type IframelyIframelyInput = {
  /**
   * iframely params,
   * reference: https://iframely.com/docs/parameters
   */
  params: Scalars['JSON']['input']
  /** target url */
  url: Scalars['String']['input']
}

export type Image = {
  __typename?: 'Image'
  /** image caption */
  caption?: Maybe<Scalars['String']['output']>
  /** image description */
  description?: Maybe<Scalars['String']['output']>
  /** image height */
  height: Scalars['Int']['output']
  /** mime type */
  mime: Scalars['String']['output']
  /** filename */
  name: Scalars['String']['output']
  /** image size */
  size: Scalars['Int']['output']
  /** image title */
  title?: Maybe<Scalars['String']['output']>
  /** identify token */
  token: Scalars['String']['output']
  /** custom transformation */
  transformation?: Maybe<Scalars['JSON']['output']>
  /** image url */
  url: Scalars['String']['output']
  /** image width */
  width: Scalars['Int']['output']
}

export type ImportSiteContentFromWordPressInput = {
  /** file exported from storipress wordpress plugin */
  file?: InputMaybe<Scalars['Upload']['input']>
  /** presigned upload url key */
  key?: InputMaybe<Scalars['ID']['input']>
  /** signature of the request */
  signature?: InputMaybe<Scalars['String']['input']>
}

export type ImportSiteContentInput = {
  file: Scalars['Upload']['input']
}

export type ImportSubscribersFromCsvFileInput = {
  /** csv file */
  file?: InputMaybe<Scalars['Upload']['input']>
  /** presigned upload url key */
  key?: InputMaybe<Scalars['ID']['input']>
  /** signature of the request */
  signature?: InputMaybe<Scalars['String']['input']>
}

export type InitializeCustomDomainInput = {
  /** domain name for mailing */
  mail?: InputMaybe<Scalars['String']['input']>
  /** domain for static site redirection */
  redirect: Array<Scalars['String']['input']>
  /** domain name for static site */
  site?: InputMaybe<Scalars['String']['input']>
}

export type InitializeSiteInput = {
  desks: Array<Scalars['String']['input']>
  publication: Scalars['String']['input']
}

export type Integration = {
  __typename?: 'Integration'
  /** determinate whether the integration is activated or not */
  activated_at?: Maybe<Scalars['DateTime']['output']>
  /** integration read-only data */
  configuration?: Maybe<IntegrationConfiguration>
  /** integration data */
  data: Scalars['JSON']['output']
  /** integration key */
  key: Scalars['ID']['output']
}

export type IntegrationConfiguration =
  | FacebookConfiguration
  | IntegrationIgnoreConfiguration
  | LinkedInConfiguration
  | ShopifyConfiguration
  | SlackConfiguration
  | TwitterConfiguration
  | WebflowConfiguration

export type IntegrationIgnoreConfiguration = {
  __typename?: 'IntegrationIgnoreConfiguration'
  /** integration key */
  key?: Maybe<Scalars['String']['output']>
}

export type Invitation = {
  __typename?: 'Invitation'
  /** desks belongs to the user */
  desks: Array<Desk>
  /** email */
  email: Scalars['String']['output']
  /** invitation id */
  id: Scalars['String']['output']
  /** role */
  role: Scalars['String']['output']
}

export type Layout = {
  __typename?: 'Layout'
  /** layout data */
  data?: Maybe<Scalars['JSON']['output']>
  /** layout id */
  id: Scalars['ID']['output']
  /** layout name */
  name: Scalars['String']['output']
  /** layout preview image */
  preview?: Maybe<Image>
  /** template id */
  template: Scalars['String']['output']
}

export type Link = {
  __typename?: 'Link'
  /** link id */
  id: Scalars['ID']['output']
  /** determinate the link is a reference(internal) or not */
  reference: Scalars['Boolean']['output']
  /**
   * link source, e.g.
   * builder, editor
   */
  source: LinkSource
  target?: Maybe<LinkTargetUnion>
  value?: Maybe<Scalars['String']['output']>
}

/** Source */
export enum LinkSource {
  /** builder link */
  Builder = 'builder',
  /** editor(article) link */
  Editor = 'editor',
}

/** Target */
export enum LinkTarget {
  /** Article */
  Article = 'article',
  /** Desk */
  Desk = 'desk',
  /** Page */
  Page = 'page',
  /** Tag */
  Tag = 'tag',
  /** User */
  User = 'user',
}

export type LinkTargetUnion = Article | Desk | Page | Tag | User

export type LinkedInAuthors = {
  __typename?: 'LinkedInAuthors'
  /** linkedin author id */
  id: Scalars['String']['output']
  /** linkedin author name */
  name: Scalars['String']['output']
  /** linkedin author thumbnail */
  thumbnail?: Maybe<Scalars['String']['output']>
}

export type LinkedInConfiguration = {
  __typename?: 'LinkedInConfiguration'
  /** linkedin authors */
  authors: Array<LinkedInAuthors>
  /** linkedin email */
  email: Scalars['String']['output']
  /** linkedin user id */
  id: Scalars['String']['output']
  /** linkedin page name */
  name: Scalars['String']['output']
  /** linkedin page thumbnail */
  thumbnail?: Maybe<Scalars['String']['output']>
}

export type Linter = {
  __typename?: 'Linter'
  /** linter create time */
  created_at: Scalars['DateTime']['output']
  /** linter description */
  description: Scalars['String']['output']
  /** linter id */
  id: Scalars['ID']['output']
  /** linter prompt */
  prompt: Scalars['String']['output']
  /** linter title */
  title: Scalars['String']['output']
  /** linter last update time */
  updated_at: Scalars['DateTime']['output']
}

/** A paginated list of Linter edges. */
export type LinterConnection = {
  __typename?: 'LinterConnection'
  /** A list of Linter edges. */
  edges: Array<LinterEdge>
  /** Pagination information about the list of edges. */
  pageInfo: PageInfo
}

/** An edge that contains a node of type Linter and a cursor. */
export type LinterEdge = {
  __typename?: 'LinterEdge'
  /** A unique cursor that can be used for pagination. */
  cursor: Scalars['String']['output']
  /** The Linter node. */
  node: Linter
}

export type LiveUpdate = {
  __typename?: 'LiveUpdate'
  article_created?: Maybe<Article>
  article_deleted?: Maybe<Article>
  article_thread_created?: Maybe<ArticleThread>
  article_thread_note_created?: Maybe<ArticleThreadNote>
  article_thread_note_deleted?: Maybe<ArticleThreadNote>
  article_thread_note_updated?: Maybe<ArticleThreadNote>
  article_thread_resolved?: Maybe<ArticleThread>
  article_thread_updated?: Maybe<ArticleThread>
  article_updated?: Maybe<Article>
  design_updated?: Maybe<Design>
  desk_created?: Maybe<Desk>
  desk_deleted?: Maybe<Desk>
  desk_updated?: Maybe<Desk>
  integration_updated?: Maybe<Integration>
  invitation_created?: Maybe<Invitation>
  invitation_deleted?: Maybe<Invitation>
  invitation_updated?: Maybe<Invitation>
  layout_created?: Maybe<Layout>
  layout_deleted?: Maybe<Layout>
  layout_updated?: Maybe<Layout>
  page_created?: Maybe<Page>
  page_deleted?: Maybe<Page>
  page_updated?: Maybe<Page>
  release_created?: Maybe<Release>
  release_updated?: Maybe<Release>
  site_updated?: Maybe<Site>
  stage_created?: Maybe<Stage>
  stage_deleted?: Maybe<Stage>
  stage_updated?: Maybe<Stage>
  tag_created?: Maybe<Tag>
  tag_deleted?: Maybe<Tag>
  tag_updated?: Maybe<Tag>
  user_created?: Maybe<User>
  user_deleted?: Maybe<User>
  user_updated?: Maybe<User>
}

export type Media = {
  __typename?: 'Media'
  /** image blurhash value */
  blurhash?: Maybe<Scalars['String']['output']>
  /** media height */
  height: Scalars['Int']['output']
  key: Scalars['ID']['output']
  /** media mime type */
  mime: Scalars['String']['output']
  /** media size */
  size: Scalars['Int']['output']
  /** media url */
  url: Scalars['String']['output']
  /** media width */
  width: Scalars['Int']['output']
}

export type MoveArticleAfterInput = {
  /** article id */
  id: Scalars['ID']['input']
  /** target article id */
  target_id: Scalars['ID']['input']
}

export type MoveArticleBeforeInput = {
  /** article id */
  id: Scalars['ID']['input']
  /** target article id */
  target_id: Scalars['ID']['input']
}

export type MoveArticleToDeskInput = {
  /** desk id */
  desk_id: Scalars['ID']['input']
  /** article id */
  id: Scalars['ID']['input']
}

export type MoveDeskAfterInput = {
  /** desk id */
  id: Scalars['ID']['input']
  /** target desk id */
  target_id: Scalars['ID']['input']
}

export type MoveDeskBeforeInput = {
  /** desk id */
  id: Scalars['ID']['input']
  /** target desk id */
  target_id: Scalars['ID']['input']
}

export type MoveDeskInput = {
  after_id?: InputMaybe<Scalars['ID']['input']>
  before_id?: InputMaybe<Scalars['ID']['input']>
  id: Scalars['ID']['input']
  target_id?: InputMaybe<Scalars['ID']['input']>
}

export type MovePageAfterInput = {
  /** page id */
  id: Scalars['ID']['input']
  /** target page id */
  target_id: Scalars['ID']['input']
}

export type MovePageBeforeInput = {
  /** page id */
  id: Scalars['ID']['input']
  /** target page id */
  target_id: Scalars['ID']['input']
}

export type Mutation = {
  __typename?: 'Mutation'
  /** activate a specific integration */
  activateIntegration: Integration
  /** activate the Webflow integration */
  activateWebflow: Scalars['Boolean']['output']
  /** activate the WordPress integration */
  activateWordPress: Scalars['Boolean']['output']
  /** add author to article */
  addAuthorToArticle: Article
  /** add a slack channel as a notification channel for article updates */
  addSlackChannels: Integration
  /** add tag to article */
  addTagToArticle: Article
  applyCouponCodeToAppSubscription: Scalars['Boolean']['output']
  applyDealFuelCode: Scalars['Boolean']['output']
  applyViededingueCode: Scalars['Boolean']['output']
  /** manually assign a subscription */
  assignSubscriberSubscription: Scalars['Boolean']['output']
  /** assign an user to specific desk */
  assignUserToDesk: User
  cancelAppSubscription: Scalars['Boolean']['output']
  /** @deprecated No longer supported */
  cancelAppSubscriptionFreeTrial: Scalars['Boolean']['output']
  /** cancel an existing subscription */
  cancelSubscriberSubscription: Scalars['Boolean']['output']
  /** update account email */
  changeAccountEmail: User
  /** update password */
  changeAccountPassword: Scalars['Boolean']['output']
  /** change article stage */
  changeArticleStage: Article
  /**
   * change an existing subscription for the subscriber,
   * the price_id can be found on siteSubscriptionInfo query
   */
  changeSubscriberSubscription: Scalars['Boolean']['output']
  /** change user role */
  changeUserRole: User
  /** change user role for testing purpose */
  changeUserRoleForTesting: User
  checkCustomDomainAvailability: CheckCustomDomainAvailabilityResponse
  checkCustomDomainDnsStatus: CustomDomainDnsStatus
  /** Checks whether an email is being used by an existing user in Storipress */
  checkEmailExist: Scalars['Boolean']['output']
  checkProphetRemaining: Scalars['Int']['output']
  /** check whether Stripe Connect is connected */
  checkStripeConnectConnected: Scalars['Boolean']['output']
  /** clear static site cache */
  clearSiteCache: Scalars['Boolean']['output']
  confirmCustomDomain: Scalars['Boolean']['output']
  /** confirm account email */
  confirmEmail: Scalars['Boolean']['output']
  confirmProphetCheckout?: Maybe<ConfirmProphetCheckoutResponse>
  /** initiate OAuth for HubSpot and return the redirect URL */
  connectHubSpot: Scalars['String']['output']
  /** initiate OAuth for Webflow and return the redirect URL */
  connectWebflow: Scalars['String']['output']
  createAppSubscription: Scalars['Boolean']['output']
  /** create article */
  createArticle: Article
  /** create article's thread */
  createArticleThread: ArticleThread
  /** create a new custom editor block */
  createBlock: Block
  /** create new custom field */
  createCustomField: CustomField
  /** create new custom field group */
  createCustomFieldGroup: CustomFieldGroup
  /** create new custom field value */
  createCustomFieldValue: CustomFieldValue
  /** create new desk */
  createDesk: Desk
  /** create an invitation */
  createInvitation: Scalars['Boolean']['output']
  /** create a new layout */
  createLayout: Layout
  /** create a new link */
  createLink: Link
  /** create a new linter */
  createLinter: Linter
  /** add note to article thread */
  createNote: ArticleThreadNote
  /** create a new page */
  createPage: Page
  /** create a new redirection */
  createRedirection: Redirection
  /** create new scraper */
  createScraper: Scalars['String']['output']
  /** create new article from scraper */
  createScraperArticle: Array<ScraperArticle>
  /** create new scraper selector */
  createScraperSelector: ScraperSelector
  /** create new publication */
  createSite: Scalars['String']['output']
  /** create new stage */
  createStage: Stage
  /**
   * create a new subscription for the subscriber,
   * the price_id can be found on siteSubscriptionInfo query
   */
  createSubscriberSubscription: Scalars['Boolean']['output']
  /** create a new tag */
  createTag: Tag
  createTrialAppSubscription: Scalars['Boolean']['output']
  /** create webflow collection */
  createWebflowCollection: Scalars['Boolean']['output']
  /** deactivates a specific integration */
  deactivateIntegration: Integration
  /** deactivate the Webflow integration */
  deactivateWebflow: Scalars['Boolean']['output']
  /** deactivate the WordPress integration */
  deactivateWordPress: Scalars['Boolean']['output']
  /** delete account */
  deleteAccount: Scalars['Boolean']['output']
  /** delete article */
  deleteArticle: Article
  /** delete custom block */
  deleteBlock: Block
  /** delete a custom field */
  deleteCustomField: CustomField
  /** delete a custom field group */
  deleteCustomFieldGroup: CustomFieldGroup
  /** delete a custom field value */
  deleteCustomFieldValue: CustomFieldValue
  /** delete a desk */
  deleteDesk: Desk
  /** delete a layout */
  deleteLayout: Layout
  /** delete a linter */
  deleteLinter: Linter
  /** delete article thread note */
  deleteNote: ArticleThreadNote
  /** delete a page */
  deletePage: Page
  /** delete a redirection */
  deleteRedirection: Redirection
  /** delete scraper article */
  deleteScraperArticle: ScraperArticle
  /** delete scraper selector */
  deleteScraperSelector: ScraperSelector
  /** delete an existing publication */
  deleteSite: Scalars['Boolean']['output']
  /** delete publication data */
  deleteSiteContent: Scalars['Boolean']['output']
  /** Remove a channel from Slack notifications */
  deleteSlackChannels: Integration
  /** delete a stage */
  deleteStage: Stage
  /** delete existing subscribers */
  deleteSubscribers: Scalars['Boolean']['output']
  /** delete a tag */
  deleteTag: Tag
  /** delete a user */
  deleteUser: User
  /** disable custom domain */
  disableCustomDomain: Site
  /**
   * disable publication subscription
   * @deprecated No longer supported
   */
  disableSubscription: Site
  /** disconnect HubSpot integration */
  disconnectHubSpot: Scalars['Boolean']['output']
  /** disconnect specific integration */
  disconnectIntegration: Integration
  /** disconnect stripe connect */
  disconnectStripeConnect: Scalars['Boolean']['output']
  /** disconnect Webflow integration */
  disconnectWebflow: Scalars['Boolean']['output']
  /** disconnect WordPress integration */
  disconnectWordPress: Scalars['Boolean']['output']
  /** duplicate an article */
  duplicateArticle: Article
  /** enable custom domain */
  enableCustomDomain: Site
  /** export publication data */
  exportSiteContent: Scalars['JSON']['output']
  /** export subscribers to csv string */
  exportSubscribers: Scalars['String']['output']
  /** send password recovery email */
  forgotPassword: Scalars['Boolean']['output']
  /**
   * generate a new newstand key,
   * and this will automatically delete the old one
   */
  generateNewstandKey: Scalars['String']['output']
  /** get slack channels list */
  getSlackChannelsList: Array<SlackChannel>
  /** user hide current request publication */
  hidePublication: Scalars['Boolean']['output']
  /** user impersonate */
  impersonate?: Maybe<Scalars['String']['output']>
  /** @deprecated not works as expected */
  importSiteContent: Scalars['Boolean']['output']
  /** import content from wordpress */
  importSiteContentFromWordPress: Scalars['Boolean']['output']
  /** import subscriber from csv file */
  importSubscribersFromCsvFile: Scalars['Boolean']['output']
  initializeCustomDomain: CustomDomainDnsStatus
  initializeSite: Site
  /** inject shopify theme template */
  injectShopifyThemeTemplate: Scalars['Boolean']['output']
  /** launch publication subscription */
  launchSubscription: Site
  /** user leave current request publication */
  leavePublication: Scalars['Boolean']['output']
  /** @deprecated invalid api in manager v2 */
  makeStageDefault: Stage
  /** move article order after target article id */
  moveArticleAfter: Scalars['Boolean']['output']
  /** move article order before target article id */
  moveArticleBefore: Scalars['Boolean']['output']
  /** move article to another desk */
  moveArticleToDesk: Article
  moveDesk: Desk
  /** move desk order after target desk id */
  moveDeskAfter: Desk
  /** move desk order before target desk id */
  moveDeskBefore: Desk
  /** move page order after target page id */
  movePageAfter: Page
  /** move page order before target page id */
  movePageBefore: Page
  /** opt in the WordPress feature */
  optInWordPressFeature: Scalars['Boolean']['output']
  /** opt out the WordPress feature */
  optOutWordPressFeature: Scalars['Boolean']['output']
  previewAppSubscription: PreviewAppSubscriptionType
  /** publish(schedule) an article */
  publishArticle: Article
  pullShopifyContent: Scalars['Boolean']['output']
  pullShopifyCustomers: Scalars['Boolean']['output']
  /** pull latest collections from Webflow */
  pullWebflowCollections: Array<WebflowCollection>
  /** pull latest sites from Webflow */
  pullWebflowSites: Array<WebflowSite>
  /** rebuild all sites */
  rebuildAllSites?: Maybe<Scalars['Boolean']['output']>
  /** @deprecated No longer supported */
  refreshToken: AuthToken
  /** remove author from article */
  removeAuthorFromArticle: Article
  /** remove account avatar */
  removeAvatar: User
  removeCustomDomain: Scalars['Boolean']['output']
  /** remove all site template */
  removeSiteTemplate: Scalars['Boolean']['output']
  /** remove tag from article */
  removeTagFromArticle: Article
  requestAppSetupIntent: Scalars['String']['output']
  /** request a presigned upload url for file upload */
  requestPresignedUploadURL: PresignedUploadUrl
  /**
   * request a SetupIntent,
   * reference: https://stripe.com/docs/api/setup_intents
   */
  requestSetupIntent: Scalars['String']['output']
  /** request a sign in to customer site */
  requestSignInSubscriber: Scalars['Boolean']['output']
  /** start a stripe connect */
  requestStripeConnect: Scalars['String']['output']
  /** resend confirmation email */
  resendConfirmEmail: Scalars['Boolean']['output']
  /** resend an invitation email */
  resendInvitation: Invitation
  /** reset account password */
  resetPassword: Scalars['Boolean']['output']
  /** resolve(delete) article's thread */
  resolveArticleThread: ArticleThread
  /** restore a deleted article */
  restoreArticle: Article
  resumeAppSubscription: Scalars['Boolean']['output']
  /** resume an existing subscription */
  resumeSubscriberSubscription: Scalars['Boolean']['output']
  /** revoke an invitation */
  revokeInvitation: Invitation
  /** revoke a manually created subscription */
  revokeSubscriberSubscription: Scalars['Boolean']['output']
  /** remove user from desk */
  revokeUserFromDesk: User
  /** run existing scraper */
  runScraper: Scraper
  /** manually send article newsletter */
  sendArticleNewsletter: Article
  /** send cold email to subscriber */
  sendColdEmailToSubscriber: Scalars['Boolean']['output']
  /** setup shopify oauth */
  setupShopifyOauth: Scalars['Boolean']['output']
  /** setup shopify redirections */
  setupShopifyRedirections: Scalars['Boolean']['output']
  /** setup the WordPress integration */
  setupWordPress: Scalars['Boolean']['output']
  /** sign an iframely request */
  signIframelySignature: Scalars['String']['output']
  /** sign in to the app */
  signIn: AuthToken
  /** sign up/in to customer site */
  signInLeakySubscriber: Scalars['String']['output']
  /** sign in to customer site */
  signInSubscriber: Scalars['String']['output']
  /** sign out of the app */
  signOut: Scalars['Boolean']['output']
  /** sign out of the customer site */
  signOutSubscriber: Scalars['Boolean']['output']
  /** sign up to the app */
  signUp: AuthToken
  /** sign up to customer site */
  signUpSubscriber: Scalars['String']['output']
  /** slug the provided value */
  sluggable: Scalars['String']['output']
  /** move article order after target article id */
  sortArticleBy: Scalars['Boolean']['output']
  /** start scraper articles transfer */
  startScraperTransfer: Scalars['Boolean']['output']
  /** enable newsletter for target subscribers */
  subscribeSubscribers: Scalars['Boolean']['output']
  /** get suggested article tags */
  suggestedArticleTag: Array<Scalars['String']['output']>
  /** summarize article */
  summarizeArticleContent: Scalars['String']['output']
  /** suspend an user */
  suspendUser: Array<User>
  swapAppSubscription: Scalars['Boolean']['output']
  /** Sync authors, desks and tags to Webflow site */
  syncContentToWebflow: Scalars['Boolean']['output']
  /** sync target model to custom field group */
  syncGroupableToCustomFieldGroup: CustomFieldGroup
  /** track subscriber activity */
  trackSubscriberActivity: Scalars['Boolean']['output']
  transferDeskArticles: Scalars['Boolean']['output']
  /** manually trigger article social sharing */
  triggerArticleSocialSharing: Scalars['Boolean']['output']
  /** trigger a site build */
  triggerSiteBuild?: Maybe<Scalars['ID']['output']>
  /** user unhide current request publication */
  unhidePublication: Scalars['Boolean']['output']
  /** unpublish an article */
  unpublishArticle: Article
  /** disable newsletter for target subscribers */
  unsubscribeSubscribers: Scalars['Boolean']['output']
  /** unsuspend an user */
  unsuspendUser: Array<User>
  updateAppPaymentMethod: Scalars['Boolean']['output']
  updateAppSubscriptionQuantity: Scalars['Boolean']['output']
  /** update an article data */
  updateArticle: Article
  /** update article's author info */
  updateArticleAuthor: Article
  /** update article's thread */
  updateArticleThread: ArticleThread
  /** update an existing custom block data */
  updateBlock: Block
  /** update an existing custom field data */
  updateCustomField: CustomField
  /** update an existing custom field group */
  updateCustomFieldGroup: CustomFieldGroup
  /** update an existing custom field value */
  updateCustomFieldValue: CustomFieldValue
  /** update an existing design data */
  updateDesign: Design
  /** update an existing desk data */
  updateDesk: Desk
  /** update integration data */
  updateIntegration: Integration
  /** update an existing layout data */
  updateLayout: Layout
  /** update an existing linter */
  updateLinter: Linter
  /** update article thread note */
  updateNote: ArticleThreadNote
  /** update an existing page data */
  updatePage: Page
  /** update subscriber payment method */
  updatePaymentMethod: Scalars['Boolean']['output']
  /** update account profile */
  updateProfile: User
  /** update an existing redirection data */
  updateRedirection: Redirection
  /** update an existing release data */
  updateRelease: Release
  /** update existing scraper */
  updateScraper: Scraper
  /** update scraper article */
  updateScraperArticle: ScraperArticle
  /** update publication data */
  updateSiteInfo: Site
  /** update an existing stage data */
  updateStage: Stage
  /** update an existing subscriber data */
  updateSubscriber: Subscriber
  /** update publication subscription */
  updateSubscription: Site
  /** update an existing tag data */
  updateTag: Tag
  /**
   * update an user profile
   * @deprecated No longer supported
   */
  updateUser: User
  /** update Webflow collection id */
  updateWebflowCollection: Scalars['Boolean']['output']
  /** update Webflow collection mapping */
  updateWebflowCollectionMapping: Scalars['Boolean']['output']
  /** update Webflow site domain */
  updateWebflowDomain: Scalars['Boolean']['output']
  /** update Webflow site id */
  updateWebflowSite: Scalars['Boolean']['output']
  /**
   * upload an image to specific article
   * @deprecated use uploadImage instead
   */
  uploadArticleImage: Scalars['String']['output']
  /**
   * update user avatar
   * @deprecated use uploadImage instead
   */
  uploadAvatar: Scalars['String']['output']
  /**
   * upload block preview image
   * @deprecated use uploadImage instead
   */
  uploadBlockPreview: Scalars['String']['output']
  /** update an image */
  uploadImage: Media
  /**
   * upload layout preview image
   * @deprecated use uploadImage instead
   */
  uploadLayoutPreview: Scalars['String']['output']
  /**
   * upload site logo
   * @deprecated use uploadImage instead
   */
  uploadSiteLogo: Scalars['String']['output']
  /** upload site template */
  uploadSiteTemplate: Array<SiteTemplate>
  /**
   * upload subscriber avatar
   * @deprecated use uploadImage instead
   */
  uploadSubscriberAvatar: Scalars['String']['output']
  /** verify subscriber email */
  verifySubscriberEmail: Scalars['Boolean']['output']
}

export type MutationActivateIntegrationArgs = {
  key: Scalars['ID']['input']
}

export type MutationAddAuthorToArticleArgs = {
  input: AddAuthorToArticleInput
}

export type MutationAddSlackChannelsArgs = {
  input: AddSlackChannelsInput
}

export type MutationAddTagToArticleArgs = {
  input: AddTagToArticleInput
}

export type MutationApplyCouponCodeToAppSubscriptionArgs = {
  input?: InputMaybe<ApplyCouponCodeToAppSubscriptionInput>
}

export type MutationApplyDealFuelCodeArgs = {
  input?: InputMaybe<ApplyDealFuelCodeInput>
}

export type MutationApplyViededingueCodeArgs = {
  input?: InputMaybe<ApplyViededingueCodeInput>
}

export type MutationAssignSubscriberSubscriptionArgs = {
  id: Scalars['ID']['input']
}

export type MutationAssignUserToDeskArgs = {
  input: AssignUserToDeskInput
}

export type MutationChangeAccountEmailArgs = {
  input: ChangeAccountEmailInput
}

export type MutationChangeAccountPasswordArgs = {
  input: UpdateAccountPasswordInput
}

export type MutationChangeArticleStageArgs = {
  input: ChangeArticleStageInput
}

export type MutationChangeSubscriberSubscriptionArgs = {
  price_id: Scalars['String']['input']
}

export type MutationChangeUserRoleArgs = {
  input: ChangeRoleInput
}

export type MutationChangeUserRoleForTestingArgs = {
  input: ChangeRoleInput
}

export type MutationCheckCustomDomainAvailabilityArgs = {
  input: CheckCustomDomainAvailabilityInput
}

export type MutationCheckEmailExistArgs = {
  email: Scalars['EmailString']['input']
}

export type MutationConfirmEmailArgs = {
  input: ConfirmEmailInput
}

export type MutationConfirmProphetCheckoutArgs = {
  input?: InputMaybe<ConfirmProphetCheckoutInput>
}

export type MutationCreateAppSubscriptionArgs = {
  input?: InputMaybe<CreateAppSubscriptionInput>
}

export type MutationCreateArticleArgs = {
  input: CreateArticleInput
}

export type MutationCreateArticleThreadArgs = {
  input: CreateArticleThreadInput
}

export type MutationCreateBlockArgs = {
  input: CreateBlockInput
}

export type MutationCreateCustomFieldArgs = {
  input: CreateCustomFieldInput
}

export type MutationCreateCustomFieldGroupArgs = {
  input: CreateCustomFieldGroupInput
}

export type MutationCreateCustomFieldValueArgs = {
  input: CreateCustomFieldValueInput
}

export type MutationCreateDeskArgs = {
  input: CreateDeskInput
}

export type MutationCreateInvitationArgs = {
  input: CreateInvitationInput
}

export type MutationCreateLayoutArgs = {
  input: CreateLayoutInput
}

export type MutationCreateLinkArgs = {
  input: CreateLinkInput
}

export type MutationCreateLinterArgs = {
  input: CreateLinterInput
}

export type MutationCreateNoteArgs = {
  input: CreateNoteInput
}

export type MutationCreatePageArgs = {
  input: CreatePageInput
}

export type MutationCreateRedirectionArgs = {
  input: CreateRedirectionInput
}

export type MutationCreateScraperArticleArgs = {
  input: CreateScraperArticleInput
}

export type MutationCreateScraperSelectorArgs = {
  input: CreateScraperSelectorInput
}

export type MutationCreateSiteArgs = {
  input: CreateSiteInput
}

export type MutationCreateStageArgs = {
  input: CreateStageInput
}

export type MutationCreateSubscriberSubscriptionArgs = {
  price_id: Scalars['String']['input']
}

export type MutationCreateTagArgs = {
  input: CreateTagInput
}

export type MutationCreateWebflowCollectionArgs = {
  input: CreateWebflowCollectionInput
}

export type MutationDeactivateIntegrationArgs = {
  key: Scalars['ID']['input']
}

export type MutationDeleteAccountArgs = {
  password: Scalars['String']['input']
}

export type MutationDeleteArticleArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteBlockArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteCustomFieldArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteCustomFieldGroupArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteCustomFieldValueArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteDeskArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteLayoutArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteLinterArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteNoteArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeletePageArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteRedirectionArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteScraperArticleArgs = {
  input: DeleteScraperArticleInput
}

export type MutationDeleteScraperSelectorArgs = {
  input: DeleteScraperSelectorInput
}

export type MutationDeleteSiteArgs = {
  password: Scalars['String']['input']
}

export type MutationDeleteSlackChannelsArgs = {
  input: DeleteSlackChannelsInput
}

export type MutationDeleteStageArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteSubscribersArgs = {
  ids: Array<Scalars['ID']['input']>
}

export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input']
}

export type MutationDisconnectIntegrationArgs = {
  key: Scalars['ID']['input']
}

export type MutationDuplicateArticleArgs = {
  id: Scalars['ID']['input']
}

export type MutationEnableCustomDomainArgs = {
  input: EnableCustomDomainInput
}

export type MutationForgotPasswordArgs = {
  email: Scalars['EmailString']['input']
}

export type MutationHidePublicationArgs = {
  id: Scalars['ID']['input']
}

export type MutationImpersonateArgs = {
  email: Scalars['EmailString']['input']
  password: Scalars['String']['input']
}

export type MutationImportSiteContentArgs = {
  input: ImportSiteContentInput
}

export type MutationImportSiteContentFromWordPressArgs = {
  input: ImportSiteContentFromWordPressInput
}

export type MutationImportSubscribersFromCsvFileArgs = {
  input: ImportSubscribersFromCsvFileInput
}

export type MutationInitializeCustomDomainArgs = {
  input: InitializeCustomDomainInput
}

export type MutationInitializeSiteArgs = {
  input: InitializeSiteInput
}

export type MutationLeavePublicationArgs = {
  id: Scalars['ID']['input']
}

export type MutationMakeStageDefaultArgs = {
  id: Scalars['ID']['input']
}

export type MutationMoveArticleAfterArgs = {
  input: MoveArticleAfterInput
}

export type MutationMoveArticleBeforeArgs = {
  input: MoveArticleBeforeInput
}

export type MutationMoveArticleToDeskArgs = {
  input: MoveArticleToDeskInput
}

export type MutationMoveDeskArgs = {
  input: MoveDeskInput
}

export type MutationMoveDeskAfterArgs = {
  input: MoveDeskAfterInput
}

export type MutationMoveDeskBeforeArgs = {
  input: MoveDeskBeforeInput
}

export type MutationMovePageAfterArgs = {
  input: MovePageAfterInput
}

export type MutationMovePageBeforeArgs = {
  input: MovePageBeforeInput
}

export type MutationOptInWordPressFeatureArgs = {
  input: OptInWordPressFeatureInput
}

export type MutationOptOutWordPressFeatureArgs = {
  input: OptOutWordPressFeatureInput
}

export type MutationPreviewAppSubscriptionArgs = {
  input: PreviewAppSubscriptionInput
}

export type MutationPublishArticleArgs = {
  input: PublishArticleInput
}

export type MutationPullWebflowCollectionsArgs = {
  refresh?: Scalars['Boolean']['input']
}

export type MutationPullWebflowSitesArgs = {
  refresh?: Scalars['Boolean']['input']
}

export type MutationRemoveAuthorFromArticleArgs = {
  input: RemoveAuthorFromArticleInput
}

export type MutationRemoveTagFromArticleArgs = {
  input: RemoveTagFromArticleInput
}

export type MutationRequestAppSetupIntentArgs = {
  input?: InputMaybe<RequestAppSetupIntentInput>
}

export type MutationRequestPresignedUploadUrlArgs = {
  md5?: InputMaybe<Scalars['String']['input']>
}

export type MutationRequestSignInSubscriberArgs = {
  input: RequestSignInSubscriberInput
}

export type MutationResendInvitationArgs = {
  id: Scalars['ID']['input']
}

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput
}

export type MutationResolveArticleThreadArgs = {
  id: Scalars['ID']['input']
}

export type MutationRestoreArticleArgs = {
  id: Scalars['ID']['input']
}

export type MutationRevokeInvitationArgs = {
  id: Scalars['ID']['input']
}

export type MutationRevokeSubscriberSubscriptionArgs = {
  id: Scalars['ID']['input']
}

export type MutationRevokeUserFromDeskArgs = {
  input: RevokeUserFromDeskInput
}

export type MutationRunScraperArgs = {
  input: RunScraperInput
}

export type MutationSendArticleNewsletterArgs = {
  id: Scalars['ID']['input']
}

export type MutationSendColdEmailToSubscriberArgs = {
  input: SendColdEmailToSubscriberInput
}

export type MutationSetupShopifyOauthArgs = {
  code: Scalars['String']['input']
}

export type MutationSetupWordPressArgs = {
  code: Scalars['String']['input']
}

export type MutationSignIframelySignatureArgs = {
  params: Scalars['JSON']['input']
}

export type MutationSignInArgs = {
  email: Scalars['EmailString']['input']
  password: Scalars['String']['input']
}

export type MutationSignInLeakySubscriberArgs = {
  input: SignInLeakySubscriberInput
}

export type MutationSignInSubscriberArgs = {
  token: Scalars['String']['input']
}

export type MutationSignUpArgs = {
  input: SignUpInput
}

export type MutationSignUpSubscriberArgs = {
  input: SignUpSubscriberInput
}

export type MutationSluggableArgs = {
  value: Scalars['String']['input']
}

export type MutationSortArticleByArgs = {
  input: SortArticleByInput
}

export type MutationStartScraperTransferArgs = {
  token: Scalars['String']['input']
}

export type MutationSubscribeSubscribersArgs = {
  ids: Array<Scalars['ID']['input']>
}

export type MutationSuggestedArticleTagArgs = {
  id: Scalars['ID']['input']
}

export type MutationSummarizeArticleContentArgs = {
  id: Scalars['ID']['input']
}

export type MutationSuspendUserArgs = {
  ids: Array<Scalars['ID']['input']>
}

export type MutationSwapAppSubscriptionArgs = {
  input?: InputMaybe<SwapAppSubscriptionInput>
}

export type MutationSyncGroupableToCustomFieldGroupArgs = {
  input: SyncGroupableToCustomFieldGroupInput
}

export type MutationTrackSubscriberActivityArgs = {
  input: TrackSubscriberActivityInput
}

export type MutationTransferDeskArticlesArgs = {
  input: TransferDeskArticlesInput
}

export type MutationTriggerArticleSocialSharingArgs = {
  id: Scalars['ID']['input']
}

export type MutationTriggerSiteBuildArgs = {
  input?: InputMaybe<TriggerSiteBuildInput>
}

export type MutationUnhidePublicationArgs = {
  id: Scalars['ID']['input']
}

export type MutationUnpublishArticleArgs = {
  id: Scalars['ID']['input']
}

export type MutationUnsubscribeSubscribersArgs = {
  ids: Array<Scalars['ID']['input']>
}

export type MutationUnsuspendUserArgs = {
  ids: Array<Scalars['ID']['input']>
}

export type MutationUpdateAppPaymentMethodArgs = {
  input?: InputMaybe<UpdateAppPaymentMethodInput>
}

export type MutationUpdateAppSubscriptionQuantityArgs = {
  input?: InputMaybe<UpdateAppSubscriptionQuantityInput>
}

export type MutationUpdateArticleArgs = {
  input: UpdateArticleInput
}

export type MutationUpdateArticleAuthorArgs = {
  input: UpdateArticleAuthorInput
}

export type MutationUpdateArticleThreadArgs = {
  input: UpdateArticleThreadInput
}

export type MutationUpdateBlockArgs = {
  input: UpdateBlockInput
}

export type MutationUpdateCustomFieldArgs = {
  input: UpdateCustomFieldInput
}

export type MutationUpdateCustomFieldGroupArgs = {
  input: UpdateCustomFieldGroupInput
}

export type MutationUpdateCustomFieldValueArgs = {
  input: UpdateCustomFieldValueInput
}

export type MutationUpdateDesignArgs = {
  input: UpdateDesignInput
}

export type MutationUpdateDeskArgs = {
  input: UpdateDeskInput
}

export type MutationUpdateIntegrationArgs = {
  input: UpdateIntegrationInput
}

export type MutationUpdateLayoutArgs = {
  input: UpdateLayoutInput
}

export type MutationUpdateLinterArgs = {
  input: UpdateLinterInput
}

export type MutationUpdateNoteArgs = {
  input: UpdateNoteInput
}

export type MutationUpdatePageArgs = {
  input: UpdatePageInput
}

export type MutationUpdatePaymentMethodArgs = {
  pm_id: Scalars['String']['input']
}

export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput
}

export type MutationUpdateRedirectionArgs = {
  input: UpdateRedirectionInput
}

export type MutationUpdateReleaseArgs = {
  input: UpdateReleaseInput
}

export type MutationUpdateScraperArgs = {
  input: UpdateScraperInput
}

export type MutationUpdateScraperArticleArgs = {
  input: UpdateScraperArticleInput
}

export type MutationUpdateSiteInfoArgs = {
  input: UpdateSiteInput
}

export type MutationUpdateStageArgs = {
  input: UpdateStageInput
}

export type MutationUpdateSubscriberArgs = {
  input: UpdateSubscriberInput
}

export type MutationUpdateSubscriptionArgs = {
  input: EnableSubscriptionInput
}

export type MutationUpdateTagArgs = {
  input: UpdateTagInput
}

export type MutationUpdateUserArgs = {
  input: UpdateUserInput
}

export type MutationUpdateWebflowCollectionArgs = {
  input: UpdateWebflowCollectionInput
}

export type MutationUpdateWebflowCollectionMappingArgs = {
  input: UpdateWebflowCollectionMappingInput
}

export type MutationUpdateWebflowDomainArgs = {
  input: UpdateWebflowDomainInput
}

export type MutationUpdateWebflowSiteArgs = {
  input: UpdateWebflowSiteInput
}

export type MutationUploadArticleImageArgs = {
  input: UploadArticleImageInput
}

export type MutationUploadAvatarArgs = {
  input: UploadAvatarInput
}

export type MutationUploadBlockPreviewArgs = {
  input: UploadBlockPreviewInput
}

export type MutationUploadImageArgs = {
  input: UploadImageInput
}

export type MutationUploadLayoutPreviewArgs = {
  input: UploadLayoutPreviewInput
}

export type MutationUploadSiteLogoArgs = {
  file: Scalars['Upload']['input']
}

export type MutationUploadSiteTemplateArgs = {
  input: UploadSiteTemplateInput
}

export type MutationUploadSubscriberAvatarArgs = {
  input: UploadSubscriberAvatarInput
}

export type MutationVerifySubscriberEmailArgs = {
  token: Scalars['String']['input']
}

export type Notification = {
  __typename?: 'Notification'
  /** notification meta data */
  data?: Maybe<Scalars['JSON']['output']>
  /** notification id */
  id: Scalars['ID']['output']
  /** notification create time */
  occurred_at: Scalars['DateTime']['output']
  /** notification state */
  type: Scalars['String']['output']
}

export type OptInWordPressFeatureInput = {
  /** feature Type */
  key: WordPressOptionalFeatureType
}

export type OptOutWordPressFeatureInput = {
  /** feature Type */
  key: WordPressOptionalFeatureType
}

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String']['input']
  /** The direction that is used for ordering. */
  order: SortOrder
}

/** Aggregate functions when ordering by a relation without specifying a column. */
export enum OrderByRelationAggregateFunction {
  /** Amount of items. */
  Count = 'COUNT',
}

/** Aggregate functions when ordering by a relation that may specify a column. */
export enum OrderByRelationWithColumnAggregateFunction {
  /** Average. */
  Avg = 'AVG',
  /** Amount of items. */
  Count = 'COUNT',
  /** Maximum. */
  Max = 'MAX',
  /** Minimum. */
  Min = 'MIN',
  /** Sum. */
  Sum = 'SUM',
}

export type Page = {
  __typename?: 'Page'
  /** live content */
  current?: Maybe<Scalars['JSON']['output']>
  /** draft content */
  draft?: Maybe<Scalars['JSON']['output']>
  /** page id */
  id: Scalars['ID']['output']
  /** layout id */
  layout?: Maybe<Layout>
  /** page order */
  order: Scalars['Int']['output']
  /** seo meta data */
  seo?: Maybe<Scalars['JSON']['output']>
  /**
   * page title,
   * e.g. About Us
   */
  title: Scalars['String']['output']
}

/** Information about pagination using a Relay style cursor connection. */
export type PageInfo = {
  __typename?: 'PageInfo'
  /** Number of nodes in the current page. */
  count: Scalars['Int']['output']
  /** Index of the current page. */
  currentPage: Scalars['Int']['output']
  /** The cursor to continue paginating forwards. */
  endCursor?: Maybe<Scalars['String']['output']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output']
  /** Index of the last available page. */
  lastPage: Scalars['Int']['output']
  /** The cursor to continue paginating backwards. */
  startCursor?: Maybe<Scalars['String']['output']>
  /** Total number of nodes in the paginated connection. */
  total: Scalars['Int']['output']
}

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: 'PaginatorInfo'
  /** Number of items in the current page. */
  count: Scalars['Int']['output']
  /** Index of the current page. */
  currentPage: Scalars['Int']['output']
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']['output']>
  /** Are there more pages after this one? */
  hasMorePages: Scalars['Boolean']['output']
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']['output']>
  /** Index of the last available page. */
  lastPage: Scalars['Int']['output']
  /** Number of items per page. */
  perPage: Scalars['Int']['output']
  /** Number of total available items. */
  total: Scalars['Int']['output']
}

export type PreviewAppSubscriptionInput = {
  price_id: Scalars['String']['input']
  promotion_code?: InputMaybe<Scalars['String']['input']>
  quantity?: InputMaybe<Scalars['Int']['input']>
}

export type PreviewAppSubscriptionType = {
  __typename?: 'PreviewAppSubscriptionType'
  credit: Scalars['String']['output']
  discount: Scalars['String']['output']
  subtotal: Scalars['String']['output']
  tax: Scalars['String']['output']
  total: Scalars['String']['output']
}

/** subset of site(publication) */
export type Publication = {
  __typename?: 'Publication'
  /** publication custom domain */
  custom_domain?: Maybe<Scalars['String']['output']>
  /**
   * publication customer site domain
   * e.g. hello.storipress.app, example.com
   */
  customer_site_domain: Scalars['String']['output']
  /** publication description */
  description?: Maybe<Scalars['String']['output']>
  /** publication favicon */
  favicon?: Maybe<Scalars['String']['output']>
  /** publication id */
  id: Scalars['ID']['output']
  /** publication name */
  name: Scalars['String']['output']
  /**
   * publication storipress domain prefix,
   * e.g. {workspace}.storipress.app
   */
  workspace: Scalars['String']['output']
}

export type PublishArticleInput = {
  /** article id */
  id: Scalars['ID']['input']
  /**
   * set article stage to live(reviewed),
   * published_at will not be changed
   */
  now?: InputMaybe<Scalars['Boolean']['input']>
  /** publish time(ISO 8601 format) */
  time?: InputMaybe<Scalars['String']['input']>
  /**
   * set article published_at to
   * server current time
   */
  useServerCurrentTime?: InputMaybe<Scalars['Boolean']['input']>
}

export type Query = {
  __typename?: 'Query'
  appSubscriptionPlans: Array<AppSubscriptionPlans>
  /** get specific article */
  article?: Maybe<Article>
  articleDecryptKey?: Maybe<Scalars['String']['output']>
  /** get article typesense search key */
  articleSearchKey: Scalars['String']['output']
  /** using pagination to fetch articles */
  articles: ArticlePaginator
  /**
   * fetch articles apply one of following constraints(mutually exclusive):
   * - schedule/publish time is between `from` and `to`
   * - unscheduled articles
   * @deprecated use articles query
   */
  articlesAll: Array<Article>
  articlesCursor: ArticleConnection
  billing: Billing
  /** get specific block */
  block?: Maybe<Block>
  /** fetch blocks */
  blocks: BlockPaginator
  /** fetch credits */
  credits: CreditPaginator
  creditsOverview: Array<CreditsOverview>
  customFieldGroup?: Maybe<CustomFieldGroup>
  customFieldGroups: CustomFieldGroupPaginator
  /** get specific design */
  design?: Maybe<Design>
  /** fetch designs */
  designs: Array<Design>
  desk?: Maybe<Desk>
  /** fetch desks */
  desks: Array<Desk>
  /** get specific email */
  email?: Maybe<Email>
  facebookPages: Array<FacebookSearchPage>
  /** whether the HubSpot OAuth has been completed or not */
  hubSpotAuthorized: Scalars['Boolean']['output']
  /** get HubSpot information */
  hubSpotInfo: HubSpotInfo
  /**
   * make a iframely request for specific url
   * @deprecated use signIframelySignature mutation
   */
  iframelyIframely: Scalars['JSON']['output']
  /** image info */
  image: Image
  /** fetch integrations */
  integrations: Array<Integration>
  invitations: Array<Invitation>
  /** get specific layout */
  layout?: Maybe<Layout>
  /** fetch layouts */
  layouts: Array<Layout>
  /** fetch link */
  link: Link
  /** fetch linters */
  linters: LinterConnection
  /** account profile */
  me: User
  /** media info */
  media: Media
  /** fetch notifications */
  notifications: Array<Notification>
  /** get specific page */
  page?: Maybe<Page>
  /** fetch pages */
  pages: Array<Page>
  /** all publications owned by the account */
  publications: Array<Publication>
  /** fetch redirections */
  redirections: Array<Redirection>
  /** get specific release */
  release?: Maybe<Release>
  /** fetch releases */
  releases: ReleasePaginator
  /** fetch roles */
  roles: Array<Role>
  /** get specific scraper */
  scraper?: Maybe<Scraper>
  /** list pending invite users */
  scraperPendingInviteUsers: Array<Scalars['String']['output']>
  /** fetch scrapers */
  scrapers: ScraperPaginator
  searchShopifyProducts: ShopifyCollection
  shopifyProducts: ShopifyCollection
  /** get publication data */
  site: Site
  /** get publication subscription info */
  siteSubscriptionInfo: SiteSubscriptionInfo
  siteTemplates: Array<SiteTemplate>
  /** fetch stages */
  stages: Array<Stage>
  /** get specific subscriber */
  subscriber?: Maybe<Subscriber>
  subscriberPainPoints: Array<SubscriberPainPoint>
  /** get subscriber profile for current request user */
  subscriberProfile?: Maybe<Subscriber>
  /** fetch subscribers */
  subscribers: SubscriberPaginator
  /** publication subscription subscribers and revenue info */
  subscriptionGraphs: SubscriptionGraphs
  /** publication subscription overview info */
  subscriptionOverview: SubscriptionOverview
  /** get specific tag */
  tag?: Maybe<Tag>
  /** fetch tags */
  tags: Array<Tag>
  /** trigger a download for specific image */
  unsplashDownload: Scalars['String']['output']
  /** random list some images */
  unsplashList: Scalars['JSON']['output']
  /** search unsplash image */
  unsplashSearch: Scalars['JSON']['output']
  /** get specific user data */
  user?: Maybe<User>
  /** fetch users */
  users: Array<User>
  /** whether the Webflow OAuth has been completed or not */
  webflowAuthorized: Scalars['Boolean']['output']
  /** get Webflow collection information */
  webflowCollection?: Maybe<WebflowCollection>
  /** get all Webflow collections */
  webflowCollections: Array<WebflowCollection>
  /** get Webflow information */
  webflowInfo: WebflowInfo
  /** get all Webflow items for specific collection */
  webflowItems: Array<WebflowItem>
  /** get Webflow onboarding status */
  webflowOnboarding: WebflowOnboarding
  /** get all Webflow sites */
  webflowSites: Array<WebflowSite>
  /** whether the WordPress connection has been completed or not */
  wordPressAuthorized: Scalars['Boolean']['output']
  /** get WordPress information */
  wordPressInfo: WordPressInfo
  /** all publications joined by the account */
  workspaces: Array<Workspace>
}

export type QueryArticleArgs = {
  hasDesk?: InputMaybe<WhereConditions>
  id?: InputMaybe<Scalars['ID']['input']>
  sid?: InputMaybe<Scalars['ID']['input']>
  slug?: InputMaybe<Scalars['String']['input']>
}

export type QueryArticleDecryptKeyArgs = {
  id: Scalars['ID']['input']
}

export type QueryArticlesArgs = {
  desk?: InputMaybe<Scalars['ID']['input']>
  desk_ids?: InputMaybe<Array<Scalars['ID']['input']>>
  featured?: InputMaybe<Scalars['Boolean']['input']>
  first?: Scalars['Int']['input']
  hasDesk?: InputMaybe<WhereConditions>
  page?: InputMaybe<Scalars['Int']['input']>
  published?: InputMaybe<Scalars['Boolean']['input']>
  scheduledRange?: InputMaybe<DateRange>
  sortBy?: InputMaybe<Array<QueryArticlesSortByOrderByClause>>
  unscheduled?: InputMaybe<Scalars['Boolean']['input']>
}

export type QueryArticlesAllArgs = {
  hasDesk?: InputMaybe<WhereConditions>
  range?: InputMaybe<DateRange>
  unscheduled?: InputMaybe<Scalars['Boolean']['input']>
}

export type QueryArticlesCursorArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  desk_ids?: InputMaybe<Array<Scalars['ID']['input']>>
  featured?: InputMaybe<Scalars['Boolean']['input']>
  first?: Scalars['Int']['input']
  hasDesk?: InputMaybe<WhereConditions>
  published?: InputMaybe<Scalars['Boolean']['input']>
  scheduledRange?: InputMaybe<DateRange>
  sortBy?: InputMaybe<Array<QueryArticlesCursorSortByOrderByClause>>
  unscheduled?: InputMaybe<Scalars['Boolean']['input']>
}

export type QueryBlockArgs = {
  id: Scalars['ID']['input']
}

export type QueryBlocksArgs = {
  first?: Scalars['Int']['input']
  page?: InputMaybe<Scalars['Int']['input']>
}

export type QueryCreditsArgs = {
  first?: Scalars['Int']['input']
  page?: InputMaybe<Scalars['Int']['input']>
  state?: InputMaybe<CreditState>
}

export type QueryCustomFieldGroupArgs = {
  id?: InputMaybe<Scalars['ID']['input']>
  key?: InputMaybe<Scalars['ID']['input']>
}

export type QueryCustomFieldGroupsArgs = {
  first?: Scalars['Int']['input']
  page?: InputMaybe<Scalars['Int']['input']>
}

export type QueryDesignArgs = {
  key: Scalars['ID']['input']
}

export type QueryDeskArgs = {
  id?: InputMaybe<Scalars['ID']['input']>
  sid?: InputMaybe<Scalars['ID']['input']>
  slug?: InputMaybe<Scalars['String']['input']>
}

export type QueryEmailArgs = {
  id: Scalars['ID']['input']
}

export type QueryFacebookPagesArgs = {
  keyword: Scalars['String']['input']
}

export type QueryIframelyIframelyArgs = {
  input: IframelyIframelyInput
}

export type QueryImageArgs = {
  key: Scalars['ID']['input']
}

export type QueryLayoutArgs = {
  id: Scalars['ID']['input']
}

export type QueryLinkArgs = {
  id: Scalars['ID']['input']
}

export type QueryLintersArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: Scalars['Int']['input']
}

export type QueryMediaArgs = {
  key: Scalars['ID']['input']
}

export type QueryPageArgs = {
  id: Scalars['ID']['input']
}

export type QueryReleaseArgs = {
  id: Scalars['ID']['input']
}

export type QueryReleasesArgs = {
  first?: Scalars['Int']['input']
  page?: InputMaybe<Scalars['Int']['input']>
}

export type QueryScraperArgs = {
  token: Scalars['String']['input']
}

export type QueryScraperPendingInviteUsersArgs = {
  token: Scalars['String']['input']
}

export type QueryScrapersArgs = {
  first?: Scalars['Int']['input']
  page?: InputMaybe<Scalars['Int']['input']>
}

export type QuerySearchShopifyProductsArgs = {
  keyword: Scalars['String']['input']
}

export type QueryShopifyProductsArgs = {
  page_info?: InputMaybe<Scalars['String']['input']>
}

export type QuerySiteTemplatesArgs = {
  type?: InputMaybe<TemplateType>
}

export type QuerySubscriberArgs = {
  id: Scalars['ID']['input']
}

export type QuerySubscriberPainPointsArgs = {
  id: Scalars['ID']['input']
}

export type QuerySubscribersArgs = {
  first?: Scalars['Int']['input']
  page?: InputMaybe<Scalars['Int']['input']>
  search?: InputMaybe<Scalars['String']['input']>
  searchSortBy?: InputMaybe<Array<QuerySubscribersSearchSortByOrderByClause>>
  sortBy?: InputMaybe<Array<QuerySubscribersSortByOrderByClause>>
}

export type QueryTagArgs = {
  id?: InputMaybe<Scalars['ID']['input']>
  sid?: InputMaybe<Scalars['ID']['input']>
  slug?: InputMaybe<Scalars['String']['input']>
}

export type QueryUnsplashDownloadArgs = {
  id?: InputMaybe<Scalars['String']['input']>
}

export type QueryUnsplashListArgs = {
  page: Scalars['Int']['input']
}

export type QueryUnsplashSearchArgs = {
  input: UnsplashSearchInput
}

export type QueryUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>
  slug?: InputMaybe<Scalars['String']['input']>
}

export type QueryUsersArgs = {
  includeInvitations?: InputMaybe<Scalars['Boolean']['input']>
}

export type QueryWebflowCollectionArgs = {
  type: WebflowCollectionType
}

export type QueryWebflowItemsArgs = {
  collection_id: Scalars['ID']['input']
}

/** Allowed column names for Query.articlesCursor.sortBy. */
export enum QueryArticlesCursorSortByColumn {
  PublishedAt = 'PUBLISHED_AT',
  UpdatedAt = 'UPDATED_AT',
}

/** Order by clause for Query.articlesCursor.sortBy. */
export type QueryArticlesCursorSortByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryArticlesCursorSortByColumn
  /** The direction that is used for ordering. */
  order: SortOrder
}

/** Allowed column names for Query.articles.sortBy. */
export enum QueryArticlesSortByColumn {
  PublishedAt = 'PUBLISHED_AT',
  UpdatedAt = 'UPDATED_AT',
}

/** Order by clause for Query.articles.sortBy. */
export type QueryArticlesSortByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryArticlesSortByColumn
  /** The direction that is used for ordering. */
  order: SortOrder
}

/** Allowed column names for Query.subscribers.searchSortBy. */
export enum QuerySubscribersSearchSortByColumn {
  Activity = 'ACTIVITY',
  CreatedAt = 'CREATED_AT',
  Email = 'EMAIL',
  Revenue = 'REVENUE',
  SubscribedAt = 'SUBSCRIBED_AT',
}

/** Order by clause for Query.subscribers.searchSortBy. */
export type QuerySubscribersSearchSortByOrderByClause = {
  /** The column that is used for ordering. */
  column: QuerySubscribersSearchSortByColumn
  /** The direction that is used for ordering. */
  order: SortOrder
}

/** Allowed column names for Query.subscribers.sortBy. */
export enum QuerySubscribersSortByColumn {
  Activity = 'ACTIVITY',
  CreatedAt = 'CREATED_AT',
  Revenue = 'REVENUE',
  SubscribedAt = 'SUBSCRIBED_AT',
}

/** Order by clause for Query.subscribers.sortBy. */
export type QuerySubscribersSortByOrderByClause = {
  /** The column that is used for ordering. */
  column: QuerySubscribersSortByColumn
  /** The direction that is used for ordering. */
  order: SortOrder
}

export type Redirection = {
  __typename?: 'Redirection'
  /** redirection id */
  id: Scalars['ID']['output']
  /** redirection path */
  path: Scalars['String']['output']
  /** redirection target */
  target: Scalars['String']['output']
}

export type Release = {
  __typename?: 'Release'
  /** release create time */
  created_at: Scalars['DateTime']['output']
  /** release elapsed time */
  elapsed_time: Scalars['Int']['output']
  /** release id */
  id: Scalars['ID']['output']
  /** release meta data */
  meta?: Maybe<Scalars['JSON']['output']>
  /** release state */
  state: ReleaseState
  /** release update time */
  updated_at: Scalars['DateTime']['output']
}

/** A paginated list of Release items. */
export type ReleasePaginator = {
  __typename?: 'ReleasePaginator'
  /** A list of Release items. */
  data: Array<Release>
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo
}

/** State */
export enum ReleaseState {
  /** the release was aborted by user */
  Aborted = 'aborted',
  /** the release was canceled by system, e.g. a new release is triggered */
  Canceled = 'canceled',
  /** generator is compressing the site data for uploading to our CDN servers */
  Compressing = 'compressing',
  /** the release was built successfully */
  Done = 'done',
  /** there is something wrong when building the site */
  Error = 'error',
  /** generator is building static site data */
  Generating = 'generating',
  /** generator is preparing the site data */
  Preparing = 'preparing',
  /** the release was still in queue, this is default state */
  Queued = 'queued',
  /** generator is uploading the archive file to our CDN servers */
  Uploading = 'uploading',
}

/** Type */
export enum ReleaseType {
  /** article type build */
  Article = 'article',
}

/** remove author from article form */
export type RemoveAuthorFromArticleInput = {
  /** article id */
  id: Scalars['ID']['input']
  /** user id(author id) */
  user_id: Scalars['ID']['input']
}

/** remove tag from article form */
export type RemoveTagFromArticleInput = {
  /** article id */
  id: Scalars['ID']['input']
  /** tag id */
  tag_id: Scalars['ID']['input']
}

export type RequestAppSetupIntentInput = {
  payment?: InputMaybe<Scalars['String']['input']>
}

export type RequestSignInSubscriberInput = {
  /** subscriber email */
  email: Scalars['EmailString']['input']
  /** current url, used for redirect back */
  from: Scalars['String']['input']
  /** http referer */
  referer: Scalars['String']['input']
}

export type ResetPasswordInput = {
  /** target account email */
  email: Scalars['String']['input']
  /** link expire time */
  expired_at: Scalars['Int']['input']
  /** new password */
  password: Scalars['String']['input']
  /** link signature */
  signature: Scalars['String']['input']
  /** identify token */
  token: Scalars['String']['input']
}

export type RevenueGraph = {
  __typename?: 'RevenueGraph'
  /** date */
  date: Scalars['Date']['output']
  /** month of the data */
  month: Scalars['Int']['output']
  /** revenue */
  revenue: Scalars['String']['output']
  /** year of the data */
  year: Scalars['Int']['output']
}

export type RevokeUserFromDeskInput = {
  /** desk id */
  desk_id: Scalars['ID']['input']
  /** user id */
  user_id: Scalars['ID']['input']
}

export type Role = {
  __typename?: 'Role'
  /** role id */
  id: Scalars['ID']['output']
  /** role level */
  level: Scalars['Float']['output']
  /** role name */
  name: Scalars['String']['output']
  /** role brief description */
  title: Scalars['String']['output']
}

export type RunScraperInput = {
  /** scraper token */
  token: Scalars['String']['input']
  /** scrape type */
  type: ScraperType
}

/** The available SQL operators that are used to filter query results. */
export enum SqlOperator {
  /** Whether a value is within a range of values (`BETWEEN`) */
  Between = 'BETWEEN',
  /** Equal operator (`=`) */
  Eq = 'EQ',
  /** Greater than operator (`>`) */
  Gt = 'GT',
  /** Greater than or equal operator (`>=`) */
  Gte = 'GTE',
  /** Whether a value is within a set of values (`IN`) */
  In = 'IN',
  /** Whether a value is not null (`IS NOT NULL`) */
  IsNotNull = 'IS_NOT_NULL',
  /** Whether a value is null (`IS NULL`) */
  IsNull = 'IS_NULL',
  /** Simple pattern matching (`LIKE`) */
  Like = 'LIKE',
  /** Less than operator (`<`) */
  Lt = 'LT',
  /** Less than or equal operator (`<=`) */
  Lte = 'LTE',
  /** Not equal operator (`!=`) */
  Neq = 'NEQ',
  /** Whether a value is not within a range of values (`NOT BETWEEN`) */
  NotBetween = 'NOT_BETWEEN',
  /** Whether a value is not within a set of values (`NOT IN`) */
  NotIn = 'NOT_IN',
  /** Negation of simple pattern matching (`NOT LIKE`) */
  NotLike = 'NOT_LIKE',
}

export type Scraper = {
  __typename?: 'Scraper'
  /** scrapper articles */
  articles: ScraperArticlePaginator
  /**
   * time that the scraper cancelled,
   * will only have value on user cancelled
   */
  cancelled_at?: Maybe<Scalars['DateTime']['output']>
  /** arbitrary data */
  data?: Maybe<Scalars['JSON']['output']>
  /** scraping failed articles */
  failed: Scalars['Int']['output']
  /**
   * time that the scraper failed,
   * will only have value when something went wrong
   */
  failed_at?: Maybe<Scalars['DateTime']['output']>
  /**
   * time that the scraper finished,
   * will only have value on successful execution
   */
  finished_at?: Maybe<Scalars['DateTime']['output']>
  /** scraper id */
  id: Scalars['ID']['output']
  /** scrapper selectors */
  selectors: Array<ScraperSelector>
  /** time that the scraper started */
  started_at?: Maybe<Scalars['DateTime']['output']>
  /** scraper state */
  state: ScraperState
  /** successfully scraped articles */
  successful: Scalars['Int']['output']
  /** total articles */
  total: Scalars['Int']['output']
}

export type ScraperArticlesArgs = {
  first?: Scalars['Int']['input']
  page?: InputMaybe<Scalars['Int']['input']>
}

export type ScraperArticle = {
  __typename?: 'ScraperArticle'
  /** scraped article data */
  data?: Maybe<Scalars['JSON']['output']>
  /** article id */
  id: Scalars['ID']['output']
  /** url path */
  path: Scalars['String']['output']
  /** whether the article is scraped or not */
  scraped: Scalars['Boolean']['output']
  /** the article scraped time */
  scraped_at?: Maybe<Scalars['DateTime']['output']>
  /** whether the article is scraped successfully or not */
  successful: Scalars['Boolean']['output']
}

/** A paginated list of ScraperArticle items. */
export type ScraperArticlePaginator = {
  __typename?: 'ScraperArticlePaginator'
  /** A list of ScraperArticle items. */
  data: Array<ScraperArticle>
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo
}

/** A paginated list of Scraper items. */
export type ScraperPaginator = {
  __typename?: 'ScraperPaginator'
  /** A list of Scraper items. */
  data: Array<Scraper>
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo
}

export type ScraperSelector = {
  __typename?: 'ScraperSelector'
  /** selector data(additional arbitrary data) */
  data?: Maybe<Scalars['JSON']['output']>
  /** selector id */
  id: Scalars['ID']['output']
  /**
   * selector type,
   * e.g. title, logo...
   */
  type: Scalars['String']['output']
  /** selector value */
  value?: Maybe<Scalars['String']['output']>
}

/** State */
export enum ScraperState {
  /** the scraper was completed, e.g. done, failed or cancelled */
  Completed = 'completed',
  /** the scraper was initialized */
  Initialized = 'initialized',
  /** the scraper is processing */
  Processing = 'processing',
}

/** Type */
export enum ScraperType {
  /** scrape all articles */
  Full = 'full',
  /** only scrape few articles for preview */
  Preview = 'preview',
}

export type SendColdEmailToSubscriberInput = {
  /** email content */
  content: Scalars['String']['input']
  /** subscriber id */
  id: Scalars['String']['input']
  /** reply to for the email */
  reply_to?: InputMaybe<Scalars['EmailString']['input']>
  /** email subject */
  subject: Scalars['String']['input']
}

export type ShopifyCollection = {
  __typename?: 'ShopifyCollection'
  page_info?: Maybe<Scalars['String']['output']>
  products: Array<ShopifyProduct>
}

export type ShopifyConfiguration = {
  __typename?: 'ShopifyConfiguration'
  /** shopify store domain */
  domain?: Maybe<Scalars['String']['output']>
  /** shopify store id */
  id: Scalars['String']['output']
  /** myshopify domain */
  myshopify_domain: Scalars['String']['output']
  /** shopify store name */
  name: Scalars['String']['output']
  /** shopify app url prefix */
  prefix: Scalars['String']['output']
}

export type ShopifyProduct = {
  __typename?: 'ShopifyProduct'
  id: Scalars['ID']['output']
  images: Array<ShopifyProductImage>
  path: Scalars['String']['output']
  slug: Scalars['String']['output']
  title: Scalars['String']['output']
  variants: Array<ShopifyProductVariant>
}

export type ShopifyProductImage = {
  __typename?: 'ShopifyProductImage'
  height: Scalars['Int']['output']
  id: Scalars['ID']['output']
  product_id: Scalars['ID']['output']
  src: Scalars['String']['output']
  width: Scalars['Int']['output']
}

export type ShopifyProductVariant = {
  __typename?: 'ShopifyProductVariant'
  id: Scalars['ID']['output']
  images: Array<ShopifyProductImage>
  price: Scalars['String']['output']
  sku: Scalars['String']['output']
  title: Scalars['String']['output']
}

export type SignInLeakySubscriberInput = {
  /** subscriber email */
  email: Scalars['EmailString']['input']
}

export type SignUpInput = {
  appsumo_code?: InputMaybe<Scalars['String']['input']>
  campaign?: InputMaybe<Scalars['JSON']['input']>
  checkout_id?: InputMaybe<Scalars['String']['input']>
  /** account email */
  email: Scalars['EmailString']['input']
  /**
   * user first name,
   * e.g. 大明
   */
  first_name?: InputMaybe<Scalars['String']['input']>
  /** invite token */
  invite_token?: InputMaybe<Scalars['String']['input']>
  /**
   * user last name,
   * e.g. 王
   */
  last_name?: InputMaybe<Scalars['String']['input']>
  /** account password */
  password: Scalars['String']['input']
  /** publication name */
  publication_name?: InputMaybe<Scalars['String']['input']>
  /** publication timezone */
  timezone?: InputMaybe<Scalars['String']['input']>
}

export type SignUpSubscriberInput = {
  /** subscriber email */
  email: Scalars['EmailString']['input']
  /** current url, used for redirect back */
  from: Scalars['String']['input']
  /** http referer */
  referer: Scalars['String']['input']
}

/** publication */
export type Site = {
  __typename?: 'Site'
  /** subscription panel background color */
  accent_color?: Maybe<Scalars['String']['output']>
  /** generator configurations */
  buildx?: Maybe<Scalars['JSON']['output']>
  /** subscription currency */
  currency?: Maybe<Scalars['String']['output']>
  /** publication custom domain */
  custom_domain?: Maybe<Scalars['String']['output']>
  /** configuration for custom domain email */
  custom_domain_email: Array<EmailDnsRecord>
  /** enable custom site template or not */
  custom_site_template: Scalars['Boolean']['output']
  /**
   * publication customer site domain
   * e.g. hello.storipress.app, example.com
   */
  customer_site_domain: Scalars['String']['output']
  /**
   * publication customer site storipress domain
   * e.g. hello.storipress.app
   */
  customer_site_storipress_url: Scalars['String']['output']
  /** publication description */
  description?: Maybe<Scalars['String']['output']>
  /** built-in desks' names alias */
  desk_alias?: Maybe<Scalars['JSON']['output']>
  /** publication email */
  email?: Maybe<Scalars['EmailString']['output']>
  /** publication enabled or not */
  enabled: Scalars['Boolean']['output']
  /** publication favicon, base64 type */
  favicon?: Maybe<Scalars['String']['output']>
  has_prophet: Scalars['Boolean']['output']
  /** main hosting site */
  hosting?: Maybe<SiteHosting>
  /** publication id */
  id: Scalars['ID']['output']
  /** publication initialized or not */
  initialized: Scalars['Boolean']['output']
  /** RFC 5646 Language Tags */
  lang: Scalars['String']['output']
  /** publication logo image */
  logo?: Maybe<Image>
  /** mail custom domain */
  mail_domain?: Maybe<Scalars['String']['output']>
  metafields: Array<CustomField>
  /** subscription monthly price */
  monthly_price?: Maybe<Scalars['String']['output']>
  /** publication name */
  name: Scalars['String']['output']
  /** enable newsletter or not */
  newsletter: Scalars['Boolean']['output']
  /** newstand api key */
  newstand_key?: Maybe<Scalars['String']['output']>
  /** leaky paywall configurations */
  paywall_config?: Maybe<Scalars['JSON']['output']>
  /** static site url structures */
  permalinks?: Maybe<Scalars['JSON']['output']>
  /**
   * publication subscription plan:
   * - free
   * - blogger(stripe)
   * - publisher(stripe)
   * - enterprise(stripe)
   * - storipress_tier1(appsumo)
   * - storipress_tier2(appsumo)
   * - storipress_tier3(appsumo)
   * - storipress_bf_tier1(appsumo)
   * - storipress_bf_tier2(appsumo)
   * - storipress_bf_tier3(appsumo)
   */
  plan: Scalars['String']['output']
  /** prophet configurations */
  prophet_config?: Maybe<Scalars['JSON']['output']>
  /** site custom domain */
  site_domain?: Maybe<Scalars['String']['output']>
  /** customized sitemap */
  sitemap?: Maybe<Scalars['JSON']['output']>
  /** social network links */
  socials?: Maybe<Scalars['JSON']['output']>
  /** enable subscription or not */
  subscription: Scalars['Boolean']['output']
  /** subscription setup status */
  subscription_setup: SubscriptionSetup
  /** subscription setup has done once */
  subscription_setup_done: Scalars['Boolean']['output']
  /** publication timezone */
  timezone: Scalars['String']['output']
  /** publication tutorial history */
  tutorials?: Maybe<Scalars['JSON']['output']>
  /** the search only key for typesense */
  typesense_search_only_key: Scalars['String']['output']
  /**
   * publication storipress domain prefix,
   * e.g. {workspace}.storipress.app
   */
  workspace: Scalars['String']['output']
  /** subscription yearly price */
  yearly_price?: Maybe<Scalars['String']['output']>
}

/** Hosting */
export enum SiteHosting {
  /** Shopify */
  Shopify = 'shopify',
  /** Storipress */
  Storipress = 'storipress',
  /** Webflow */
  Webflow = 'webflow',
  /** Wordpress */
  Wordpress = 'wordpress',
}

export type SiteSubscriptionInfo = {
  __typename?: 'SiteSubscriptionInfo'
  /** publication description */
  description?: Maybe<Scalars['String']['output']>
  /** publication support email */
  email?: Maybe<Scalars['EmailString']['output']>
  /** publication logo image */
  logo?: Maybe<Image>
  /** subscription monthly price */
  monthly_price?: Maybe<Scalars['String']['output']>
  /** price_id for the monthly plan */
  monthly_price_id?: Maybe<Scalars['String']['output']>
  /** publication name */
  name: Scalars['String']['output']
  /** publication has enabled newsletter or not */
  newsletter: Scalars['Boolean']['output']
  /** leaky paywall configurations */
  paywall_config?: Maybe<Scalars['JSON']['output']>
  /** stripe account id */
  stripe_account_id?: Maybe<Scalars['String']['output']>
  /** publication has enabled subscription or not */
  subscription: Scalars['Boolean']['output']
  /** subscription yearly price */
  yearly_price?: Maybe<Scalars['String']['output']>
  /** price_id for the yearly plan */
  yearly_price_id?: Maybe<Scalars['String']['output']>
}

export type SiteTemplate = {
  __typename?: 'SiteTemplate'
  /** site template description */
  description?: Maybe<Scalars['String']['output']>
  /** site template key */
  key: Scalars['ID']['output']
  /** site template name */
  name?: Maybe<Scalars['String']['output']>
  /** site template type */
  type: TemplateType
  /** site template url */
  url: Scalars['String']['output']
}

export type SlackChannel = {
  __typename?: 'SlackChannel'
  /** channel id */
  id: Scalars['ID']['output']
  /** channel is private or not */
  is_private: Scalars['Boolean']['output']
  /** channel name */
  name: Scalars['String']['output']
}

export type SlackConfiguration = {
  __typename?: 'SlackConfiguration'
  /** slack channel id */
  id: Scalars['String']['output']
  /** slack channel name */
  name: Scalars['String']['output']
  /** slack channel thumbnail */
  thumbnail?: Maybe<Scalars['String']['output']>
}

export type SortArticleByInput = {
  /** sort method(column and order) */
  sort_by: ArticleSortBy
  /** stage id */
  stage_id: Scalars['ID']['input']
}

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC',
}

export type Stage = {
  __typename?: 'Stage'
  /** color use on kanban header and scheduler dropdown */
  color: Scalars['String']['output']
  /** stage for new article and articles which stage was deleted */
  default: Scalars['Boolean']['output']
  /** icon show on kanban header */
  icon: Scalars['String']['output']
  /** stage id */
  id: Scalars['ID']['output']
  /** stage name */
  name: Scalars['String']['output']
  /** the order of stages */
  order: Scalars['Int']['output']
  /** determinate this stage articles can move to DONE or not */
  ready: Scalars['Boolean']['output']
}

export type Subscriber = {
  __typename?: 'Subscriber'
  active_days_last_30: Scalars['Int']['output']
  /** subscriber activity(percentage) */
  activity: Scalars['Int']['output']
  article_views_last_7: Scalars['Int']['output']
  article_views_last_30: Scalars['Int']['output']
  article_views_total: Scalars['Int']['output']
  /** subscriber avatar */
  avatar: Scalars['String']['output']
  /** indicate the subscriber email is bounced or not */
  bounced: Scalars['Boolean']['output']
  /** current subscription canceled time */
  canceled_at?: Maybe<Scalars['DateTime']['output']>
  /**
   * subscriber card brand,
   * e.g. MasterCard
   * @deprecated use pm_type
   */
  card_brand?: Maybe<Scalars['String']['output']>
  /**
   * subscriber card expiration date
   * @deprecated No longer supported
   */
  card_expiration?: Maybe<Scalars['String']['output']>
  /**
   * subscriber card last 4 number
   * @deprecated use pm_last_four
   */
  card_last_four?: Maybe<Scalars['String']['output']>
  comments_last_7: Scalars['Int']['output']
  comments_last_30: Scalars['Int']['output']
  comments_total: Scalars['Int']['output']
  /** subscriber created time */
  created_at: Scalars['DateTime']['output']
  /** subscriber stripe customer id */
  customer_id?: Maybe<Scalars['String']['output']>
  /** subscriber email */
  email: Scalars['EmailString']['output']
  email_link_clicks_last_7: Scalars['Int']['output']
  email_link_clicks_last_30: Scalars['Int']['output']
  email_link_clicks_total: Scalars['Int']['output']
  email_opens_last_7: Scalars['Int']['output']
  email_opens_last_30: Scalars['Int']['output']
  email_opens_total: Scalars['Int']['output']
  email_receives: Scalars['Int']['output']
  /** subscriber events */
  events: SubscriberEventPaginator
  /** current subscription expire time */
  expire_on?: Maybe<Scalars['DateTime']['output']>
  /** subscriber first name */
  first_name?: Maybe<Scalars['String']['output']>
  /** subscriber first paid time */
  first_paid_at?: Maybe<Scalars['DateTime']['output']>
  /** subscriber full name */
  full_name?: Maybe<Scalars['String']['output']>
  /** subscriber id */
  id: Scalars['ID']['output']
  /** subscriber last name */
  last_name?: Maybe<Scalars['String']['output']>
  /** enable newsletter or not */
  newsletter: Scalars['Boolean']['output']
  /** subscriber paid up source */
  paid_up_source?: Maybe<Scalars['String']['output']>
  /** subscriber card last 4 number */
  pm_last_four?: Maybe<Scalars['String']['output']>
  /**
   * subscriber card brand,
   * e.g. MasterCard
   */
  pm_type?: Maybe<Scalars['String']['output']>
  /** next subscription renew time */
  renew_on?: Maybe<Scalars['DateTime']['output']>
  /** revenue from the subscriber */
  revenue: Scalars['String']['output']
  shares_last_7: Scalars['Int']['output']
  shares_last_30: Scalars['Int']['output']
  shares_total: Scalars['Int']['output']
  /** subscriber signed up source */
  signed_up_source?: Maybe<Scalars['String']['output']>
  /** subscriber has active subscription or not */
  subscribed: Scalars['Boolean']['output']
  /** the time subscriber subscribed */
  subscribed_at?: Maybe<Scalars['DateTime']['output']>
  /** subscriber subscription plan info */
  subscription?: Maybe<SubscriptionPlan>
  /** subscriber subscription type */
  subscription_type: SubscriptionType
  unique_article_views_last_7: Scalars['Int']['output']
  unique_article_views_last_30: Scalars['Int']['output']
  unique_article_views_total: Scalars['Int']['output']
  unique_email_link_clicks_last_7: Scalars['Int']['output']
  unique_email_link_clicks_last_30: Scalars['Int']['output']
  unique_email_link_clicks_total: Scalars['Int']['output']
  unique_email_opens_last_7: Scalars['Int']['output']
  unique_email_opens_last_30: Scalars['Int']['output']
  unique_email_opens_total: Scalars['Int']['output']
  /** subscriber email verified or not */
  verified: Scalars['Boolean']['output']
}

export type SubscriberEventsArgs = {
  first?: Scalars['Int']['input']
  page?: InputMaybe<Scalars['Int']['input']>
}

export type SubscriberEvent = {
  __typename?: 'SubscriberEvent'
  /** event data */
  data?: Maybe<Scalars['JSON']['output']>
  /** event id */
  id: Scalars['ID']['output']
  /**
   * event name,
   * e.g. email.opened
   */
  name: Scalars['String']['output']
  /** event occurred time */
  occurred_at: Scalars['DateTime']['output']
  /** event target */
  target?: Maybe<SubscriberEventTargetUnion>
}

/** A paginated list of SubscriberEvent items. */
export type SubscriberEventPaginator = {
  __typename?: 'SubscriberEventPaginator'
  /** A list of SubscriberEvent items. */
  data: Array<SubscriberEvent>
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo
}

export type SubscriberEventTargetUnion = Article | Desk | Email | Page | User

/** A paginated list of Subscriber items. */
export type SubscriberPaginator = {
  __typename?: 'SubscriberPaginator'
  /** A list of Subscriber items. */
  data: Array<Subscriber>
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo
}

export type SubscriberPainPoint = {
  __typename?: 'SubscriberPainPoint'
  value: Scalars['String']['output']
  weight: Scalars['Int']['output']
}

export type SubscribersGraph = {
  __typename?: 'SubscribersGraph'
  /** date */
  date: Scalars['Date']['output']
  /** paid subscribers */
  paid_subscribers: Scalars['Int']['output']
  /** total subscribers */
  subscribers: Scalars['Int']['output']
}

export type Subscription = {
  __typename?: 'Subscription'
  LiveUpdate?: Maybe<LiveUpdate>
}

export type SubscriptionAnalysis = {
  __typename?: 'SubscriptionAnalysis'
  /** active subscribers number */
  active_subscribers: Scalars['Int']['output']
  /** email clicks number */
  email_clicks: Scalars['Int']['output']
  /** email opens number */
  email_opens: Scalars['Int']['output']
  /** email sends number */
  email_sends: Scalars['Int']['output']
  /** paid subscribers number */
  paid_subscribers: Scalars['Int']['output']
  /** revenue */
  revenue: Scalars['String']['output']
  /** total subscribers number */
  subscribers: Scalars['Int']['output']
}

export type SubscriptionGraphs = {
  __typename?: 'SubscriptionGraphs'
  /** revenue by dates */
  revenue: Array<RevenueGraph>
  /** subscribers by dates */
  subscribers: Array<SubscribersGraph>
}

export type SubscriptionOverview = {
  __typename?: 'SubscriptionOverview'
  /** current month information */
  current?: Maybe<SubscriptionAnalysis>
  /** previous month information */
  previous?: Maybe<SubscriptionAnalysis>
}

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan'
  interval: Scalars['String']['output']
  price: Scalars['String']['output']
}

/** Setup */
export enum SubscriptionSetup {
  /** Done */
  Done = 'done',
  /** None */
  None = 'none',
  /** Wait connect stripe */
  WaitConnectStripe = 'waitConnectStripe',
  /** Wait import */
  WaitImport = 'waitImport',
  /** Wait next stage */
  WaitNextStage = 'waitNextStage',
}

/** Type */
export enum SubscriptionType {
  /** Free */
  Free = 'free',
  /** Subscribed */
  Subscribed = 'subscribed',
  /** Unsubscribed */
  Unsubscribed = 'unsubscribed',
}

export type SwapAppSubscriptionInput = {
  price_id: Scalars['String']['input']
  promotion_code?: InputMaybe<Scalars['String']['input']>
  quantity?: InputMaybe<Scalars['Int']['input']>
}

export type SyncGroupableToCustomFieldGroupInput = {
  /** remove existing ids that aren't present in the target_ids input(default: true) */
  detaching?: InputMaybe<Scalars['Boolean']['input']>
  /** custom field group id */
  id: Scalars['ID']['input']
  /** target ids(tags, desks, ...) */
  target_ids: Array<Scalars['ID']['input']>
}

export type Tag = {
  __typename?: 'Tag'
  /** articles which has current tag */
  articles: ArticlePaginator
  /** the number of articles which associate to this tag */
  count: Scalars['Int']['output']
  /** tag description */
  description?: Maybe<Scalars['String']['output']>
  /** tag id */
  id: Scalars['ID']['output']
  /** custom fields for metafield */
  metafields: Array<CustomField>
  /** tag name */
  name: Scalars['String']['output']
  /** tag string id */
  sid: Scalars['ID']['output']
  /**
   * tag slug, use for structure url,
   * e.g. /tags/{slug}
   */
  slug: Scalars['String']['output']
}

export type TagArticlesArgs = {
  first?: Scalars['Int']['input']
  page?: InputMaybe<Scalars['Int']['input']>
}

/** Type */
export enum TemplateType {
  /** Article layout */
  ArticleLayout = 'articleLayout',
  /** Builder block */
  BuilderBlock = 'builderBlock',
  /** Editor block */
  EditorBlock = 'editorBlock',
  /** Editor block ssr */
  EditorBlockSsr = 'editorBlockSsr',
  /** Site */
  Site = 'site',
}

export type TrackSubscriberActivityInput = {
  /** event data */
  data?: InputMaybe<Scalars['JSON']['input']>
  /** event name */
  name: Scalars['String']['input']
  /** target id */
  target_id?: InputMaybe<Scalars['ID']['input']>
}

export type TransferDeskArticlesInput = {
  from_id: Scalars['ID']['input']
  to_id: Scalars['ID']['input']
  trash?: InputMaybe<Scalars['Boolean']['input']>
}

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = 'ONLY',
  /** Return both trashed and non-trashed results. */
  With = 'WITH',
  /** Only return non-trashed results. */
  Without = 'WITHOUT',
}

export type TriggerSiteBuildInput = {
  /** trigger id, e.g. article id */
  id: Scalars['ID']['input']
  /** trigger type */
  type: ReleaseType
}

export type TwitterConfiguration = {
  __typename?: 'TwitterConfiguration'
  /** twitter user name */
  name: Scalars['String']['output']
  /** twitter user thumbnail */
  thumbnail?: Maybe<Scalars['String']['output']>
  /** twitter user id */
  user_id: Scalars['String']['output']
}

export type UnsplashSearchInput = {
  /** search keyword */
  keyword: Scalars['String']['input']
  /** image orientation */
  orientation?: InputMaybe<Scalars['String']['input']>
  /** change result page */
  page?: InputMaybe<Scalars['Int']['input']>
}

/** password update form */
export type UpdateAccountPasswordInput = {
  /** confirm new password field */
  confirm: Scalars['String']['input']
  /** current password field */
  current: Scalars['String']['input']
  /** new password field */
  future: Scalars['String']['input']
}

export type UpdateAppPaymentMethodInput = {
  country?: InputMaybe<Scalars['String']['input']>
  postal_code?: InputMaybe<Scalars['String']['input']>
  token: Scalars['String']['input']
}

export type UpdateAppSubscriptionQuantityInput = {
  quantity: Scalars['Int']['input']
}

/** update article's author info form */
export type UpdateArticleAuthorInput = {
  /** article id */
  id: Scalars['ID']['input']
  /** user id(author id) */
  user_id: Scalars['ID']['input']
}

export type UpdateArticleInput = {
  auto_posting?: InputMaybe<Scalars['JSON']['input']>
  blurb?: InputMaybe<Scalars['String']['input']>
  cover?: InputMaybe<Scalars['JSON']['input']>
  document?: InputMaybe<Scalars['JSON']['input']>
  featured?: InputMaybe<Scalars['Boolean']['input']>
  /** article id */
  id: Scalars['ID']['input']
  layout_id?: InputMaybe<Scalars['ID']['input']>
  newsletter?: InputMaybe<Scalars['Boolean']['input']>
  plan?: InputMaybe<ArticlePlan>
  seo?: InputMaybe<Scalars['JSON']['input']>
  slug?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
}

export type UpdateArticleThreadInput = {
  id: Scalars['ID']['input']
  position: Scalars['JSON']['input']
}

export type UpdateBlockInput = {
  /** block archive file */
  file?: InputMaybe<Scalars['Upload']['input']>
  /** block id */
  id: Scalars['ID']['input']
  /** presigned upload url key */
  key?: InputMaybe<Scalars['ID']['input']>
  /** signature of the request */
  signature?: InputMaybe<Scalars['String']['input']>
}

export type UpdateCustomFieldGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>
  /** custom field group id */
  id: Scalars['ID']['input']
  /** custom field group key */
  key?: InputMaybe<Scalars['String']['input']>
  /** custom field group name */
  name?: InputMaybe<Scalars['String']['input']>
}

export type UpdateCustomFieldInput = {
  description?: InputMaybe<Scalars['String']['input']>
  /** custom field id */
  id: Scalars['ID']['input']
  /** custom field key */
  key?: InputMaybe<Scalars['String']['input']>
  /** custom field name */
  name?: InputMaybe<Scalars['String']['input']>
  /** custom field options */
  options?: InputMaybe<Scalars['JSON']['input']>
}

export type UpdateCustomFieldValueInput = {
  /** custom field value id */
  id: Scalars['ID']['input']
  /** custom field value */
  value?: InputMaybe<Scalars['Mixed']['input']>
}

export type UpdateDesignInput = {
  /** live content */
  current?: InputMaybe<Scalars['JSON']['input']>
  /** draft content */
  draft?: InputMaybe<Scalars['JSON']['input']>
  /** key */
  key: Scalars['ID']['input']
  /** seo meta data */
  seo?: InputMaybe<Scalars['JSON']['input']>
}

export type UpdateDeskInput = {
  /** desk description */
  description?: InputMaybe<Scalars['String']['input']>
  /** desk id */
  id: Scalars['ID']['input']
  /** layout id */
  layout_id?: InputMaybe<Scalars['ID']['input']>
  /** desk name */
  name?: InputMaybe<Scalars['String']['input']>
  /** determinate desk is open_access or not */
  open_access?: InputMaybe<Scalars['Boolean']['input']>
  /** seo meta data */
  seo?: InputMaybe<Scalars['JSON']['input']>
  /** desk slug */
  slug?: InputMaybe<Scalars['String']['input']>
}

export type UpdateIntegrationInput = {
  /** integration data */
  data: Scalars['JSON']['input']
  /** integration key */
  key: Scalars['ID']['input']
}

export type UpdateLayoutInput = {
  /** layout data */
  data?: InputMaybe<Scalars['JSON']['input']>
  /** layout id */
  id: Scalars['ID']['input']
  /** layout name */
  name?: InputMaybe<Scalars['String']['input']>
  /** template id */
  template?: InputMaybe<Scalars['String']['input']>
}

export type UpdateLinterInput = {
  /** linter description */
  description?: InputMaybe<Scalars['String']['input']>
  /** linter id */
  id: Scalars['ID']['input']
  /** linter prompt */
  prompt?: InputMaybe<Scalars['String']['input']>
  /** linter title */
  title?: InputMaybe<Scalars['String']['input']>
}

export type UpdateNoteInput = {
  /** note content */
  content: Scalars['String']['input']
  /** note id */
  id: Scalars['ID']['input']
}

export type UpdatePageInput = {
  /** live content */
  current?: InputMaybe<Scalars['JSON']['input']>
  /** draft content */
  draft?: InputMaybe<Scalars['JSON']['input']>
  /** page id */
  id: Scalars['ID']['input']
  /** layout id */
  layout_id?: InputMaybe<Scalars['ID']['input']>
  /** page order */
  order?: InputMaybe<Scalars['Int']['input']>
  /** seo meta data */
  seo?: InputMaybe<Scalars['JSON']['input']>
  /**
   * page title,
   * e.g. About Us
   */
  title?: InputMaybe<Scalars['String']['input']>
}

/** account profile update form */
export type UpdateProfileInput = {
  /**
   * this field is used to remove avatar,
   * the only available value is `null`
   */
  avatar?: InputMaybe<Scalars['String']['input']>
  /** description of personal profile */
  bio?: InputMaybe<Scalars['String']['input']>
  /** birthday */
  birthday?: InputMaybe<Scalars['Date']['input']>
  /** public email */
  contact_email?: InputMaybe<Scalars['EmailString']['input']>
  /**
   * first name,
   * e.g. 大明
   */
  first_name?: InputMaybe<Scalars['String']['input']>
  /** gender */
  gender?: InputMaybe<UserGender>
  /** job title */
  job_title?: InputMaybe<Scalars['String']['input']>
  /**
   * last name,
   * e.g. 王
   */
  last_name?: InputMaybe<Scalars['String']['input']>
  /** location */
  location?: InputMaybe<Scalars['String']['input']>
  /** arbitrary data field */
  meta?: InputMaybe<Scalars['JSON']['input']>
  /**
   * phone number with national prefix,
   * e.g. +1
   */
  phone_number?: InputMaybe<Scalars['String']['input']>
  slug?: InputMaybe<Scalars['String']['input']>
  /** social network links */
  socials?: InputMaybe<Scalars['JSON']['input']>
  /** personal website url */
  website?: InputMaybe<Scalars['String']['input']>
}

export type UpdateRedirectionInput = {
  /** redirection id */
  id: Scalars['ID']['input']
  /** redirection path */
  path: Scalars['String']['input']
  /** redirection target */
  target: Scalars['String']['input']
}

export type UpdateReleaseInput = {
  /** release id */
  id: Scalars['ID']['input']
  /** release final message */
  message?: InputMaybe<Scalars['String']['input']>
  /** release meta data */
  meta?: InputMaybe<Scalars['JSON']['input']>
  /** release state progress */
  progress?: InputMaybe<Scalars['Int']['input']>
  /** release state */
  state?: InputMaybe<ReleaseState>
}

export type UpdateScraperArticleInput = {
  /** arbitrary data */
  data?: InputMaybe<Scalars['JSON']['input']>
  /** scraper article id */
  id: Scalars['ID']['input']
  /** article scraped_at */
  scraped_at?: InputMaybe<Scalars['String']['input']>
  /** is scraped successfully */
  successful?: InputMaybe<Scalars['Boolean']['input']>
  /** scraper token */
  token: Scalars['String']['input']
}

export type UpdateScraperInput = {
  /** arbitrary data */
  data?: InputMaybe<Scalars['JSON']['input']>
  /** scraper failed time */
  failed_at?: InputMaybe<Scalars['String']['input']>
  /** scraper finished time */
  finished_at?: InputMaybe<Scalars['String']['input']>
  /** scraper state */
  state?: InputMaybe<ScraperState>
  /** scraper token */
  token: Scalars['String']['input']
}

export type UpdateSiteInput = {
  /** generator configurations */
  buildx?: InputMaybe<Scalars['JSON']['input']>
  /** enable / disable custom site template */
  custom_site_template?: InputMaybe<Scalars['Boolean']['input']>
  /** publication description */
  description?: InputMaybe<Scalars['String']['input']>
  /** built-in desks' names alias */
  desk_alias?: InputMaybe<Scalars['JSON']['input']>
  /** publication email */
  email?: InputMaybe<Scalars['String']['input']>
  /** publication favicon, base64 type */
  favicon?: InputMaybe<Scalars['String']['input']>
  /** main hosting site */
  hosting?: InputMaybe<SiteHosting>
  /** RFC 5646 Language Tags */
  lang?: InputMaybe<Scalars['String']['input']>
  /** publication name */
  name?: InputMaybe<Scalars['String']['input']>
  /** leaky paywall configurations */
  paywall_config?: InputMaybe<Scalars['JSON']['input']>
  /** static site url structures */
  permalinks?: InputMaybe<Scalars['JSON']['input']>
  /** prophet configurations */
  prophet_config?: InputMaybe<Scalars['JSON']['input']>
  /** customized sitemap */
  sitemap?: InputMaybe<Scalars['JSON']['input']>
  /** social network links */
  socials?: InputMaybe<Scalars['JSON']['input']>
  /** publication timezone */
  timezone?: InputMaybe<Scalars['String']['input']>
  /** publication tutorial history */
  tutorials?: InputMaybe<Scalars['JSON']['input']>
  /**
   * publication storipress domain prefix,
   * e.g. {workspace}.storipress.app
   */
  workspace?: InputMaybe<Scalars['String']['input']>
}

export type UpdateStageInput = {
  /** stage color */
  color?: InputMaybe<Scalars['String']['input']>
  /** stage icon */
  icon?: InputMaybe<Scalars['String']['input']>
  /** stage id */
  id: Scalars['ID']['input']
  /** stage name */
  name?: InputMaybe<Scalars['String']['input']>
}

export type UpdateSubscriberInput = {
  /** subscriber email */
  email?: InputMaybe<Scalars['EmailString']['input']>
  /** subscriber first name */
  first_name?: InputMaybe<Scalars['String']['input']>
  /** subscriber last name */
  last_name?: InputMaybe<Scalars['String']['input']>
  /** enable newsletter or not */
  newsletter?: InputMaybe<Scalars['Boolean']['input']>
}

export type UpdateTagInput = {
  /** tag description */
  description?: InputMaybe<Scalars['String']['input']>
  /** tag id */
  id: Scalars['ID']['input']
  /** tag name */
  name?: InputMaybe<Scalars['String']['input']>
}

export type UpdateUserInput = {
  /** avatar url */
  avatar?: InputMaybe<Scalars['String']['input']>
  /** description of personal profile */
  bio?: InputMaybe<Scalars['String']['input']>
  /** birthday */
  birthday?: InputMaybe<Scalars['Date']['input']>
  /** account email */
  email?: InputMaybe<Scalars['EmailString']['input']>
  /**
   * user first name,
   * e.g. 大明
   */
  first_name?: InputMaybe<Scalars['String']['input']>
  /** gender */
  gender?: InputMaybe<UserGender>
  /** user id */
  id: Scalars['ID']['input']
  /**
   * user last name,
   * e.g. 王
   */
  last_name?: InputMaybe<Scalars['String']['input']>
  /** location */
  location?: InputMaybe<Scalars['String']['input']>
  /**
   * phone number with national prefix,
   * e.g. +1
   */
  phone_number?: InputMaybe<Scalars['String']['input']>
  /** personal website url */
  website?: InputMaybe<Scalars['String']['input']>
}

export type UpdateWebflowCollectionInput = {
  /** collection type */
  type: WebflowCollectionType
  /** collection id */
  value: Scalars['ID']['input']
}

export type UpdateWebflowCollectionMappingInput = {
  /** collection type */
  type: WebflowCollectionType
  /** collection id */
  value: Array<UpdateWebflowCollectionMappingValueInput>
}

export type UpdateWebflowCollectionMappingValueInput = {
  storipress_id: Scalars['String']['input']
  webflow_id: Scalars['ID']['input']
}

export type UpdateWebflowDomainInput = {
  /** site domain */
  value: Scalars['String']['input']
}

export type UpdateWebflowSiteInput = {
  /** site id */
  value: Scalars['ID']['input']
}

export type UploadArticleImageInput = {
  /** image file */
  file: Scalars['Upload']['input']
  /** article id */
  id: Scalars['ID']['input']
}

export type UploadAvatarInput = {
  /** image file */
  file: Scalars['Upload']['input']
  /** user id */
  id?: InputMaybe<Scalars['ID']['input']>
}

export type UploadBlockPreviewInput = {
  /** image file */
  file: Scalars['Upload']['input']
  /** block id */
  id: Scalars['ID']['input']
}

/** Image */
export enum UploadImage {
  /** Article content image */
  ArticleContentImage = 'articleContentImage',
  /** Article hero photo */
  ArticleHeroPhoto = 'articleHeroPhoto',
  /** Article s e o image */
  ArticleSeoImage = 'articleSEOImage',
  /** Block preview image */
  BlockPreviewImage = 'blockPreviewImage',
  /** Layout preview image */
  LayoutPreviewImage = 'layoutPreviewImage',
  /** Other page content image */
  OtherPageContentImage = 'otherPageContentImage',
  /** Publication banner */
  PublicationBanner = 'publicationBanner',
  /** Publication favicon */
  PublicationFavicon = 'publicationFavicon',
  /** Publication logo */
  PublicationLogo = 'publicationLogo',
  /** Subscriber avatar */
  SubscriberAvatar = 'subscriberAvatar',
  /** User avatar */
  UserAvatar = 'userAvatar',
}

export type UploadImageInput = {
  /** presigned upload url key */
  key: Scalars['ID']['input']
  /** signature of the request */
  signature: Scalars['String']['input']
  /** target id */
  target_id: Scalars['ID']['input']
  /** type */
  type: UploadImage
}

export type UploadLayoutPreviewInput = {
  /** image file */
  file: Scalars['Upload']['input']
  /** layout id */
  id: Scalars['ID']['input']
}

export type UploadSiteTemplateInput = {
  /** presigned upload url key */
  key: Scalars['ID']['input']
}

export type UploadSubscriberAvatarInput = {
  /** image file */
  file: Scalars['Upload']['input']
}

export type User = {
  __typename?: 'User'
  /** avatar url */
  avatar?: Maybe<Scalars['String']['output']>
  /** description of personal profile */
  bio?: Maybe<Scalars['String']['output']>
  /** public email */
  contact_email?: Maybe<Scalars['EmailString']['output']>
  /** user create(join) time */
  created_at: Scalars['DateTime']['output']
  /** desks joined by the user */
  desks: Array<Desk>
  /** user email */
  email?: Maybe<Scalars['EmailString']['output']>
  /**
   * user first name,
   * e.g. 大明
   */
  first_name?: Maybe<Scalars['String']['output']>
  /** user full name */
  full_name?: Maybe<Scalars['String']['output']>
  /** user id */
  id: Scalars['ID']['output']
  /** intercom hash identity */
  intercom_hash_identity: Scalars['String']['output']
  /** job title */
  job_title?: Maybe<Scalars['String']['output']>
  /**
   * user last name,
   * e.g. 王
   */
  last_name?: Maybe<Scalars['String']['output']>
  /** user last seen time */
  last_seen_at?: Maybe<Scalars['DateTime']['output']>
  /** location */
  location?: Maybe<Scalars['String']['output']>
  /** arbitrary data field */
  meta?: Maybe<Scalars['JSON']['output']>
  /** user's role */
  role?: Maybe<Scalars['String']['output']>
  /**
   * user signed up source information, e.g.
   * - direct
   * - appsumo
   * - invite:D6RX98VXN,D1NJYLKZN
   */
  signed_up_source?: Maybe<Scalars['String']['output']>
  /** user slug, use for structure url */
  slug?: Maybe<Scalars['String']['output']>
  /** social network links */
  socials?: Maybe<Scalars['JSON']['output']>
  /**
   * user status,
   * e.g. suspended, active
   */
  status?: Maybe<UserStatus>
  /** user is suspended or not */
  suspended?: Maybe<Scalars['Boolean']['output']>
  updated_at: Scalars['DateTime']['output']
  /** user email confirmed or not */
  verified: Scalars['Boolean']['output']
  /** personal website url */
  website?: Maybe<Scalars['String']['output']>
}

/** Gender */
export enum UserGender {
  /** Female */
  Female = 'female',
  /** Male */
  Male = 'male',
  /** Other */
  Other = 'other',
}

/** Status */
export enum UserStatus {
  /** Active */
  Active = 'active',
  /** Invited */
  Invited = 'invited',
  /** Suspended */
  Suspended = 'suspended',
}

export type WebflowCollection = {
  __typename?: 'WebflowCollection'
  /** text displayed to the user */
  displayName: Scalars['String']['output']
  /** collection fields */
  fields: Array<WebflowCollectionField>
  /** Webflow collection id */
  id: Scalars['ID']['output']
  /**
   * key(webflow-field-id) value(candidate-value, nullable) object,
   * e.g. {"19bf7":null,"210c9":"editors"}
   */
  mappings?: Maybe<Scalars['JSON']['output']>
}

export type WebflowCollectionField = {
  __typename?: 'WebflowCollectionField'
  /** potential field list corresponding to Storipress */
  candidates?: Maybe<Array<WebflowCollectionFieldCandidate>>
  /** text displayed to the user */
  displayName: Scalars['String']['output']
  /** Webflow collection field id */
  id: Scalars['ID']['output']
  /** whether the collection field is required or not */
  isRequired: Scalars['Boolean']['output']
  /** the collection field type */
  type: WebflowFieldType
}

export type WebflowCollectionFieldCandidate = {
  __typename?: 'WebflowCollectionFieldCandidate'
  /** text displayed to the user */
  name: Scalars['String']['output']
  /** value required for the API call */
  value: Scalars['String']['output']
}

export type WebflowCollectionOnboarding = {
  __typename?: 'WebflowCollectionOnboarding'
  /** whether the author collection is selected or not */
  author: Scalars['Boolean']['output']
  /** whether the blog collection is selected or not */
  blog: Scalars['Boolean']['output']
  /** whether the desk collection is selected or not */
  desk: Scalars['Boolean']['output']
  /** whether the tag collection is selected or not */
  tag: Scalars['Boolean']['output']
}

/** Collection type */
export enum WebflowCollectionType {
  /** Author */
  Author = 'author',
  /** Blog */
  Blog = 'blog',
  /** Desk */
  Desk = 'desk',
  /** Tag */
  Tag = 'tag',
}

export type WebflowConfiguration = {
  __typename?: 'WebflowConfiguration'
  /** webflow collections */
  collections: Array<WebflowConfigurationCollection>
  /** webflow user email */
  email: Scalars['EmailString']['output']
  /** webflow token is expired or not */
  expired?: Maybe<Scalars['Boolean']['output']>
  /** webflow user name */
  name: Scalars['String']['output']
  /** webflow user id */
  user_id: Scalars['String']['output']
  /** webflow api is v2 or not */
  v2?: Maybe<Scalars['Boolean']['output']>
}

export type WebflowConfigurationCollection = {
  __typename?: 'WebflowConfigurationCollection'
  /** webflow collection id */
  id: Scalars['String']['output']
  /** webflow item mappings */
  mapping: Array<WebflowConfigurationCollectionItemMapping>
}

export type WebflowConfigurationCollectionItemMapping = {
  __typename?: 'WebflowConfigurationCollectionItemMapping'
  /** webflow collection item id */
  key: Scalars['String']['output']
  /** storipress article field */
  value: Scalars['String']['output']
}

export type WebflowCustomDomain = {
  __typename?: 'WebflowCustomDomain'
  id: Scalars['ID']['output']
  url: Scalars['String']['output']
}

export type WebflowDetectionMappingOnboarding = {
  __typename?: 'WebflowDetectionMappingOnboarding'
  /** whether the author collection's fields mapping detection is ongoing or not */
  author: Scalars['Boolean']['output']
  /** whether the blog collection's fields mapping detection is ongoing or not */
  blog: Scalars['Boolean']['output']
  /** whether the desk collection's fields mapping detection is ongoing or not */
  desk: Scalars['Boolean']['output']
  /** whether the tag collection's fields mapping detection is ongoing or not */
  tag: Scalars['Boolean']['output']
}

export type WebflowDetectionOnboarding = {
  __typename?: 'WebflowDetectionOnboarding'
  /** whether the site collection is ongoing or not */
  collection: Scalars['Boolean']['output']
  mapping: WebflowDetectionMappingOnboarding
  /** whether the site detection is ongoing or not */
  site: Scalars['Boolean']['output']
}

/** Field type */
export enum WebflowFieldType {
  /** Color */
  Color = 'color',
  /** Date time */
  DateTime = 'dateTime',
  /** Email */
  Email = 'email',
  /** File */
  File = 'file',
  /** Image */
  Image = 'image',
  /** Link */
  Link = 'link',
  /** Membership plan */
  MembershipPlan = 'membershipPlan',
  /** Multi external file */
  MultiExternalFile = 'multiExternalFile',
  /** Multi image */
  MultiImage = 'multiImage',
  /** Multi reference */
  MultiReference = 'multiReference',
  /** Number */
  Number = 'number',
  /** Option */
  Option = 'option',
  /** Phone */
  Phone = 'phone',
  /** Plain text */
  PlainText = 'plainText',
  /** Price */
  Price = 'price',
  /** Reference */
  Reference = 'reference',
  /** Rich text */
  RichText = 'richText',
  /** Sku settings */
  SkuSettings = 'skuSettings',
  /** Sku values */
  SkuValues = 'skuValues',
  /** Switch */
  Switch = 'switch',
  /** Text option */
  TextOption = 'textOption',
  /** User */
  User = 'user',
  /** Video link */
  VideoLink = 'videoLink',
}

export type WebflowInfo = {
  __typename?: 'WebflowInfo'
  /** whether the integration is activated or not */
  activated_at?: Maybe<Scalars['DateTime']['output']>
  /** configured Webflow site domain */
  domain?: Maybe<Scalars['String']['output']>
  /** configured Webflow site id */
  site_id?: Maybe<Scalars['ID']['output']>
}

export type WebflowItem = {
  __typename?: 'WebflowItem'
  /** Webflow item id */
  id: Scalars['ID']['output']
  /** item name */
  name: Scalars['String']['output']
  /** item slug */
  slug: Scalars['String']['output']
}

export type WebflowMappingOnboarding = {
  __typename?: 'WebflowMappingOnboarding'
  /** whether the author collection's fields mapping is completed or not */
  author: Scalars['Boolean']['output']
  /** whether the blog collection's fields mapping is completed or not */
  blog: Scalars['Boolean']['output']
  /** whether the desk collection's fields mapping is completed or not */
  desk: Scalars['Boolean']['output']
  /** whether the tag collection's fields mapping is completed or not */
  tag: Scalars['Boolean']['output']
}

export type WebflowOnboarding = {
  __typename?: 'WebflowOnboarding'
  collection: WebflowCollectionOnboarding
  detection: WebflowDetectionOnboarding
  mapping: WebflowMappingOnboarding
  /** whether the site is selected or not */
  site: Scalars['Boolean']['output']
}

export type WebflowReference = {
  __typename?: 'WebflowReference'
  /** Webflow item id */
  id: Scalars['ID']['output']
}

export type WebflowSite = {
  __typename?: 'WebflowSite'
  /** site custom domains */
  customDomains: Array<WebflowCustomDomain>
  /** site webflow domain, e.g. hello.webflow.io */
  defaultDomain: Scalars['String']['output']
  /** text displayed to the user */
  displayName: Scalars['String']['output']
  /** Webflow site id */
  id: Scalars['ID']['output']
}

/** Dynamic WHERE conditions for queries. */
export type WhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<WhereConditions>>
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<WhereConditionsRelation>
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<WhereConditions>>
  /** The column that is used for the condition. */
  column?: InputMaybe<Scalars['String']['input']>
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars['Mixed']['input']>
}

/** Dynamic HAS conditions for WHERE condition queries. */
export type WhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars['Int']['input']>
  /** Additional condition logic. */
  condition?: InputMaybe<WhereConditions>
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>
  /** The relation that is checked. */
  relation: Scalars['String']['input']
}

export type WordPressFeature = {
  __typename?: 'WordPressFeature'
  /** the activation of WordPress acf plugin synchronization */
  acf: Scalars['Boolean']['output']
  /** the activation of WordPress site synchronization */
  site: Scalars['Boolean']['output']
  /** the activation of WordPress yoast seo plugin synchronization */
  yoast_seo: Scalars['Boolean']['output']
}

export type WordPressInfo = {
  __typename?: 'WordPressInfo'
  /** whether the integration is activated or not */
  activated_at?: Maybe<Scalars['DateTime']['output']>
  /** whether the integration token is expired or not */
  expired?: Maybe<Scalars['Boolean']['output']>
  /** the features of WordPress synchronization */
  feature?: Maybe<WordPressFeature>
  /** configured WordPress site name */
  site_name?: Maybe<Scalars['String']['output']>
  /** configured WordPress site url */
  url?: Maybe<Scalars['String']['output']>
  /** configured WordPress username */
  username?: Maybe<Scalars['String']['output']>
  /** configured WordPress Plugin version */
  version?: Maybe<Scalars['String']['output']>
}

/** Optional feature */
export enum WordPressOptionalFeatureType {
  /** Acf */
  Acf = 'acf',
  /** Acf pro */
  AcfPro = 'acfPro',
  /** Rank math */
  RankMath = 'rankMath',
  /** Site */
  Site = 'site',
  /** Yoast seo */
  YoastSeo = 'yoastSeo',
}

/** subset of site(publication) */
export type Workspace = {
  __typename?: 'Workspace'
  /** publication custom domain */
  custom_domain?: Maybe<Scalars['String']['output']>
  /**
   * publication customer site domain
   * e.g. hello.storipress.app, example.com
   */
  customer_site_domain: Scalars['String']['output']
  /** publication description */
  description?: Maybe<Scalars['String']['output']>
  /** publication favicon */
  favicon?: Maybe<Scalars['String']['output']>
  /** hidden or not */
  hidden: Scalars['Boolean']['output']
  /** publication id */
  id: Scalars['ID']['output']
  /** publication name */
  name: Scalars['String']['output']
  /** user's role */
  role: Scalars['String']['output']
  /**
   * user status,
   * e.g. suspended, active
   */
  status: UserStatus
  /**
   * publication storipress domain prefix,
   * e.g. {workspace}.storipress.app
   */
  workspace: Scalars['String']['output']
}

export type PresignedUploadUrl = {
  __typename?: 'presignedUploadURL'
  /** url expires time */
  expire_on: Scalars['DateTime']['output']
  /** key(id) */
  key: Scalars['ID']['output']
  /** signature of the request */
  signature: Scalars['String']['output']
  /** upload endpoint */
  url: Scalars['String']['output']
}

export type DeleteLayoutMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type DeleteLayoutMutation = {
  __typename?: 'Mutation'
  deleteLayout: { __typename?: 'Layout'; id: string; name: string; template: string; data?: any | null }
}

export type DeletePageMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type DeletePageMutation = {
  __typename?: 'Mutation'
  deletePage: { __typename?: 'Page'; id: string; title: string; draft?: any | null; seo?: any | null; order: number }
}

export type CreateLayoutMutationVariables = Exact<{
  input: CreateLayoutInput
}>

export type CreateLayoutMutation = {
  __typename?: 'Mutation'
  createLayout: { __typename?: 'Layout'; id: string; name: string; template: string; data?: any | null }
}

export type CreatePageMutationVariables = Exact<{
  input: CreatePageInput
}>

export type CreatePageMutation = {
  __typename?: 'Mutation'
  createPage: { __typename?: 'Page'; id: string; title: string; draft?: any | null; seo?: any | null; order: number }
}

export type RequestPresignedUploadUrlMutationVariables = Exact<{ [key: string]: never }>

export type RequestPresignedUploadUrlMutation = {
  __typename?: 'Mutation'
  requestPresignedUploadURL: { __typename?: 'presignedUploadURL'; url: string; key: string; signature: string }
}

export type TriggerSiteBuildMutationVariables = Exact<{ [key: string]: never }>

export type TriggerSiteBuildMutation = { __typename?: 'Mutation'; triggerSiteBuild?: string | null }

export type UpdateDesignMutationVariables = Exact<{
  input: UpdateDesignInput
}>

export type UpdateDesignMutation = {
  __typename?: 'Mutation'
  updateDesign: { __typename?: 'Design'; key: string; draft?: any | null; current?: any | null; seo?: any | null }
}

export type UpdateDeskMutationVariables = Exact<{
  input: UpdateDeskInput
}>

export type UpdateDeskMutation = {
  __typename?: 'Mutation'
  updateDesk: {
    __typename?: 'Desk'
    id: string
    name: string
    slug: string
    seo?: any | null
    layout?: { __typename?: 'Layout'; id: string } | null
  }
}

export type UpdateLayoutMutationVariables = Exact<{
  input: UpdateLayoutInput
}>

export type UpdateLayoutMutation = {
  __typename?: 'Mutation'
  updateLayout: { __typename?: 'Layout'; id: string; name: string; template: string; data?: any | null }
}

export type UpdatePageMutationVariables = Exact<{
  input: UpdatePageInput
}>

export type UpdatePageMutation = {
  __typename?: 'Mutation'
  updatePage: { __typename?: 'Page'; id: string; title: string; draft?: any | null; seo?: any | null; order: number }
}

export type UploadImageDocumentMutationVariables = Exact<{
  input: UploadImageInput
}>

export type UploadImageDocumentMutation = {
  __typename?: 'Mutation'
  uploadImage: { __typename?: 'Media'; url: string }
}

export type UploadLayoutPreviewMutationVariables = Exact<{
  input: UploadLayoutPreviewInput
}>

export type UploadLayoutPreviewMutation = { __typename?: 'Mutation'; uploadLayoutPreview: string }

export type GetBlocksQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
  page?: InputMaybe<Scalars['Int']['input']>
}>

export type GetBlocksQuery = {
  __typename?: 'Query'
  blocks: {
    __typename?: 'BlockPaginator'
    paginatorInfo: {
      __typename?: 'PaginatorInfo'
      count: number
      currentPage: number
      firstItem?: number | null
      hasMorePages: boolean
      lastItem?: number | null
      lastPage: number
      perPage: number
      total: number
    }
    data: Array<{ __typename?: 'Block'; id: string; uuid: string; created_at: any; updated_at: any }>
  }
}

export type GetDesignQueryVariables = Exact<{
  key: Scalars['ID']['input']
}>

export type GetDesignQuery = {
  __typename?: 'Query'
  design?: { __typename?: 'Design'; key: string; draft?: any | null; current?: any | null; seo?: any | null } | null
}

export type GetIntegrationsQueryVariables = Exact<{ [key: string]: never }>

export type GetIntegrationsQuery = {
  __typename?: 'Query'
  integrations: Array<{ __typename?: 'Integration'; key: string; data: any; activated_at?: any | null }>
}

export type GetMeQueryVariables = Exact<{ [key: string]: never }>

export type GetMeQuery = {
  __typename?: 'Query'
  me: {
    __typename?: 'User'
    id: string
    avatar?: string | null
    email?: any | null
    role?: string | null
    intercomHashIdentity: string
    name?: string | null
  }
}

export type GetPagesQueryVariables = Exact<{ [key: string]: never }>

export type GetPagesQuery = {
  __typename?: 'Query'
  pages: Array<{
    __typename?: 'Page'
    id: string
    title: string
    draft?: any | null
    current?: any | null
    seo?: any | null
    order: number
  }>
}

export type GetReleasesQueryVariables = Exact<{ [key: string]: never }>

export type GetReleasesQuery = {
  __typename?: 'Query'
  releases: {
    __typename?: 'ReleasePaginator'
    paginatorInfo: { __typename?: 'PaginatorInfo'; total: number; currentPage: number; count: number; perPage: number }
    data: Array<{ __typename?: 'Release'; id: string; state: ReleaseState; meta?: any | null; created_at: any }>
  }
}

export type GetSiteCustomSiteQueryVariables = Exact<{ [key: string]: never }>

export type GetSiteCustomSiteQuery = {
  __typename?: 'Query'
  site: { __typename?: 'Site'; id: string; name: string; custom_site_template: boolean }
}

export type GetSiteQueryVariables = Exact<{ [key: string]: never }>

export type GetSiteQuery = {
  __typename?: 'Query'
  site: {
    __typename?: 'Site'
    id: string
    workspace: string
    custom_domain?: string | null
    customer_site_domain: string
    name: string
    description?: string | null
    favicon?: string | null
    timezone: string
    initialized: boolean
    socials?: any | null
    logo?: { __typename?: 'Image'; url: string } | null
  }
}

export type GetWorkspacesQueryVariables = Exact<{ [key: string]: never }>

export type GetWorkspacesQuery = {
  __typename?: 'Query'
  workspaces: Array<{ __typename?: 'Workspace'; id: string; name: string }>
}

export type IframelyQueryVariables = Exact<{
  input: IframelyIframelyInput
}>

export type IframelyQuery = { __typename?: 'Query'; iframelyIframely: any }

export type ListArticlesQueryVariables = Exact<{
  page?: Scalars['Int']['input']
  desk_ids?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>
  first?: Scalars['Int']['input']
  featured?: InputMaybe<Scalars['Boolean']['input']>
}>

export type ListArticlesQuery = {
  __typename?: 'Query'
  articles: {
    __typename?: 'ArticlePaginator'
    paginatorInfo: { __typename?: 'PaginatorInfo'; hasMorePages: boolean }
    data: Array<{
      __typename?: 'Article'
      id: string
      title: string
      featured: boolean
      slug: string
      blurb?: string | null
      cover?: any | null
      created_at: any
      document?: any | null
      published: boolean
      published_at?: any | null
      seo?: any | null
      desk: {
        __typename?: 'Desk'
        id: string
        name: string
        slug: string
        desk?: { __typename?: 'Desk'; id: string; name: string; slug: string } | null
      }
      stage: { __typename?: 'Stage'; ready: boolean }
      authors: Array<{ __typename?: 'User'; id: string; name?: string | null }>
    }>
  }
}

export type ListDesksQueryVariables = Exact<{ [key: string]: never }>

export type ListDesksQuery = {
  __typename?: 'Query'
  desks: Array<{
    __typename?: 'Desk'
    id: string
    name: string
    slug: string
    order: number
    seo?: any | null
    published_articles_count: number
    desks: Array<{ __typename?: 'Desk'; id: string }>
    layout?: { __typename?: 'Layout'; id: string; name: string; template: string; data?: any | null } | null
  }>
}

export type ListLayoutsQueryVariables = Exact<{ [key: string]: never }>

export type ListLayoutsQuery = {
  __typename?: 'Query'
  layouts: Array<{
    __typename?: 'Layout'
    id: string
    name: string
    template: string
    data?: any | null
    preview?: { __typename?: 'Image'; url: string } | null
  }>
}

export type UnsplashDownloadPhotoQueryVariables = Exact<{
  id: Scalars['String']['input']
}>

export type UnsplashDownloadPhotoQuery = { __typename?: 'Query'; unsplashDownload: string }

export type UnsplashListPhotosQueryVariables = Exact<{
  page: Scalars['Int']['input']
}>

export type UnsplashListPhotosQuery = { __typename?: 'Query'; unsplashList: any }

export type UnsplashSearchPhotosQueryVariables = Exact<{
  input: UnsplashSearchInput
}>

export type UnsplashSearchPhotosQuery = { __typename?: 'Query'; unsplashSearch: any }

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    CustomFieldOptions: [
      'CustomFieldBooleanOptions',
      'CustomFieldColorOptions',
      'CustomFieldDateOptions',
      'CustomFieldFileOptions',
      'CustomFieldIgnoreOptions',
      'CustomFieldJsonOptions',
      'CustomFieldNumberOptions',
      'CustomFieldReferenceOptions',
      'CustomFieldRichTextOptions',
      'CustomFieldSelectOptions',
      'CustomFieldTextOptions',
      'CustomFieldUrlOptions',
    ],
    CustomFieldReferenceTargetValue: ['Article', 'Desk', 'Tag', 'User', 'WebflowReference'],
    CustomFieldValue: [
      'CustomFieldBooleanValue',
      'CustomFieldColorValue',
      'CustomFieldDateValue',
      'CustomFieldFileValue',
      'CustomFieldJsonValue',
      'CustomFieldNumberValue',
      'CustomFieldReferenceValue',
      'CustomFieldRichTextValue',
      'CustomFieldSelectValue',
      'CustomFieldTextValue',
      'CustomFieldUrlValue',
    ],
    EmailTargetUnion: ['Article'],
    IntegrationConfiguration: [
      'FacebookConfiguration',
      'IntegrationIgnoreConfiguration',
      'LinkedInConfiguration',
      'ShopifyConfiguration',
      'SlackConfiguration',
      'TwitterConfiguration',
      'WebflowConfiguration',
    ],
    LinkTargetUnion: ['Article', 'Desk', 'Page', 'Tag', 'User'],
    SubscriberEventTargetUnion: ['Article', 'Desk', 'Email', 'Page', 'User'],
  },
}
export default result

export const DeleteLayout = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteLayout' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteLayout' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'template' } },
                { kind: 'Field', name: { kind: 'Name', value: 'data' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteLayoutMutation, DeleteLayoutMutationVariables>
export const DeletePage = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeletePage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deletePage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'draft' } },
                { kind: 'Field', name: { kind: 'Name', value: 'seo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'order' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeletePageMutation, DeletePageMutationVariables>
export const CreateLayout = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateLayout' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateLayoutInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createLayout' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'template' } },
                { kind: 'Field', name: { kind: 'Name', value: 'data' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateLayoutMutation, CreateLayoutMutationVariables>
export const CreatePage = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreatePage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreatePageInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createPage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'draft' } },
                { kind: 'Field', name: { kind: 'Name', value: 'seo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'order' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreatePageMutation, CreatePageMutationVariables>
export const RequestPresignedUploadUrl = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RequestPresignedUploadURL' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'requestPresignedUploadURL' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                { kind: 'Field', name: { kind: 'Name', value: 'signature' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RequestPresignedUploadUrlMutation, RequestPresignedUploadUrlMutationVariables>
export const TriggerSiteBuild = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'TriggerSiteBuild' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'triggerSiteBuild' } }],
      },
    },
  ],
} as unknown as DocumentNode<TriggerSiteBuildMutation, TriggerSiteBuildMutationVariables>
export const UpdateDesign = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateDesign' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateDesignInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateDesign' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                { kind: 'Field', name: { kind: 'Name', value: 'draft' } },
                { kind: 'Field', name: { kind: 'Name', value: 'current' } },
                { kind: 'Field', name: { kind: 'Name', value: 'seo' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateDesignMutation, UpdateDesignMutationVariables>
export const UpdateDesk = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateDesk' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateDeskInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateDesk' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'seo' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'layout' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateDeskMutation, UpdateDeskMutationVariables>
export const UpdateLayout = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateLayout' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateLayoutInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateLayout' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'template' } },
                { kind: 'Field', name: { kind: 'Name', value: 'data' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateLayoutMutation, UpdateLayoutMutationVariables>
export const UpdatePage = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdatePage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdatePageInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updatePage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'draft' } },
                { kind: 'Field', name: { kind: 'Name', value: 'seo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'order' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdatePageMutation, UpdatePageMutationVariables>
export const UploadImageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UploadImageDocument' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UploadImageInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'uploadImage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'url' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UploadImageDocumentMutation, UploadImageDocumentMutationVariables>
export const UploadLayoutPreview = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UploadLayoutPreview' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UploadLayoutPreviewInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'uploadLayoutPreview' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UploadLayoutPreviewMutation, UploadLayoutPreviewMutationVariables>
export const GetBlocks = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBlocks' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'blocks' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paginatorInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'currentPage' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstItem' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'hasMorePages' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lastItem' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lastPage' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'perPage' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'uuid' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'created_at' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'updated_at' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetBlocksQuery, GetBlocksQueryVariables>
export const GetDesign = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetDesign' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'key' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'design' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'key' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'key' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                { kind: 'Field', name: { kind: 'Name', value: 'draft' } },
                { kind: 'Field', name: { kind: 'Name', value: 'current' } },
                { kind: 'Field', name: { kind: 'Name', value: 'seo' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetDesignQuery, GetDesignQueryVariables>
export const GetIntegrations = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetIntegrations' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'integrations' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                { kind: 'Field', name: { kind: 'Name', value: 'data' } },
                { kind: 'Field', name: { kind: 'Name', value: 'activated_at' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetIntegrationsQuery, GetIntegrationsQueryVariables>
export const GetMe = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetMe' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'me' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  alias: { kind: 'Name', value: 'intercomHashIdentity' },
                  name: { kind: 'Name', value: 'intercom_hash_identity' },
                },
                { kind: 'Field', alias: { kind: 'Name', value: 'name' }, name: { kind: 'Name', value: 'full_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'avatar' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>
export const GetPages = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPages' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pages' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'draft' } },
                { kind: 'Field', name: { kind: 'Name', value: 'current' } },
                { kind: 'Field', name: { kind: 'Name', value: 'seo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'order' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPagesQuery, GetPagesQueryVariables>
export const GetReleases = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetReleases' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'releases' },
            arguments: [
              { kind: 'Argument', name: { kind: 'Name', value: 'first' }, value: { kind: 'IntValue', value: '10' } },
              { kind: 'Argument', name: { kind: 'Name', value: 'page' }, value: { kind: 'IntValue', value: '1' } },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paginatorInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'currentPage' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'perPage' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'meta' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'created_at' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetReleasesQuery, GetReleasesQueryVariables>
export const GetSiteCustomSite = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSiteCustomSite' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'site' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'custom_site_template' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSiteCustomSiteQuery, GetSiteCustomSiteQueryVariables>
export const GetSite = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSite' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'site' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'workspace' } },
                { kind: 'Field', name: { kind: 'Name', value: 'custom_domain' } },
                { kind: 'Field', name: { kind: 'Name', value: 'customer_site_domain' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'favicon' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'logo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'url' } }],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'timezone' } },
                { kind: 'Field', name: { kind: 'Name', value: 'initialized' } },
                { kind: 'Field', name: { kind: 'Name', value: 'socials' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSiteQuery, GetSiteQueryVariables>
export const GetWorkspaces = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetWorkspaces' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'workspaces' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetWorkspacesQuery, GetWorkspacesQueryVariables>
export const Iframely = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Iframely' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'IframelyIframelyInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'iframelyIframely' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<IframelyQuery, IframelyQueryVariables>
export const ListArticles = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListArticles' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
          defaultValue: { kind: 'IntValue', value: '1' },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'desk_ids' } },
          type: {
            kind: 'ListType',
            type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
          defaultValue: { kind: 'IntValue', value: '30' },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'featured' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'articles' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'desk_ids' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'desk_ids' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'published' },
                value: { kind: 'BooleanValue', value: true },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'featured' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'featured' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sortBy' },
                value: {
                  kind: 'ListValue',
                  values: [
                    {
                      kind: 'ObjectValue',
                      fields: [
                        {
                          kind: 'ObjectField',
                          name: { kind: 'Name', value: 'column' },
                          value: { kind: 'EnumValue', value: 'PUBLISHED_AT' },
                        },
                        {
                          kind: 'ObjectField',
                          name: { kind: 'Name', value: 'order' },
                          value: { kind: 'EnumValue', value: 'DESC' },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paginatorInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'hasMorePages' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'desk' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'desk' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'featured' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'blurb' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'cover' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'created_at' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'document' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'published' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'published_at' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stage' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'Field', name: { kind: 'Name', value: 'ready' } }],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'seo' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'authors' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            {
                              kind: 'Field',
                              alias: { kind: 'Name', value: 'name' },
                              name: { kind: 'Name', value: 'full_name' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ListArticlesQuery, ListArticlesQueryVariables>
export const ListDesks = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListDesks' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'desks' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'order' } },
                { kind: 'Field', name: { kind: 'Name', value: 'seo' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'desks' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'published_articles_count' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'layout' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'template' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'data' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ListDesksQuery, ListDesksQueryVariables>
export const ListLayouts = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListLayouts' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'layouts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'template' } },
                { kind: 'Field', name: { kind: 'Name', value: 'data' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'preview' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'url' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ListLayoutsQuery, ListLayoutsQueryVariables>
export const UnsplashDownloadPhoto = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'UnsplashDownloadPhoto' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unsplashDownload' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UnsplashDownloadPhotoQuery, UnsplashDownloadPhotoQueryVariables>
export const UnsplashListPhotos = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'UnsplashListPhotos' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unsplashList' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UnsplashListPhotosQuery, UnsplashListPhotosQueryVariables>
export const UnsplashSearchPhotos = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'UnsplashSearchPhotos' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UnsplashSearchInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unsplashSearch' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UnsplashSearchPhotosQuery, UnsplashSearchPhotosQueryVariables>
