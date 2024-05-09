/* eslint-disable @typescript-eslint/no-this-alias */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { UserInt } from '../../interfaces/User'
import axios from 'axios'

declare const _spPageContextInfo: any

var slash = '/'
var tp1 = String(window.location.protocol)
var tp2 = String(window.location.host)

// are we on a localhost demo?
let loc = String(window.location)
let local = false
if (loc.indexOf('localhost') >= 0) {
  local = true
}

@Module({ namespaced: true })
class Users extends VuexModule {
  public digest?: string = ''
  public loaded?: boolean = false
  public currentUser!: UserInt
  public baseUrl = tp1 + slash + slash + tp2
  public vm = this

  @Mutation updateDigest(digest: string): void {
    this.digest = digest
  }

  @Mutation
  public updateLoaded(loaded: boolean): void {
    this.loaded = loaded
    console.log('User Loaded')
  }

  @Mutation
  public addUser(newUser: UserInt): void {
    this.currentUser = newUser
  }

  @Mutation
  public updateUserProfile(data: any): void {
    this.currentUser.Account = data.Account
    this.currentUser.Email = data.Email
    this.currentUser.EmailLink = data.EmailLink
    this.currentUser.DisplayName = data.DisplayName
    this.currentUser.Phone = data.Phone
    this.currentUser.CellPhone = data.CellPhone
    this.currentUser.Manager = data.Manager
    this.currentUser.FirstName = data.FirstName
    this.currentUser.LastName = data.LastName
  }

  @Mutation
  public updateUserPermissions(data: any): void {
    this.currentUser.isDeveloper = data.isDeveloper === true ? true : false
    this.currentUser.isOwner = data.isOwner === true ? true : false
    this.currentUser.isActionOfficer = data.isActionOfficer === true ? true : false
    this.currentUser.isLibrarian = data.isLibrarian === true ? true : false
    this.currentUser.isAdmin = data.isAdmin === true ? true : false
    this.currentUser.isVisitor = true
    this.currentUser.isNATOVisitor = data.isNATOVisitor === true ? true : false
    this.currentUser.isNATOApprover = data.isNATOApprover === true ? true : false
    this.currentUser.isNATOLibrarian = data.isNATOLibrarian === true ? true : false
    this.currentUser.isTerminologist = data.isTerminologist === true ? true : false
    this.currentUser.canViewArchives = data.canViewArchives === true ? true : false
    this.currentUser.canViewDevPubs = data.canViewDevPubs === true ? true : false
  }

  @Action
  public async getDigest(): Promise<boolean> {
    if (!local) {
      const response = await axios.request({
        url: this.baseUrl + '/_api/contextinfo',
        method: 'POST',
        headers: { Accept: 'application/json; odata=verbose' }
      })
      this.context.commit('updateDigest', response.data.d.GetContextWebInformation.FormDigestValue)
      return true
    } else {
      // should not call on local
      return true
    }
  }

  @Action
  public async getUserId(): Promise<UserInt | boolean> {
    if (!local) {
      const idurl = this.baseUrl + '/_api/Web/CurrentUser?$select=*'
      const response = await axios.get(idurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      const id = response.data.d.Id
      const nuser: UserInt = {
        userid: id,
        Email: response.data.d.Email
      }
      this.context.commit('addUser', nuser)
      return nuser
    } else {
      const nuser: UserInt = {
        userid: 1,
        Email: 'Donald.Duck@cartoon.net'
      }
      this.context.commit('addUser', nuser)
      return nuser
    }
  }

  @Action
  public async getUserProfile(): Promise<boolean> {
    if (!local) {
      const userurl = this.baseUrl + '/_api/SP.UserProfiles.PeopleManager/GetMyProperties'
      let response = await axios.get(userurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      const profile = {} as any
      const properties = response.data.d.UserProfileProperties.results
      profile.Account = response.data.d.AccountName
      profile.Email = this.currentUser.Email !== null || this.currentUser.Email !== '' ? this.currentUser.Email : response.data.d.Email
      profile.EmailLink = 'mailto:' + response.data.d.Email
      profile.DisplayName = response.data.d.DisplayName
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i]
        switch (property.Key) {
          case 'WorkPhone':
            profile.Phone = property.Value
            break

          case 'CellPhone':
            profile.CellPhone = property.Value
            break

          case 'Manager':
            profile.Manager = property.Value
            break

          case 'LastName':
            profile.LastName = property.Value
            break

          case 'FirstName':
            profile.FirstName = property.Value
            break
        }
      }
      profile.isDeveloper = false
      profile.isOwner = false
      profile.isActionOfficer = false
      profile.isLibrarian = false
      profile.isAdmin = false
      profile.isVisitor = false
      profile.isNATOVisitor = false
      profile.isNATOApprover = false
      profile.isNATOLibrarian = false
      profile.isTerminologist = false
      profile.canViewArchives = false
      profile.canAddPubs = false
      profile.canViewDevPubs = false
      this.context.commit('updateUserProfile', profile)
      return true
    } else {
      const profile = {} as any
      profile.Account = 'AccountName'
      profile.Email = 'Donald.Duck@cartoon.net'
      profile.EmailLink = 'mailto:Donald.Duck@cartoon.net'
      profile.DisplayName = 'Donald Duck'
      profile.Phone = '(666) 666-6666'
      profile.CellPhone = '(555) 555-5555'
      profile.Manager = 'Mickey Mouse'
      profile.LastName = 'Duck'
      profile.FirstName = 'Donald'
      profile.isDeveloper = true
      profile.isOwner = true
      profile.isActionOfficer = true
      profile.isLibrarian = true
      profile.isAdmin = true
      profile.isVisitor = false // have to set false by default to test all functions
      profile.isNATOVisitor = true
      profile.isNATOApprover = true
      profile.isNATOLibrarian = true
      profile.isTerminologist = true
      return true
    }
  }

  @Action
  public async getUserPermissions(id: number): Promise<UserInt> {
    if (!local) {
      const groupurl = this.baseUrl + "/_api/web/getuserbyid('" + id + "')/groups"
      console.log('groupurl: ' + groupurl)
      const response = await axios.get(groupurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      const usergroups = response.data.d.results
      const permissions = {} as any
      for (let i = 0; i < usergroups.length; i++) {
        switch (usergroups[i].Title) {
          case 'Developers':
            permissions.isDeveloper = true
            permissions.canViewDevPubs = true
            break

          case 'Doctrine Action Officers':
            permissions.isActionOfficer = true
            permissions.canViewArchives = true
            permissions.canViewDevPubs = true
            break

          case 'Doctrine Librarian':
            permissions.isLibrarian = true
            permissions.canViewArchives = true
            permissions.canAddPubs = true
            permissions.canViewDevPubs = true
            break

          case 'Library Administrators':
            permissions.isAdmin = true
            permissions.canViewArchives = true
            permissions.canViewDevPubs = true
            break

          case 'Terminology Members':
            permissions.isTerminologist = true
            break

          case 'NATO Approvers':
            permissions.isNATOVisitor = true // using to more easily denote users that can see NATO documents
            permissions.isNATOApprover = true
            break

          case 'NATO Librarians':
            permissions.isNATOVisitor = true // using to more easily denote users that can see NATO documents
            permissions.isNATOLibrarian = true
            permissions.isLibrarian = true
            permissions.canViewArchives = true
            permissions.canAddPubs = true
            permissions.canViewDevPubs = true
            break

          case 'NATO Visitors':
            permissions.isNATOVisitor = true // using to more easily denote users that can see NATO documents
            break
        }
      }
      this.context.commit('updateUserPermissions', permissions)
      this.context.commit('updateLoaded', true)
      return this.currentUser
    } else {
      const permissions = {} as any
      permissions.isDeveloper = true
      permissions.isApprover = true
      permissions.isOwner = true
      this.context.commit('updateUserPermissions', permissions)
      this.context.commit('updateLoaded', true)
      return this.currentUser
    }
  }

  /* async getUserById(payload: any) {
    const url = baseUrl + "/_api/Web/GetUserById('" + payload.id + "')"
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    return response
  }

  async getUserProfileFor(payload: any) {
    const url = baseUrl + "/_api/sp.userprofiles.peoplemanager/GetPropertiesFor(AccountName=@v)?@v='" + encodeURIComponent(payload.login) + "'"
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    return response
  } */
}

export default Users
