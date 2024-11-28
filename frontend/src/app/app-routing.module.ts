import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { CreatearticleComponent } from './createarticle/createarticle.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthorComponent } from './author/author.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from './services/auth.guard';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },

  { path: "home", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "privacy", component: PrivacyComponent },

  { path: "create", canActivate: [AuthGuard], component: CreatearticleComponent },
  { path: "settings", canActivate: [AuthGuard], component: SettingsComponent },
  { path: "article/:id", component: DetailComponent },
  { path: "author/:id", component: AuthorComponent },

  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },

  { path: "**", component: NotfoundComponent },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AppRoutingModule { }
