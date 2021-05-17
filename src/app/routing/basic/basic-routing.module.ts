import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from 'src/app/component/about-us/about-us.component';
import { MenuBarComponent } from 'src/app/component/menu/menu-bar/menu-bar.component';

const routes: Routes = [{
  path: '',
  component: AboutUsComponent,
  children: [
    {
      path: 'home',
      component: AboutUsComponent
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicRoutingModule { }
