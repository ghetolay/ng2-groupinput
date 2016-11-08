import { OpaqueToken, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

export const FULLFILL = new OpaqueToken('fullfill');

export interface Fullfill {
  control: NgControl;
  elRef: ElementRef;
  onFullfill: Observable<any>;
}
