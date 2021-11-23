interface ReqSupportItem {
  Title: string
  Rtype: {
    TechnicalIssue: string
    LibraryContent: string
    DocumentContent: string
    Enhancement: string
    Training: string
  }
  Details: string
  PubsURL: string
  PubID: string
  Status: {
    Submitted: string
    Open: string
    Resolved: string
  }
  Resolution: string
  ResolutionDate: string
  Modified: string
  Created: string
  Author: string
  Editor: string
}
export { ReqSupportItem }
