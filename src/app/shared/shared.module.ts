import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AlertComponent } from "./alert/alert.component";
import { LoadingSpinerComponent } from "./loading-spiner/loading-spiner.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";
import { DropdownDirective } from "./dropdown.directive";

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinerComponent,
    PlaceholderDirective,
    DropdownDirective,
  ],
  exports: [
    AlertComponent,
    LoadingSpinerComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule,
  ],
  imports: [CommonModule],
})
export class SharedModule {}
