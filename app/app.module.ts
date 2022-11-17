import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { appDeclarations, appBootstrap, appProviders, appEntryComponents } from './config/declarations';
import { appImportModules } from './config/import-modules';
import { UserGroupsComponent } from './components/user-groups/user-groups.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
// import { ChecklistDatabase } from './components/accessprivilegeComponent/accessprivilege.component';

import { MovePopupComponent } from './components/move-popup/move-popup.component';
import { ListUserGroupDialogComponent } from './components/list-user-group-dialog/list-user-group-dialog.component';
import { UserGroupListComponent } from './components/user-group-list/user-group-list.component';
import { ShowUserListDialogComponent } from './components/show-user-list-dialog/show-user-list-dialog.component';
import { ReportsByActionComponent } from './components/reports-by-action/reports-by-action.component';
import { VersionHistoryComponent } from './components/version-history/version-history.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DeletePopupComponent } from './components/delete-popup/delete-popup.component';
import { DepartmentFilterComponent } from './components/department-filter/department-filter.component';

@NgModule({
  declarations: [...appDeclarations, SignInComponent,UserGroupsComponent, ListUserGroupDialogComponent, UserGroupListComponent,MovePopupComponent, ShowUserListDialogComponent,ReportsByActionComponent, VersionHistoryComponent,DeletePopupComponent,DashboardComponent, DepartmentFilterComponent],
  imports: [...appImportModules],
  providers: [...appProviders],
  entryComponents: [...appEntryComponents],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [...appBootstrap]
})
export class AppModule { }
