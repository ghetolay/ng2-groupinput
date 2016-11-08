import { Directive, forwardRef, Input, Output, EventEmitter, Self, Inject, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { FULLFILL, Fullfill } from './model';

@Directive({
  selector: '[ffLength]',
  providers: [{
    provide: FULLFILL,
    useExisting: forwardRef(() => FullfillLengthDirective)
  }]
})
export class FullfillLengthDirective implements Fullfill {

  @Output() onFullfill;

  @Input() ffLength: number;

  private subscription = Subscription.EMPTY;

  constructor(@Self() @Inject(NgControl) public control: NgControl, public elRef:ElementRef) { }

  ngOnInit() {
    this.onFullfill = this.control.valueChanges
      .filter( v => v && v.toString().length >= this.ffLength );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
