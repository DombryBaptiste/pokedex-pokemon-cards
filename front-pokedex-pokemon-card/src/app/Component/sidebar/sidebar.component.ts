import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { slideInOutAnimation } from './sidebat.animations';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    slideInOutAnimation
  ]
})
export class SidebarComponent {

  closeSideBar = output();
  isOpen = input(false);

  handleCloseSideBar()
  {
    this.closeSideBar.emit();
  }
}
