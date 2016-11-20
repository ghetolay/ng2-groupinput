import { Directive, Optional, Self, Inject, ContentChildren, ElementRef, Renderer, OnDestroy, QueryList, forwardRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Fullfill, FULLFILL } from './model';

@Directive({
  selector: '[groupInput]'
})
export class GroupInputDirective {

  @ContentChildren(NgControl, {read: ElementRef})
  controls: NgControl;

  @ContentChildren(<any>FULLFILL)
  fullfills: QueryList<Fullfill>;

  private unlistens: Function[] = [];

  constructor( private renderer: Renderer, private elRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.unlistens = [
    	this.renderer.listen(this.elRef.nativeElement, 'keydown', (e: KeyboardEvent) => {

	      // end
	      if (e.keyCode == 35) {
	        e.preventDefault();
	        //TODO maybe better behavior
	        //like last NON-EMPTY input not just last input
	        focusAtEnd(this.fullfills.last);
	      }
	      // home
	      else if(e.keyCode == 36) {
	        e.preventDefault();
	        focusAtStart(this.fullfills.first);
	      }
	    }),
		//TODO just click ?
	    this.renderer.listen(this.elRef.nativeElement, 'click', (e: Event) => {
	    	//click outside inputs
	    	if(e.target && !isInputElement(e.target)) {
	    		/* TODO we should focus on the closest input and at start/end
					depending on where the click was
				*/
	    		this.fullfills.first.elRef.nativeElement.focus()
	    	}
	    })
	]

    // TODO correctors is a QueryList so technically
    // we should listen for changes and unlisten/unsubscribe on deleted element
    this.fullfills.forEach( ff => {
      ff.onFullfill.subscribe( v => {
        focusAtStart( this.getNext(ff) );
      });

      this.renderer.listen(ff.elRef.nativeElement, 'keydown', (e: KeyboardEvent) => {
        let input = e.target;

        if ( isInputElement(input) ) {
           //right arrow
          if (e.keyCode == 39) {
            if( input.selectionStart == input.value.length ){
              e.preventDefault();
              focusAtStart( this.getNext(ff) );
            }
          }
          //left arrow | backspace
          else if (e.keyCode == 37 || e.keyCode == 8) {
            if( input.selectionStart == 0 ) {
              e.preventDefault();
              focusAtEnd( this.getPrev(ff) );
            }
          }
        }
        //TODO else ?
      });

    });
  }

  getPrev(ff: Fullfill): Fullfill {
    if (ff === this.fullfills.first)
      return;

    let result = this.fullfills.first;

    this.fullfills.some( ffI => {
      if ( ffI === ff)
        return true;
      else
        result = ffI;
    });

    return result;
  }

  getNext(ff: Fullfill): Fullfill {
    if (ff === this.fullfills.last)
      return;

    let foundEl = false,
        result;

    this.fullfills.some( ffI => {
      if (foundEl) {
        result = ffI;
        return true;
      }

      if (ffI === ff)
        foundEl = true;
    });

    return result;
  }

  ngOnDestroy() {
    this.unlistens.forEach(f => f());
  }
}

//utils func
function focusAtStart(ff: Fullfill) {
  try {
    let el = ff.elRef.nativeElement;

    if (el.createTextRange) {
      var part = el.createTextRange();
      part.move("character", 0);
      part.select();
    }
    else if (el.setSelectionRange){
      el.setSelectionRange(0, 0);
    }

    el.focus();
  } catch(e) {}
}

function focusAtEnd(ff: Fullfill) {
  try{
    let el = ff.elRef.nativeElement;

    if (el.createTextRange) {
      var part = el.createTextRange();
      part.move("character", el.value.length);
      part.select();
    }
    else if(el.setSelectionRange !== undefined)
      el.setSelectionRange(el.value.length, el.value.length);
    else
      el.value = el.value;

    el.focus();
  } catch(e) {}
}

function isHTMLElement(e: any):  e is HTMLElement {
	return e.nodeType == Node.ELEMENT_NODE;
}

function isInputElement(e: any): e is HTMLInputElement {
	return isHTMLElement(e) && (e.tagName == 'INPUT' || e.nodeName == 'INPUT');
}
