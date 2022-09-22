import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();
  private alertSub!: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.alertSub = fromEvent(document, 'keydown')
      .pipe(
        map((event) => {
          return event as KeyboardEvent;
        })
      )
      .subscribe((event) => {
        if (event.key === 'Escape') this.onClose();
      });
  }

  onClose() {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }
}
