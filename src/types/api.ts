// Tipos base para la API
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

// --- Autenticación ---

export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface User {
  id: string
  username: string
  email: string
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  user: User
  accessToken: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface VerifyOTPRequest {
  email: string
  code: string
}

export interface VerifyOTPResponse {
  message: string
  token?: string
}

export interface ResetPasswordRequest {
  email: string
  code: string
  newPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

// --- Administración de Usuarios ---

export type AdminUserStatus = 'active' | 'suspended' | 'blocked'

export interface AdminUserListItem {
  id: string
  email: string
  accountStatus: AdminUserStatus
  warnings: number
  reportCount: number
  createdAt: string
}

export interface AdminUsersResponse {
  data: AdminUserListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AdminUsersQueryParams {
  status?: AdminUserStatus
  search?: string
  hasWarnings?: boolean
  page?: number
  limit?: number
}

export interface AdminUserStats {
  total: number
  active: number
  suspended: number
  blocked: number
  withWarnings: number
}

export interface AdminFamilyMember {
  id: string
  name: string
  type: 'adult' | 'child'
  age: number
  birthDate: string
  interests: string[]
  profileImage: string | null
  createdAt: string
}

export interface AdminFamily {
  id: string
  familyName: string
  bio: string
  languages: string[]
  interests: string[]
  location: string
  profileImage: string
  isActive: boolean
  isProfileComplete: boolean
  createdAt: string
  updatedAt: string
  members: AdminFamilyMember[]
}

export interface AdminUserHistoryItem {
  date: string
  action: string
  icon: string
}

export interface AdminUserDetail {
  id: string
  email: string
  role: string
  accountStatus: AdminUserStatus
  suspendedUntil: string | null
  suspensionReason: string | null
  warnings: number
  lastWarningDate: string | null
  blockReason: string | null
  lastActivityDate: string | null
  createdAt: string
  reportCount: number
  recentReports: any[]
  clicksCount: number
  family: AdminFamily | null
  history: AdminUserHistoryItem[]
}

export interface WarnUserPayload {
  reason: string
  adminNotes?: string
}

export interface SuspendUserPayload {
  days: number
  reason: string
  adminNotes?: string
}

export interface BlockUserPayload {
  reason: string
  adminNotes?: string
}

export interface ActivateUserPayload {
  reason: string
  adminNotes?: string
}

export type BulkActionType = 'warn' | 'suspend' | 'block' | 'activate'

export interface BulkActionPayload {
  userIds: string[]
  action: BulkActionType
  reason: string
  days?: number
}

// --- Palabras Prohibidas (Moderation) ---

export interface ForbiddenWord {
  id: string
  word: string
  isStrong: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ForbiddenWordsResponse {
  data: ForbiddenWord[]
  total: number
}

export interface CreateForbiddenWordPayload {
  word: string
  isStrong: boolean
}

export interface UpdateForbiddenWordPayload {
  word: string
  isStrong: boolean
}

// --- Dashboard Analytics ---

export interface TrendData {
  current: number
  previous: number
  change: number
  percentageChange: number
  isUpward: boolean
}

export interface ActiveUsersData {
  count: number
  trend: TrendData
}

export interface MonthlyDataPoint {
  month: string
  year: number
  value: number
}

export interface NewUsersData {
  monthlyData: MonthlyDataPoint[]
  totalThisMonth: number
  trendMessage: string
}

export interface ClickSuccessRateData {
  percentage: number
  matchCount: number
  clickCount: number
  trend: TrendData
}

export interface AverageClicksPerFamilyData {
  average: number
  trend: TrendData
}

export interface LanguageStat {
  language: string
  count: number
  percentage: number
}

export interface LanguagesData {
  stats: LanguageStat[]
  trend: TrendData
}

export interface DashboardAnalyticsResponse {
  activeUsers: ActiveUsersData
  newUsers: NewUsersData
  clickSuccessRate: ClickSuccessRateData
  averageClicksPerFamily: AverageClicksPerFamilyData
  languages: LanguagesData
}

// --- Usage Metrics (/api/analytics/usage-metrics) ---

export interface PlaydatesCreatedData {
  average: number
  trend: TrendData
  monthlyData: MonthlyDataPoint[]
}

export interface ConversionTimeData {
  averageDays: number
  description: string
}

export interface ClicksPerFamilyData {
  average: number
  trend: TrendData
}

export interface AgeGroupStat {
  ageGroup: string
  count: number
  percentage: number
}

export interface AgeGroupsData {
  stats: AgeGroupStat[]
  totalProfiles: number
}

export interface ClicksMonthlyData {
  monthlyData: MonthlyDataPoint[]
  trend: TrendData
}

export interface UsageMetricsResponse {
  playdatesCreated: PlaydatesCreatedData
  conversionTime: ConversionTimeData
  clicksPerFamily: ClicksPerFamilyData
  ageGroups: AgeGroupsData
  clicksMonthly: ClicksMonthlyData
}

// --- Settings: Legal Documents (/api/settings/legal-documents/active) ---

export type LegalDocumentType = 'terms' | 'privacy' | 'privacy_policy'

export interface LegalDocument {
  id: string
  type: LegalDocumentType
  title: string
  content: string
  version: number
  isActive: boolean
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}
