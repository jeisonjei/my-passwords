import { Injectable, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class DialogConfigService{

  constructor( private breakpoint: BreakpointObserver) {
   
    this.dialogConfig.width = '35%';
    this.breakpoint.observe(Breakpoints.XSmall).subscribe(v => {
      if (v.matches) {
        this.dialogConfig.width = '90%';
      }
    });
    this.breakpoint.observe(Breakpoints.Small).subscribe(v => {
      if (v.matches) {
        this.dialogConfig.width = '80%';
      }
    });
    this.breakpoint.observe(Breakpoints.Medium).subscribe(v => {
      if (v.matches) {
        this.dialogConfig.width = '60%';
      }
    });
    this.breakpoint.observe(Breakpoints.Large).subscribe(v => {
      if (v.matches) {
        this.dialogConfig.width = '40%';
      }
    });
  }
  dialogConfig = new MatDialogConfig();
  ngOnInit(): void {
    

  }


}
