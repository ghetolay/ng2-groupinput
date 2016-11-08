import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GroupInputDirective } from './groupinput.directive';
import { FullfillLengthDirective } from './fflength.directive';

let decl_export = [
	GroupInputDirective,
	FullfillLengthDirective
]

@NgModule({
	imports: [
		ReactiveFormsModule
	],
	declarations: decl_export,
	exports: decl_export
})
export class GroupInputModule { }
