import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { stopExecution, toExecutingState } from "./process-management.actions";
import { catchError, delay, filter, map, of, switchMap } from "rxjs";
import { Store } from "@ngrx/store";
import { selectIsPreemptive } from "../processes.selectors";

@Injectable()
export class ProcessManagementEffects {

  dispatchEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toExecutingState),
      switchMap(() => this.store.select(selectIsPreemptive).pipe(
          filter(p => !!p),
          switchMap(p => of(p).pipe(delay(p!))),
          map(() => stopExecution()),
          catchError(err => of(err))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store
  ) {
  }
}
