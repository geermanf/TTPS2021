import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../_metronic/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit {

  constructor(private layout: LayoutService, private loc: Location) { }

  ngOnInit(): void {
  }

  private getLogo() {
  }
}
