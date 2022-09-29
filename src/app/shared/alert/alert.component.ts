import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();
  private alertSub: Subscription | undefined;

  constructor() {}

  ngOnInit(): void {
    this.alertSub = fromEvent<KeyboardEvent>(document, 'keydown').subscribe(
      (event) => {
        if (event.key === 'Escape') this.onClose();
      }
    );
  }
  onClose() {
    this.close.emit();
  }

  ngOnDestroy() {
    this.alertSub?.unsubscribe();
  }
}
