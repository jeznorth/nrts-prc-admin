import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ApiService } from 'app/services/api';
import { JwtUtil } from 'app/jwt-util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('toggleNav', [
      state('navClosed', style({
        height: '0',
      })),
      state('navOpen', style({
        height: '*',
      })),
      transition('navOpen => navClosed', [
        animate('0.2s')
      ]),
      transition('navClosed => navOpen', [
        animate('0.2s')
      ]),
    ]),
  ]
})

export class HeaderComponent {
  isNavMenuOpen = false;
  welcomeMsg: String;
  private _api: ApiService;
  private jwt: {
    username: String,
    scopes: Array<String>
  };

  constructor(private api: ApiService, private router: Router) {
    this._api = api;
    router.events.subscribe((val) => {
      // TODO: Change this to observe the change in the _api.token
      if (val instanceof NavigationEnd && val.url !== '/login' && this._api.token) {
        const jwt = new JwtUtil().decodeToken(this._api.token);
        this.welcomeMsg = jwt ? ('Hello ' + jwt.username) : 'Login';
        this.jwt = jwt;
      } else {
        this.welcomeMsg = 'Login';
        this.jwt = null;
      }
      // console.log('val:', val instanceof NavigationEnd);
    });
  }

  renderMenu(route: String) {
    // Sysadmin's get administration.
    if (route === 'administration') {
      return (this.jwt && this.jwt.scopes.find(x => x === 'sysadmin') && this.jwt.username === 'admin');
    }
  }

  toggleNav() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  closeNav() {
    this.isNavMenuOpen = false;
  }
}
