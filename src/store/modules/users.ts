/* eslint-disable @typescript-eslint/no-this-alias */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { UserInt } from '../../interfaces/User'
import { TodoItem } from '../../interfaces/TodoItem'
// import { ObjectItem } from '../../interfaces/ObjectItem'
import axios from 'axios'
import moment from 'moment'

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
  public todoCount?: number
  public todos?: Array<TodoItem> = []
  // public baseUrl = _spPageContextInfo.webServerRelativeUrl /* + 'doctrine.navy.mil' */
  public baseUrl = tp1 + slash + slash + tp2 // 'https://doctrine.navy.mil'
  public vm = this

  @Mutation updateDigest(digest: string): void {
    this.digest = digest
  }

  @Mutation
  public updateTodos(todos: Array<any>): void {
    this.todos = todos
    this.todoCount = todos.length
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
    this.currentUser.recordid = data.recordid // row id in personnel list not user id
    this.currentUser.Account = data.Account
    this.currentUser.Email = data.Email
    this.currentUser.EmailLink = data.EmailLink
    this.currentUser.DisplayName = data.DisplayName
    this.currentUser.Phone = data.Phone
    this.currentUser.CellPhone = data.CellPhone
    this.currentUser.Manager = data.Manager
    this.currentUser.FirstName = data.FirstName
    this.currentUser.LastName = data.LastName
    this.currentUser.JSONData = data.JSONData
    this.currentUser.Company = data.Company
  }

  @Mutation
  public updateUserJSONData(data: any): void {
    this.currentUser.JSONData = data
  }

  @Mutation
  public updateUserPermissions(data: any): void {
    this.currentUser.isPM = data.isPM === true ? true : false
    this.currentUser.isSecurity = data.isSecurity === true ? true : false
    this.currentUser.isDeveloper = data.isDeveloper === true ? true : false
    this.currentUser.isOwner = data.isOwner === true ? true : false
    this.currentUser.isWPManager = data.isWPManager === true ? true : false
    this.currentUser.isApprover = data.isApprover === true ? true : false
    this.currentUser.isTravelApprover = data.isTravelApprover === true ? true : false
    this.currentUser.isPCA = data.isPCA === true ? true : false
    this.currentUser.isQA = data.isQA === true ? true : false
    this.currentUser.isMember = data.isMember === true ? true : false
    this.currentUser.isSubcontractor = data.isSubcontractor === true ? true : false
    this.currentUser.isAdmin = data.isAdmin === true ? true : false
    this.currentUser.isAFRL = data.isAFRL === true ? true : false
    this.currentUser.isAFRLCEU = data.isAFRLCEU === true ? true : false
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
  public async getTodosByUser(): Promise<boolean> {
    let allTodos: any[] = []
    const p: Array<TodoItem> = []
    const that = this
    // if local just fake it for the current test
    let userid = 0
    if (!local) {
      userid = this.currentUser.userid
    } else {
      userid = 1
    }
    if (!local) {
      const that = this
      async function getAllTodos(turl: string): Promise<void> {
        if (turl === '') {
          turl = that.baseUrl + "/_api/lists/getbytitle('Tasks')/items?"
          turl += '$select=*,AssignedTo/Id&$expand=AssignedTo/Id'
          turl += '&$filter=(AssignedTo/Id eq ' + userid + ") and (Status ne 'Completed')"
        }
        const response = await axios.get(turl, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        const results = response.data.d.results
        allTodos = allTodos.concat(results)
        if (response.data.d.__next) {
          turl = response.data.d.__next
          return getAllTodos(turl)
        } else {
          // Use the results
          const j = allTodos
          for (let i = 0; i < j.length; i++) {
            p.push({
              Id: Number(j[i]['Id']),
              Title: j[i]['Title'], // This is the Title column in SharePoint
              Status: j[i]['Status'],
              StartDate: moment(j[i]['StartDate']).isValid() ? moment(j[i]['StartDate']).format('MM/DD/YYYY') : '',
              DueDate: moment(j[i]['DueDate']).isValid() ? moment(j[i]['DueDate']).format('MM/DD/YYYY') : '',
              TaskType: j[i]['TaskType'],
              Body: j[i]['Description'],
              AssignedTo: {
                Title: j[i]['AssignedTo']['Title'],
                Id: j[i]['AssignedTo']['ID'],
                Email: j[i]['AssignedTo']['EMail']
              },
              etag: j[i]['__metadata']['etag'],
              uri: j[i]['__metadata']['uri']
            })
          }
          that.context.commit('updateTodos', p)
        }
      }
      getAllTodos('')
      return true
    } else {
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
      this.context.commit('updateUserProfile', profile)
      // this.context.commit("updateUserName", profile.DisplayName)
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
          case 'Approvers':
            permissions.isApprover = true
            break

          case 'Visitors':
            permissions.isVisitor = true
            break

          case 'Members':
            permissions.isMember = true
            break

          case 'Developers':
            permissions.isDeveloper = true
            break

          case 'Owners':
            permissions.isOwner = true
            break

          case 'Library Administrators':
            permissions.isAdmin = true
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
