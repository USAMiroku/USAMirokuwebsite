export const COMMUNITY_PROGRAMS_BUCKET = 'community-programs'

export const communityProgramKeys = [
  'community-outreach',
  'education',
  'leadership-development',
  'art-and-beauty',
  'nature-and-natural-farming',
  'volunteer-service',
  'spiritual-support',
  'women-and-girls-leadership',
] as const

export type CommunityProgramKey = (typeof communityProgramKeys)[number]

export type CommunityProgramPhoto = {
  id: string
  program_key: CommunityProgramKey
  storage_path: string
  alt_text: string
  caption: string | null
  display_order: number
  is_featured: boolean
  is_published: boolean
  created_at: string
}

export function isCommunityProgramKey(value: string): value is CommunityProgramKey {
  return communityProgramKeys.includes(value as CommunityProgramKey)
}
