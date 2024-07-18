import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vex-error-404',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './error-404.component.html',
  styleUrl: './error-404.component.scss'
})
export class Error404Component implements OnInit {
  constructor() {}

  ngOnInit() {}
}

