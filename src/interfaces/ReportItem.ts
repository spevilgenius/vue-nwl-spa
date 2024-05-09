interface ReportItem {
  ID?: number
  DocId?: number
  Title?: string
  Name?: string
  Path?: string
  FileExtension?: string
  IsDoc?: boolean
  Author?: string
  Prefix?: string
  ListId?: string
  ListItemID?: string
  ViewsRecent?: number
  ViewsLifeTime?: number
  DateCreated?: string
  DateStart?: Date
  DateEnd?: Date
}
export { ReportItem }

interface UniqueUserReportItem {
  Rank?: number
  Title?: string
  ViewsLast1DaysUniqueUsers?: number
  ViewsLast2DaysUniqueUsers?: number
  ViewsLast3DaysUniqueUsers?: number
  ViewsLast4DaysUniqueUsers?: number
  ViewsLast5DaysUniqueUsers?: number
  ViewsLast6DaysUniqueUsers?: number
  ViewsLast7DaysUniqueUsers?: number
  ViewsRecentUniqueUsers?: number
  ViewsLastMonths1Unique?: number
  ViewsLastMonths2Unique?: number
  ViewsLastMonths3Unique?: number
  ViewsLifetimeUniqueUsers?: number
  Path?: string
}
export { UniqueUserReportItem }

interface PubsInDevPhaseItem {
  Id?: number
  DocID?: number
  Title?: string
  Phase?: string
  DateEnteredPhase?: Date
  DaysInPhase?: number
  IsNato?: string
  InDevelopment?: string
  PubID?: string
  Development: {
    Phase?: string
    ProjectStart?: string
    ProgramDirective?: string
    FirstDraft?: string
    FinalDraft?: string
    FinalManuscript?: string
    SignatureDraft?: string
    PRAApproval?: string
    NWDCSignature?: string
    PhaseFinish?: string
    ProjectFinish?: string
  }
}
export { PubsInDevPhaseItem }
