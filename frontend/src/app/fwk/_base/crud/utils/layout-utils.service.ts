// Angular
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
// Partials for CRUD

export enum MessageType {
  Create,
  Read,
  Update,
  Delete
}

@Injectable()
export class LayoutUtilsService {
  /**
   * Service constructor
   *
   * @param snackBar: MatSnackBar
   * @param dialog: MatDialog
   */
  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  
}
