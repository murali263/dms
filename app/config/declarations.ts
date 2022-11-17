import { PageNotFoundComponent } from "../not-found.component";
import { LayoutComponent } from "../layout/layout.component";
import { ImgSrcDirective } from "../directives/imgSrc.directive";
import { APP_INITIALIZER } from "@angular/core";
import { NDataSourceService } from "../n-services/n-dataSorce.service";
import { environment } from "../../environments/environment";
import { NMapComponent } from "../n-components/nMapComponent/n-map.component";
import { NLocaleResource } from "../n-services/n-localeResources.service";
import { NAuthGuardService } from "neutrinos-seed-services";
import { ArtImgSrcDirective } from "../directives/artImgSrc.directive";

window["neutrinos"] = {
  environments: environment,
};

//CORE_REFERENCE_IMPORTS
//CORE_REFERENCE_IMPORT-confirmdlgComponent
import { confirmdlgComponent } from "../components/confirmdlgComponent/confirmdlg.component";
//CORE_REFERENCE_IMPORT-linkdetailsdlgComponent
import { linkdetailsdlgComponent } from "../components/linkdetailsdlgComponent/linkdetailsdlg.component";
//CORE_REFERENCE_IMPORT-configdetailsresolveService
import { configdetailsresolveService } from "../services/configdetailsresolve/configdetailsresolve.service";
//CORE_REFERENCE_IMPORT-configdetailsComponent
import { configdetailsComponent } from "../components/configdetailsComponent/configdetails.component";
//CORE_REFERENCE_IMPORT-configpopupComponent
import { configpopupComponent } from "../components/configpopupComponent/configpopup.component";
//CORE_REFERENCE_IMPORT-userlistComponent
import { userlistComponent } from "../components/userlistComponent/userlist.component";
//CORE_REFERENCE_IMPORT-listdialogComponent
import { listdialogComponent } from "../components/listdialogComponent/listdialog.component";
//CORE_REFERENCE_IMPORT-casedetailsComponent
import { casedetailsComponent } from "../components/casedetailsComponent/casedetails.component";
//CORE_REFERENCE_IMPORT-docviewerComponent
import { docviewerComponent } from "../components/docviewerComponent/docviewer.component";
//CORE_REFERENCE_IMPORT-caselistComponent
import { caselistComponent } from "../components/caselistComponent/caselist.component";
//CORE_REFERENCE_IMPORT-createfolderComponent
import { createfolderComponent } from "../components/createfolderComponent/createfolder.component";
//CORE_REFERENCE_IMPORT-deletegroupComponent
import { deletegroupComponent } from "../components/deletegroupComponent/deletegroup.component";
//CORE_REFERENCE_IMPORT-viewnotesComponent
import { viewnotesComponent } from "../components/viewnotesComponent/viewnotes.component";
//CORE_REFERENCE_IMPORT-nonaccessComponent
import { nonaccessComponent } from "../components/nonaccessComponent/nonaccess.component";
//CORE_REFERENCE_IMPORT-trashlistresolverService
import { trashlistresolverService } from "../services/trashlistresolver/trashlistresolver.service";
//CORE_REFERENCE_IMPORT-configresolverService
import { configresolverService } from "../services/configresolver/configresolver.service";
//CORE_REFERENCE_IMPORT-searchComponent
import { searchComponent } from "../components/searchComponent/search.component";
//CORE_REFERENCE_IMPORTS
//CORE_REFERENCE_IMPORT-versionhistoryComponent
import { versionhistoryComponent } from "../components/versionhistoryComponent/versionhistory.component";
//CORE_REFERENCE_IMPORT-authguardService
import { authguardService } from "../services/authguard/authguard.service";
//CORE_REFERENCE_IMPORT-resolverService
import { resolverService } from "../services/resolver/resolver.service";
//CORE_REFERENCE_IMPORT-privilegegroupsComponent
import { privilegegroupsComponent } from "../components/privilegegroupsComponent/privilegegroups.component";
//CORE_REFERENCE_IMPORTS
//CORE_REFERENCE_IMPORT-dilogueComponent
import { dilogueComponent } from "../components/dilogueComponent/dilogue.component";
//CORE_REFERENCE_IMPORT-awaitingapprovalComponent
import { awaitingapprovalComponent } from "../components/awaitingapprovalComponent/awaitingapproval.component";
//CORE_REFERENCE_IMPORT-AwaitingnewapprovalComponent
import { AwaitingnewapprovalComponent } from "../components/awaitingnewapproval/awaitingnewapproval.component";
//CORE_REFERENCE_IMPORT-fstreeService
import { fstreeService } from "../services/fstree/fstree.service";
//CORE_REFERENCE_IMPORT-documentschildComponent
import { documentschildComponent } from "../components/documentschildComponent/documentschild.component";
//CORE_REFERENCE_IMPORT-documentsparentComponent
import { documentsparentComponent } from "../components/documentsparentComponent/documentsparent.component";
//CORE_REFERENCE_IMPORT-configurationComponent
import { configurationComponent } from "../components/configurationComponent/configuration.component";
//CORE_REFERENCE_IMPORT-trashComponent
import { trashComponent } from "../components/trashComponent/trash.component";
//CORE_REFERENCE_IMPORT-approvalstatusComponent
import { approvalstatusComponent } from "../components/approvalstatusComponent/approvalstatus.component";
//CORE_REFERENCE_IMPORT-backendService
import { backendService } from "../services/backend/backend.service";
//CORE_REFERENCE_IMPORT-uploadfileComponent
import { uploadfileComponent } from "../components/uploadfileComponent/uploadfile.component";
//CORE_REFERENCE_IMPORT-documentdetailsComponent
import { documentdetailsComponent } from "../components/documentdetailsComponent/documentdetails.component";
//CORE_REFERENCE_IMPORT-documentviewComponent

//CORE_REFERENCE_IMPORT-accessgroupsComponent
import { accessgroupsComponent } from "../components/accessgroupsComponent/accessgroups.component";
//CORE_REFERENCE_IMPORT-accessprivilegeComponent
import { accessprivilegeComponent } from "../components/accessprivilegeComponent/accessprivilege.component";
//CORE_REFERENCE_IMPORT-accessfeatureComponent
import { accessfeatureComponent } from "../components/accessfeatureComponent/accessfeature.component";
//CORE_REFERENCE_IMPORT-accessactionComponent
import { accessactionComponent } from "../components/accessactionComponent/accessaction.component";
//CORE_REFERENCE_IMPORT-accesscontrolComponent
import { accesscontrolComponent } from "../components/accesscontrolComponent/accesscontrol.component";
//CORE_REFERENCE_IMPORT-genericService
import { genericService } from "../services/generic/generic.service";
import { ingredionloaderService } from "../services/ingredionloader/ingredionloader.service";
//CORE_REFERENCE_IMPORT-homeComponent
import { homeComponent } from "../components/homeComponent/home.component";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { DatePipe } from "@angular/common";
import { backend } from "../sd-services/backend";
import { reportsComponent } from "app/components/reportsComponent/reports.component";

import { SignInComponent } from "../components/sign-in/sign-in.component";
import { MovePopupComponent } from "./../components/move-popup/move-popup.component";
import { UserGroupListComponent } from "app/components/user-group-list/user-group-list.component";
import { UserGroupsComponent } from "app/components/user-groups/user-groups.component";
import { ListUserGroupDialogComponent } from "app/components/list-user-group-dialog/list-user-group-dialog.component";
import { ShowUserListDialogComponent } from "app/components/show-user-list-dialog/show-user-list-dialog.component";
import { ReportsByActionComponent } from "app/components/reports-by-action/reports-by-action.component";
import { VersionHistoryComponent } from "app/components/version-history/version-history.component";
import { DashboardComponent } from "app/components/dashboard/dashboard.component";
//CORE_REFERENCE_IMPORT-documentadminComponent
import {
  documentadminComponent,
  updatepopupComponent,
} from "app/components/documentadminComponent/documentadmin.component";
import { statusapprovedComponent } from "app/components/statusapprovedComponent/statusapproved.component";
import { statusrejectedComponent } from "app/components/statusrejectedComponent/statusrejected.component";
import { DeletePopupComponent } from "app/components/delete-popup/delete-popup.component";

/**
 * Reads datasource object and injects the datasource object into window object
 * Injects the imported environment object into the window object
 *
 */
export function startupServiceFactory(startupService: NDataSourceService) {
  return () => startupService.getDataSource();
}

/**
 *bootstrap for @NgModule
 */
export const appBootstrap: any = [LayoutComponent];

/**
 *Entry Components for @NgModule
 */
export const appEntryComponents: any = [
  dilogueComponent,
  versionhistoryComponent,
  viewnotesComponent,
  deletegroupComponent,
  createfolderComponent,
  listdialogComponent,
  configpopupComponent,
  linkdetailsdlgComponent,
  confirmdlgComponent,
  MovePopupComponent,
  ListUserGroupDialogComponent,
  ShowUserListDialogComponent,
  updatepopupComponent,
  DeletePopupComponent,
  //CORE_REFERENCE_PUSH_TO_ENTRY_ARRAY
];

/**
 *declarations for @NgModule
 */
export const appDeclarations = [
  ImgSrcDirective,
  LayoutComponent,
  PageNotFoundComponent,
  NMapComponent,
  ArtImgSrcDirective,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-confirmdlgComponent
  confirmdlgComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-linkdetailsdlgComponent
  linkdetailsdlgComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-configdetailsComponent
  configdetailsComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-configpopupComponent
  configpopupComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-userlistComponent
  userlistComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-listdialogComponent
  listdialogComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-casedetailsComponent
  casedetailsComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-caselistComponent
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-docviewerComponent
  docviewerComponent,
  caselistComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-createfolderComponent
  createfolderComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-deletegroupComponent
  deletegroupComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-viewnotesComponent
  viewnotesComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-nonaccessComponent
  nonaccessComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-searchComponent
  searchComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-versionhistoryComponent
  versionhistoryComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-privilegegroupsComponent
  privilegegroupsComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-dilogueComponent
  dilogueComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-awaitingapprovalComponent
  awaitingapprovalComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-AwaitingnewapprovalComponent
  AwaitingnewapprovalComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-reportsComponent
  reportsComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-configurationComponent
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-documentschildComponent
  documentschildComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-documentsparentComponent
  documentsparentComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-configurationComponent
  configurationComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-trashComponent
  trashComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-approvalstatusComponent
  approvalstatusComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-uploadfileComponent
  uploadfileComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-documentdetailsComponent
  documentdetailsComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-accesscontrolComponent
  accesscontrolComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-documentsComponent
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-accessgroupsComponent
  accessgroupsComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-accessprivilegeComponent
  accessprivilegeComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-accessfeatureComponent
  accessfeatureComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-accessactionComponent
  accessactionComponent,
  homeComponent,
  SignInComponent,
  MovePopupComponent,
  documentadminComponent,
  statusapprovedComponent,
  statusrejectedComponent,
  updatepopupComponent,
  // documentadminComponent,
  statusapprovedComponent,
];

/**
 * provider for @NgModuke
 */
export const appProviders = [
  NDataSourceService,
  NLocaleResource,
  {
    // Provider for APP_INITIALIZER
    provide: APP_INITIALIZER,
    useFactory: startupServiceFactory,
    deps: [NDataSourceService],
    multi: true,
  },
  {
    // Provider for APP_INITIALIZER
    provide: HTTP_INTERCEPTORS,
    useClass: ingredionloaderService,
    multi: true,
  },
  NAuthGuardService,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY-configdetailsresolveService
  configdetailsresolveService,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY-trashlistresolverService
  trashlistresolverService,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY-configresolverService
  configresolverService,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY-authguardService
  authguardService,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY-resolverService
  resolverService,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY-fstreeService
  fstreeService,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY-backendService
  backendService,
  backend,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY-genericService
  genericService,
  ingredionloaderService,
  DatePipe,
];

/**
 * Routes available for bApp
 */

// CORE_REFERENCE_PUSH_TO_ROUTE_ARRAY_START
export const appRoutes = [
  {
    path: "home",
    component: homeComponent,
    resolve: { configData: resolverService },
    canActivate: [authguardService],
    children: [
      { path: "documents", component: documentsparentComponent, children: [] },
      { path: "user-groups/create", component: UserGroupsComponent },
      { path: "user-groups", component: UserGroupListComponent },
      {
        path: "version-history",
        component: VersionHistoryComponent,
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "accessAction/groups/create",
        component: accessactionComponent,
        canActivate: [authguardService],
        children: [
          { path: "accessFeature", component: accessfeatureComponent },
          { path: "accessPrivilege", component: accessprivilegeComponent },
          {
            path: "accessGroups",
            component: accessgroupsComponent,
            children: [],
          },
        ],
      },
      {
        path: "documents/uploadfile",
        component: uploadfileComponent,
        resolve: {
          configData: resolverService,
          featureAccess: configresolverService,
        },
        canActivate: [authguardService],
        children: [],
      },
      {
        path: "status/rejected",
        component: statusrejectedComponent,
        children: [],
      },
      { path: "status/approval", component: AwaitingnewapprovalComponent },
      { path: "status/approved", component: statusapprovedComponent },
      {
        path: "status/documentad",
        component: documentadminComponent,
      },
      {
        path: "trash",
        component: trashComponent,
        resolve: { trashData: trashlistresolverService },
        canActivate: [authguardService],
      },
      { path: "AddLinkDetails", component: linkdetailsdlgComponent },
      {
        path: "configuration",
        component: configurationComponent,
        canActivate: [authguardService],
        children: [],
      },
      {
        path: "reports-by-expiry",
        component: reportsComponent,
        canActivate: [authguardService],
      },
      {
        path: "reports-by-action",
        component: ReportsByActionComponent,
        canActivate: [authguardService],
      },
      {
        path: "reports",
        redirectTo: "reports-by-action",
      },
      {
        path: "accessAction/groups",
        component: privilegegroupsComponent,
        canActivate: [authguardService],
      },
      {
        path: "approval",
        component: awaitingapprovalComponent,
        canActivate: [authguardService],
      },
      {
        path: "documents/editfile",
        component: uploadfileComponent,
        resolve: {
          configData: resolverService,
          featureAccess: configresolverService,
        },
      },
      { path: "case", component: caselistComponent, children: [] },
      {
        path: "case/caseDetails",
        component: casedetailsComponent,
        children: [],
      },
      { path: "accessAction/users", component: userlistComponent },
      {
        path: "configuration/configDetails/:configId",
        component: configdetailsComponent,
        resolve: { configData: configdetailsresolveService },
      },
    ],
  },
  { path: "sign-in", component: SignInComponent },
  { path: "", redirectTo: "sign-in", pathMatch: "full" },
  { path: "nonaccess", component: nonaccessComponent },
  { path: "**", redirectTo: "sign-in", pathMatch: "full" },
];
// CORE_REFERENCE_PUSH_TO_ROUTE_ARRAY_END
