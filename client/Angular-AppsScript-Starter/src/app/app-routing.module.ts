import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';


const routes: Routes = [
  { path: '**', component: SidebarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
