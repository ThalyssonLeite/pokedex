import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class OverlayService {
  activeOverlay: boolean = false;
  callback: Function;

  // get activeOverlay () {
  //   return this._activeOverlay.asObservable();
  // }

  setOverlay (fn: Function) {
    this.activeOverlay = true;

    this.callback = () => {
      fn();
      this.activeOverlay = false;
    }
  }

  disabelOverlay () {
    this.activeOverlay = false;
  }
}
